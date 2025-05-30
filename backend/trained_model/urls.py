from django.urls import path
from . import views

urlpatterns = [
    path('detail/<str:pk>/', views.ModelDetailView.as_view(), name='model_detail'),
    path('', views.ModelListView.as_view(), name='model_list'),
    path('user/', views.UserTrainedModelView.as_view(), name='user_trained_models')
]
