from django.core.files import File
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, recall_score
import pandas as pd

import joblib
from tempfile import NamedTemporaryFile
import os

from trained_model.models import TrainedModel

class KNeighborsView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def hyperparameter_tuning(self, x_train, y_train, x_test, y_test):
        best_score = 0
        best_params = {}
        
        for neighbors in range(1,25):
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
        
        if df.isnull().values.any():
            return Response({"error": "Dataset contains null values."}, status=status.HTTP_400_BAD_REQUEST)
        
        y = df[target_col].astype(int)
        X = df.drop(columns=[target_col])

        X = pd.get_dummies(X, drop_first=True)
        
        x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        best_params, best_score = self.hyperparameter_tuning(x_train, y_train, x_test, y_test)
        
        temp_file = NamedTemporaryFile(delete=False, suffix=".pkl")
        joblib.dump(best_params['model'], temp_file.name)
        
        with open(temp_file.name, 'rb') as f:
            django_file = File(f)
            ml_model = TrainedModel.objects.create(
                model_type=TrainedModel.ModelType.KNN,
                model_name=model_name,
                target_column=target_col,
                features=",".join(X.columns),
                user_id=request.user.id if request.user.is_authenticated else "None"
            )
            ml_model.model_file.save(f"{ml_model.id}_model.pkl", django_file)
            ml_model.save()
        
        return Response({
            "best_params": best_params.get('neighbors'),
            "best_score": best_score,
            "confusion_matrix": confusion_matrix(y_test, best_params['model'].predict(x_test)).tolist(),
            "recall_score": recall_score(y_test, best_params['model'].predict(x_test), average='weighted')
        },status=status.HTTP_200_OK)
        
        