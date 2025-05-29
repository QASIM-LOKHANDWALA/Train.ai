from django.core.files import File
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures
import pandas as pd

import joblib
from tempfile import NamedTemporaryFile
import os

from trained_model.models import TrainedModel


class LinearRegressionView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        data = request.data
        model_name = data.get('model_name', 'Linear Regression')
        target_col = data.get('target_col')
        csv_file = request.FILES['csv_file']
        df = pd.read_csv(csv_file)
        
        if target_col not in df.columns:
            return Response({"error": "Target column not found in the dataset."}, status=status.HTTP_400_BAD_REQUEST)
        
        if df.isnull().values.any() and df.isnull().values.sum() > 50:
            return Response({"error": "Dataset contains a large number of null values."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            df = df.dropna()
        
        X = pd.get_dummies(df.drop(columns=[target_col]), drop_first=True)
        y = df[target_col]
        
        x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        model = LinearRegression()
        
        model.fit(x_train, y_train)
        y_pred = model.predict(x_test)
        
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        temp_file = NamedTemporaryFile(delete=False, suffix=".pkl")
        joblib.dump(model, temp_file.name)
        
        with open(temp_file.name, 'rb') as f:
            django_file = File(f)
            ml_model = TrainedModel.objects.create(
                model_type=TrainedModel.ModelType.LINEAR_REGRESSION,
                model_name=model_name,
                target_column=target_col,
                features=",".join(X.columns),
                user_id=request.user.id if request.user.is_authenticated else "None"
            )
            ml_model.model_file.save(f"{ml_model.id}_model.pkl", django_file)
            ml_model.save()
        
        response_data = {
            'mean_squared_error': mse,
            'r2_score': r2,
            'coefficients': model.coef_.tolist(),
            'intercept': model.intercept_.tolist()                
        }
        return Response(response_data, status=status.HTTP_200_OK)


class PolynomialRegressionView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    
    def polynomial_degree_trainer(self, degree, x_train, y_train, x_test, y_test):
        poly = PolynomialFeatures(degree=degree)
        model = LinearRegression()
        pipeline = make_pipeline(poly, model)

        pipeline.fit(x_train, y_train)
        y_pred = pipeline.predict(x_test)

        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        return pipeline, r2, mse
    
    def post(self, request):
        data = request.data
        model_name = data.get('model_name', 'Polynomial Regression')
        target_col = data.get('target_col')
        csv_file = request.FILES['csv_file']
        df = pd.read_csv(csv_file)

        if target_col not in df.columns:
            return Response({"error": "Target column not found in the dataset."}, status=status.HTTP_400_BAD_REQUEST)

        if df.isnull().values.any() and df.isnull().values.sum() > 50:
            return Response({"error": "Dataset contains a large number of null values."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            df = df.dropna()
        
        X = pd.get_dummies(df.drop(columns=[target_col]), drop_first=True)
        y = df[target_col]

        x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        best_r2 = float('-inf')
        best_degree = 0
        best_mse = float('inf')
        best_pipeline = None

        for i in range(1, 10):
            pipeline, r2, mse = self.polynomial_degree_trainer(i, x_train, y_train, x_test, y_test)
            print(f"Degree: {i}, R2: {r2}, MSE: {mse}")
            if r2 > best_r2:
                best_r2 = r2
                best_degree = i
                best_mse = mse
                best_pipeline = pipeline
        
        temp_file = NamedTemporaryFile(delete=False, suffix=".pkl")
        joblib.dump(best_pipeline, temp_file.name)
        
        with open(temp_file.name, 'rb') as f:
            django_file = File(f)
            ml_model = TrainedModel.objects.create(
                model_type=TrainedModel.ModelType.POLYNOMIAL_REGRESSION,
                model_name=model_name,
                polynomial_degree=best_degree,
                target_column=target_col,
                features=",".join(X.columns),
                user_id=request.user.id if request.user.is_authenticated else "None"
            )
            ml_model.model_file.save(f"{ml_model.id}_model.pkl", django_file)
            ml_model.save()
        
        linear_model = best_pipeline.named_steps['linearregression']
        
        response_data = {
            'degree': best_degree,
            'mean_squared_error': best_mse,
            'r2_score': best_r2,
            'coefficients': linear_model.coef_.tolist(),
            'intercept': linear_model.intercept_.tolist()
        }
        return Response(response_data, status=status.HTTP_200_OK)
