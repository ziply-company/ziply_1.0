from django.urls import path

from .views import BusinessMembersView

urlpatterns = [
    path("members/", BusinessMembersView.as_view(), name="business_members"),
]
