from django.urls import path

from .views import BusinessMembersView, BusinessInviteView

urlpatterns = [
    path("members/", BusinessMembersView.as_view(), name="business_members"),
    path("members/invite/", BusinessInviteView.as_view(), name="invite_user"),
]
