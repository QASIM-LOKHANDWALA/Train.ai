from django.core.files import File
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, recall_score
import pandas as pd

import joblib
from tempfile import NamedTemporaryFile
import os

import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    precision_score, f1_score, roc_curve, auc, precision_recall_curve
)
from django.core.files.images import ImageFile
from trained_model.models import TrainedModel, ModelStats, ModelGraph
from ml_utils.graph_utils import *
from ml_utils.stats_utils import *

from trained_model.serializer import ModelStatsSerializer, ModelGraphSerializer

class DecisionTreeView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def hyperparameter_tuning(self, x_train, y_train, x_test, y_test):
        best_score = 0
        best_params = {}
        
        for max_depth in range(1,11):
            model = DecisionTreeClassifier(max_depth=max_depth, random_state=42)
            model.fit(x_train, y_train)
            
            y_pred = model.predict(x_test)
            score = accuracy_score(y_test, y_pred)
            if score > best_score:
                best_score = score
                best_params = {'max_depth': max_depth, 'model': model}
        print(best_params, best_score)
        return best_params, best_score
    
    
    def post(self, request):
        data = request.data
        model_name = data.get('model_name', 'Decision Tree')
        target_col = data.get('target_col')
        csv_file = request.FILES['csv_file']
        df = pd.read_csv(csv_file)

        if target_col not in df.columns:
            return Response({"error": "Target column not found."}, status=status.HTTP_400_BAD_REQUEST)
        if df.isnull().values.any() and df.isnull().sum().sum() > 50:
            return Response({"error": "Dataset contains too many nulls."}, status=status.HTTP_400_BAD_REQUEST)
        df = df.dropna()

        y_raw = df[target_col]
        try:
            y = y_raw.astype(int)
        except ValueError:
            le = LabelEncoder()
            y = le.fit_transform(y_raw)
        X = pd.get_dummies(df.drop(columns=[target_col]), drop_first=True)

        x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        best_params, best_score = self.hyperparameter_tuning(x_train, y_train, x_test, y_test)

        temp_file = NamedTemporaryFile(delete=False, suffix=".pkl")
        joblib.dump(best_params['model'], temp_file.name)

        with open(temp_file.name, 'rb') as f:
            django_file = File(f)
            ml_model = TrainedModel.objects.create(
                model_type=TrainedModel.ModelType.DECISION_TREE,
                model_name=model_name,
                target_column=target_col,
                features=",".join(X.columns),
                user_id=request.user.id
            )
            ml_model.model_file.save(f"{ml_model.id}_model.pkl", django_file)
            ml_model.save()

        # === Model Stats ===
        y_pred = best_params['model'].predict(x_test)
        y_proba = best_params['model'].predict_proba(x_test)[:, 1] if hasattr(best_params['model'], 'predict_proba') else None

        ModelStats.objects.create(
            trained_model=ml_model,
            accuracy=accuracy_score(y_test, y_pred),
            precision=precision_score(y_test, y_pred, average='macro'),
            recall=recall_score(y_test, y_pred, average='macro'),
            f1_score=f1_score(y_test, y_pred, average='macro'),
        )

        # === Graphs ===
        graph_dir = 'media/graphs'
        os.makedirs(graph_dir, exist_ok=True)

        # 1. Confusion Matrix
        cm_path = os.path.join(graph_dir, f'cm_{ml_model.id}.png')
        save_confusion_matrix_graph(y_test, y_pred, cm_path)
        with open(cm_path, 'rb') as img_file:
            ModelGraph.objects.create(
                trained_model=ml_model,
                title="Confusion Matrix",
                description="Shows TP, FP, FN, TN",
                graph_image=ImageFile(img_file, name=os.path.basename(cm_path))
            )

        # 2. ROC Curve
        if y_proba is not None:
            roc_path = os.path.join(graph_dir, f'roc_{ml_model.id}.png')
            save_roc_curve_graph(y_test, y_proba, roc_path)
            with open(roc_path, 'rb') as img_file:
                ModelGraph.objects.create(
                    trained_model=ml_model,
                    title="ROC Curve",
                    description="Shows model's ability to distinguish classes",
                    graph_image=ImageFile(img_file, name=os.path.basename(roc_path))
                )

            # 3. Precision-Recall Curve
            pr_path = os.path.join(graph_dir, f'pr_{ml_model.id}.png')
            save_precision_recall_graph(y_test, y_proba, pr_path)
            with open(pr_path, 'rb') as img_file:
                ModelGraph.objects.create(
                    trained_model=ml_model,
                    title="Precision-Recall Curve",
                    description="Shows trade-off between precision and recall",
                    graph_image=ImageFile(img_file, name=os.path.basename(pr_path))
                )

        return Response({
            "message": "Model, statistics, and graphs saved successfully.",
            "model": {
                "id": str(ml_model.id),
                "name": ml_model.model_name,
                "type": ml_model.model_type,
                "polynomial_degree": ml_model.polynomial_degree,
                "target_column": ml_model.target_column,
                "features": ml_model.features,
                "is_public": ml_model.is_public,
                "likes": ml_model.likes,
                "created_at": ml_model.created_at,
            },
            "metrics": ModelStatsSerializer(ml_model.stats).data if hasattr(ml_model, "stats") else {},
            "graphs": ModelGraphSerializer(ml_model.graphs.all(), many=True).data,
            "coefficients": (
                ml_model.coef_.tolist() if hasattr(ml_model, "coef_") else None
            ),
            "intercept": (
                ml_model.intercept_.tolist() if hasattr(ml_model, "intercept_") else None
            ),
        }, status=status.HTTP_200_OK)
