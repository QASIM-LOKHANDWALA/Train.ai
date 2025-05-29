from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from django.http import Http404

from .models import TrainedModel
from .serializer import TrainedModelSerializer

import joblib
from sklearn.preprocessing import PolynomialFeatures
import numpy as np

class UserTrainedModelView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        userId = request.user.id
        trained_models = TrainedModel.objects.filter(user_id=userId)
        serializer = TrainedModelSerializer(trained_models, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)    

class ModelListView(APIView):
    
    def get(self, request):
        trained_models = TrainedModel.objects.filter(is_public=True)
        serializer = TrainedModelSerializer(trained_models, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ModelDetailView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk):
        try:
            return TrainedModel.objects.get(pk=pk)
        except TrainedModel.DoesNotExist:
            raise Http404
        
    def get(self, request, pk):
        trained_model = self.get_object(pk)
        serializer = TrainedModelSerializer(trained_model)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, pk):
        trained_model = self.get_object(pk)
        model_file = trained_model.model_file.path

        try:
            model = joblib.load(model_file)
        except Exception as e:
            return Response({'error': f"Error loading model: {e}"}, status=500)

        features_input = request.data.get('features')
        if not features_input or not isinstance(features_input, list):
            return Response({'error': 'Invalid or missing "features" list'}, status=400)

        try:
            features_array = np.array(features_input).reshape(1, -1)
            prediction = model.predict(features_array)

        except Exception as e:
            return Response({'error': f'Prediction failed: {str(e)}'}, status=500)

        return Response({'prediction': prediction.tolist()}, status=200)

    
    def put(self, request, pk):
        trained_model = self.get_object(pk)
        data = {
            'is_public': not trained_model.is_public
        }
        serializer = TrainedModelSerializer(trained_model, data=data, partial=True)
        if(serializer.is_valid()):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)