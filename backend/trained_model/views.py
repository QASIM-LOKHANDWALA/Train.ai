from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from django.http import Http404

import json
import joblib
from sklearn.preprocessing import PolynomialFeatures
import numpy as np

from .models import TrainedModel
from .serializer import TrainedModelSerializer, ModelStatsSerializer, ModelGraphSerializer

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
        
        model_coefficients = None
        model_intercept = None
        
        try:
            model_file = trained_model.model_file.path
            model = joblib.load(model_file)
            
            model_coefficients = model.coef_.tolist() if hasattr(model, "coef_") else None
            model_intercept = model.intercept_.tolist() if hasattr(model, "intercept_") else None
        except Exception as e:
            pass
        
        return Response({
            "message": "Model data retrieved successfully.",
            "model": {
                "id": str(trained_model.id),
                "name": trained_model.model_name,
                "type": trained_model.model_type,
                "polynomial_degree": trained_model.polynomial_degree,
                "target_column": trained_model.target_column,
                "features": trained_model.features,
                "is_public": trained_model.is_public,
                "likes": trained_model.likes,
                "created_at": trained_model.created_at,
            },
            "metrics": ModelStatsSerializer(trained_model.stats).data if hasattr(trained_model, "stats") else {},
            "graphs": ModelGraphSerializer(trained_model.graphs.all(), many=True).data,
            "coefficients": model_coefficients,
            "intercept": model_intercept,
        }, status=status.HTTP_200_OK)
    
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

class ModelUpdateView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk):
        try:
            return TrainedModel.objects.get(pk=pk)
        except TrainedModel.DoesNotExist:
            raise Http404
    
    def put(self, request, pk):
        trained_model = self.get_object(pk)
        state = request.data['state']
        if state == 'like':
            trained_model.likes += 1
        elif state == 'dislike' and trained_model.likes > 0:
            trained_model.likes -= 1
        else:
            return Response({'error': 'Invalid state'}, status=status.HTTP_400_BAD_REQUEST)
        trained_model.save()
        serializer = TrainedModelSerializer(trained_model)
        return Response(serializer.data, status=status.HTTP_200_OK)
  
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getUserLikedModels(request):
    try:
        data = json.loads(request.body)
        model_ids = data.get('models', [])

        if not isinstance(model_ids, list):
            return Response({"error": "'models' must be a list of IDs."}, status=status.HTTP_400_BAD_REQUEST)

        liked_models = TrainedModel.objects.filter(id__in=model_ids)
        serializer = TrainedModelSerializer(liked_models, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except json.JSONDecodeError:
        return Response({"error": "Invalid JSON format."}, status=status.HTTP_400_BAD_REQUEST)