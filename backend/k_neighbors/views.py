from django.core.files import File
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, confusion_matrix, recall_score, precision_score,
    f1_score
)
import pandas as pd
import joblib
from tempfile import NamedTemporaryFile
import os
from django.core.files.images import ImageFile

from trained_model.models import TrainedModel, ModelStats, ModelGraph
from ml_utils.graph_utils import *
from ml_utils.stats_utils import *

class KNeighborsView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def hyperparameter_tuning(self, x_train, y_train, x_test, y_test):
        best_score = 0
        best_params = {}
        for neighbors in range(1, 25):
            model = KNeighborsClassifier(n_neighbors=neighbors)
            model.fit(x_train, y_train)
            y_pred = model.predict(x_test)
            score = accuracy_score(y_test, y_pred)
            if score > best_score:
                best_score = score
                best_params = {'neighbors': neighbors, 'model': model}
        return best_params, best_score
    
    def post(self, request):
        data = request.data
        model_name = data.get('model_name', 'K-Nearest Neighbours')
        target_col = data.get('target_col')
        csv_file = request.FILES['csv_file']
        df = pd.read_csv(csv_file)

        if target_col not in df.columns:
            return Response({"error": "Target column not found in the dataset."}, status=status.HTTP_400_BAD_REQUEST)
        
        if df.isnull().values.sum() > 50:
            return Response({"error": "Dataset contains a large number of null values."}, status=status.HTTP_400_BAD_REQUEST)

        df = df.dropna()
        y = df[target_col].astype(int)
        X = pd.get_dummies(df.drop(columns=[target_col]), drop_first=True)

        x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        best_params, best_score = self.hyperparameter_tuning(x_train, y_train, x_test, y_test)
        model = best_params['model']

        with NamedTemporaryFile(delete=False, suffix=".pkl") as temp_file:
            joblib.dump(model, temp_file.name)

        with open(temp_file.name, 'rb') as f:
            django_file = File(f)
            ml_model = TrainedModel.objects.create(
                model_type=TrainedModel.ModelType.KNN,
                model_name=model_name,
                target_column=target_col,
                features=",".join(X.columns),
                user_id=request.user.id
            )
            ml_model.model_file.save(f"{ml_model.id}_model.pkl", django_file)
            ml_model.save()

        os.remove(temp_file.name)

        # === Model Stats ===
        y_pred = model.predict(x_test)
        y_proba = None
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(x_test)
            if proba.shape[1] == 2:
                y_proba = proba[:, 1]

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

        # 2. ROC & PR Curves (if binary classification)
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
            "model_id": str(ml_model.id),
            "model_name": ml_model.model_name,
            "model_type": ml_model.model_type,
            "best_parameters": {
                "n_neighbors": best_params.get('neighbors')
            },
            "metrics": {
                "accuracy": round(accuracy_score(y_test, y_pred), 4),
                "precision": round(precision_score(y_test, y_pred, average='macro'), 4),
                "recall": round(recall_score(y_test, y_pred, average='macro'), 4),
                "f1_score": round(f1_score(y_test, y_pred, average='macro'), 4)
            },
            "graphs_saved": [
                "Confusion Matrix",
                "ROC Curve" if y_proba is not None else "Not applicable",
                "Precision-Recall Curve" if y_proba is not None else "Not applicable"
            ],
            "status": "Model, stats, and graphs saved successfully."
        }, status=status.HTTP_200_OK)
