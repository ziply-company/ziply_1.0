from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from accounts.views import MyTokenObtainPairView, RegisterView

urlpatterns = [
    path("api/token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegisterView.as_view(), name="register"),
]
