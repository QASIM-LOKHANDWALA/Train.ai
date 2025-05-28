from django.urls import path
from . import views

urlpatterns = [
    path('<str:pk>/', views.ModelDetailView.as_view(), name='model_detail')
]
