from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, recall_score
import pandas as pd


class DecisionTreeView(APIView):
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
        return best_params, best_score
    
    
    def post(self, request):
        data = request.data
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
        
        print("y type:", type(y))
        print("y dtype:", y.dtype)
        print("y unique values:", y.unique())
        print("y shape:", y.shape)
        
        x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        print("x_train type:", type(x_train))
        print("x_train shape:", x_train.shape)
        print("x_train head:\n", x_train.head())
        
        best_params, best_score = self.hyperparameter_tuning(x_train, y_train, x_test, y_test)
        
        return Response({
            "best_params": best_params.get('max_depth'),
            "best_score": best_score,
            "confusion_matrix": confusion_matrix(y_test, best_params['model'].predict(x_test)).tolist(),
            "recall_score": recall_score(y_test, best_params['model'].predict(x_test), average='weighted')
        },status=status.HTTP_200_OK)