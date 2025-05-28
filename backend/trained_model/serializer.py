from rest_framework import serializers
from .models import TrainedModel

class TrainedModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainedModel
        fields = [
            'id',
            'user_id',
            'model_type',
            'target_column',
            'features',
            'model_file',
            'created_at',
            'is_public'
        ]
        read_only_fields = ['id', 'created_at']
