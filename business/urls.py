from django.urls import path

from .views import (
    BusinessInviteView,
    BusinessMembersView,
    InvitationAcceptView,
    InvitationTokenValidationView,
)

urlpatterns = [
    path("members/", BusinessMembersView.as_view(), name="business_members"),
    path("members/invite/", BusinessInviteView.as_view(), name="invite_user"),
    path(
        "members/invite-confirm/",
        InvitationTokenValidationView.as_view(),
        name="invite_confirm",
    ),
    path(
        "members/invite-accept/", InvitationAcceptView.as_view(), name="invite_accept"
    ),
]
