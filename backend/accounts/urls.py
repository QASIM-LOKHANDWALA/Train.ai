from django.urls import path
from .views import register_view, login_view, profile_view, UserProfileView

urlpatterns = [
    path('signup/', register_view),
    path('signin/', login_view),
    path('profile/', UserProfileView.as_view()),
]
