from django.db import models
import uuid

# Create your models here.
class TrainedModel(models.Model):
    class ModelType(models.TextChoices):
        LINEAR_REGRESSION = 'LinearRegression', 'Linear Regression'
        DECISION_TREE = 'DecisionTree', 'Decision Tree'
        KNN = 'KNN', 'K-Nearest Neighbors'

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    user_id = models.CharField(max_length=100)
    model_type = models.CharField(
        max_length=50,
        choices=ModelType.choices
    )
    target_column = models.CharField(max_length=100)
    features = models.TextField(null=True, blank=True)
    model_file = models.FileField(upload_to='models/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_public = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.model_type} | Target: {self.target_column}"