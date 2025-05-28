from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404

from .models import TrainedModel
from .serializer import TrainedModelSerializer

class ModelDetailView(APIView):
    def get_object(self, pk):
        try:
            return TrainedModel.objects.get(pk=pk)
        except TrainedModel.DoesNotExist:
            raise Http404
        
    def get(self, request, pk):
        trained_model = self.get_object(pk)
        serializer = TrainedModelSerializer(trained_model)
        return Response(serializer.data, status=status.HTTP_200_OK)