from django.urls import path
from .views import register_view, login_view, logout_view, update_premium_status, UserProfileView

urlpatterns = [
    path('signup/', register_view),
    path('signin/', login_view),
    path('signout/', logout_view),
    path('profile/', UserProfileView.as_view()),
    path('set-premium/', update_premium_status),
]
