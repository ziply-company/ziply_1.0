from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from accounts.views import UserDetailView

from accounts.views import EmailStartView, MyTokenObtainPairView, RegisterView

urlpatterns = [
    path("api/token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegisterView.as_view(), name="register"),
    path(
        "email-start/",
        EmailStartView.as_view(),
        name="email_start",
    ),
    path('me/', UserDetailView.as_view(), name='user-detail'),

]
