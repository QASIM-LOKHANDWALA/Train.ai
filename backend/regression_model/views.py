from django.core.files import File
from django.core.files.images import ImageFile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import pandas as pd
import joblib
import os
from tempfile import NamedTemporaryFile

from trained_model.models import TrainedModel, ModelStats, ModelGraph
from ml_utils.graph_utils import (
    save_residual_plot,
    save_actual_vs_predicted_plot,
    save_error_distribution_plot,
    save_qq_plot
)
from ml_utils.stats_utils import calculate_regression_metrics

class LinearRegressionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        model_name = data.get('model_name', 'Linear Regression')
        target_col = data.get('target_col')

        if 'csv_file' not in request.FILES:
            return Response({"error": "CSV file is missing."}, status=status.HTTP_400_BAD_REQUEST)

        df = pd.read_csv(request.FILES['csv_file'])

        if target_col not in df.columns:
            return Response({"error": "Target column not found in the dataset."}, status=status.HTTP_400_BAD_REQUEST)

        if df.isnull().values.sum() > 50:
            return Response({"error": "Dataset contains a large number of null values."}, status=status.HTTP_400_BAD_REQUEST)

        df = df.dropna()
        X = pd.get_dummies(df.drop(columns=[target_col]), drop_first=True)
        y = df[target_col]

        x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        model = LinearRegression()
        model.fit(x_train, y_train)
        y_pred = model.predict(x_test)

        metrics = calculate_regression_metrics(y_test, y_pred)

        temp_file = NamedTemporaryFile(delete=False, suffix=".pkl")
        joblib.dump(model, temp_file.name)

        with open(temp_file.name, 'rb') as f:
            django_file = File(f)
            ml_model = TrainedModel.objects.create(
                model_type=TrainedModel.ModelType.LINEAR_REGRESSION,
                model_name=model_name,
                target_column=target_col,
                features=",".join(X.columns),
                user_id=request.user.id
            )
            ml_model.model_file.save(f"{ml_model.id}_model.pkl", django_file)
            ml_model.save()


        # os.remove(temp_file.name)

        ModelStats.objects.create(
            trained_model=ml_model,
            r2_score=metrics["r2_score"],
            mse=metrics["mse"],
            mae=metrics["mae"]
        )

        graph_dir = 'media/graphs'
        os.makedirs(graph_dir, exist_ok=True)

        residual_path = os.path.join(graph_dir, f"residual_{ml_model.id}.png")
        pred_path = os.path.join(graph_dir, f"pred_{ml_model.id}.png")
        err_dist_path = os.path.join(graph_dir, f"err_dist_{ml_model.id}.png")
        qq_path = os.path.join(graph_dir, f"qq_{ml_model.id}.png")

        save_residual_plot(y_test, y_pred, residual_path)
        save_actual_vs_predicted_plot(y_test, y_pred, pred_path)
        save_error_distribution_plot(y_test, y_pred, err_dist_path)
        save_qq_plot(y_test, y_pred, qq_path)

        for path, title, desc in [
            (residual_path, "Residual Plot", "Shows residuals vs predictions"),
            (pred_path, "Actual vs Predicted", "Compares predicted vs actual values"),
            (err_dist_path, "Error Distribution", "Distribution of prediction errors"),
            (qq_path, "Q-Q Plot", "Check if residuals are normally distributed")
        ]:
            with open(path, 'rb') as img_file:
                ModelGraph.objects.create(
                    trained_model=ml_model,
                    title=title,
                    description=desc,
                    graph_image=ImageFile(img_file, name=os.path.basename(path))
                )

        return Response({
            "model_id": str(ml_model.id),
            "model_name": ml_model.model_name,
            "model_type": ml_model.model_type,
            "metrics": {k: round(v, 4) for k, v in metrics.items()},
            "coefficients": model.coef_.tolist(),
            "intercept": model.intercept_.tolist(),
            "status": "Model, stats, and graphs saved successfully."
        }, status=status.HTTP_200_OK)


class PolynomialRegressionView(APIView):
    permission_classes = [IsAuthenticated]

    def polynomial_degree_trainer(self, degree, x_train, y_train, x_test, y_test):
        poly = PolynomialFeatures(degree=degree)
        model = LinearRegression()
        pipeline = make_pipeline(poly, model)
        pipeline.fit(x_train, y_train)
        y_pred = pipeline.predict(x_test)
        metrics = calculate_regression_metrics(y_test, y_pred)
        return pipeline, metrics

    def post(self, request):
        data = request.data
        model_name = data.get('model_name', 'Polynomial Regression')
        target_col = data.get('target_col')
        csv_file = request.FILES['csv_file']
        df = pd.read_csv(csv_file)

        if target_col not in df.columns:
            return Response({"error": "Target column not found in the dataset."}, status=status.HTTP_400_BAD_REQUEST)
        if df.isnull().values.sum() > 50:
            return Response({"error": "Dataset contains a large number of null values."}, status=status.HTTP_400_BAD_REQUEST)

        df = df.dropna()
        X = pd.get_dummies(df.drop(columns=[target_col]), drop_first=True)
        y = df[target_col]

        x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        best_r2 = float('-inf')
        best_degree = 0
        best_metrics = {}
        best_pipeline = None

        for degree in range(1, 10):
            pipeline, metrics = self.polynomial_degree_trainer(degree, x_train, y_train, x_test, y_test)
            if metrics['r2_score'] > best_r2:
                best_r2 = metrics['r2_score']
                best_degree = degree
                best_metrics = metrics
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
                user_id=request.user.id
            )
            ml_model.model_file.save(f"{ml_model.id}_model.pkl", django_file)
            ml_model.save()

        # os.remove(temp_file.name)

        ModelStats.objects.create(
            trained_model=ml_model,
            r2_score=best_metrics["r2_score"],
            mse=best_metrics["mse"],
            mae=best_metrics["mae"]
        )

        y_pred = best_pipeline.predict(x_test)

        graph_dir = 'media/graphs'
        os.makedirs(graph_dir, exist_ok=True)

        residual_path = os.path.join(graph_dir, f"residual_{ml_model.id}.png")
        pred_path = os.path.join(graph_dir, f"pred_{ml_model.id}.png")
        err_dist_path = os.path.join(graph_dir, f"err_dist_{ml_model.id}.png")
        qq_path = os.path.join(graph_dir, f"qq_{ml_model.id}.png")

        save_residual_plot(y_test, y_pred, residual_path)
        save_actual_vs_predicted_plot(y_test, y_pred, pred_path)
        save_error_distribution_plot(y_test, y_pred, err_dist_path)
        save_qq_plot(y_test, y_pred, qq_path)

        for path, title, desc in [
            (residual_path, "Residual Plot", "Shows residuals vs predictions"),
            (pred_path, "Actual vs Predicted", "Compares predicted vs actual values"),
            (err_dist_path, "Error Distribution", "Distribution of prediction errors"),
            (qq_path, "Q-Q Plot", "Check if residuals are normally distributed")
        ]:
            with open(path, 'rb') as img_file:
                ModelGraph.objects.create(
                    trained_model=ml_model,
                    title=title,
                    description=desc,
                    graph_image=ImageFile(img_file, name=os.path.basename(path))
                )

        linear_model = best_pipeline.named_steps['linearregression']

        return Response({
            "model_id": str(ml_model.id),
            "model_name": ml_model.model_name,
            "model_type": ml_model.model_type,
            "best_degree": best_degree,
            "metrics": {k: round(v, 4) for k, v in best_metrics.items()},
            "coefficients": linear_model.coef_.tolist(),
            "intercept": linear_model.intercept_.tolist(),
            "status": "Model, stats, and graphs saved successfully."
        }, status=status.HTTP_200_OK)