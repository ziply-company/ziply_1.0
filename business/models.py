from django.conf import settings
from django.db import models


class Business(models.Model):
    name: models.CharField = models.CharField(
        max_length=255, unique=True, blank=False, null=False
    )
    slug: models.SlugField = models.SlugField(
        max_length=255, unique=True, blank=False, null=False
    )
    owner: models.ForeignKey = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="owned_businesses",
    )
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.name


class BusinessMember(models.Model):
    OWNER = "Owner"
    ADMIN = "Admin"
    MANAGER = "Manager"
    STAFF = "Staff"
    ROLES = [
        (OWNER, "Owner"),
        (ADMIN, "Admin"),
        (MANAGER, "Manager"),
        (STAFF, "Staff"),
    ]

    user: models.ForeignKey = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )
    business: models.ForeignKey = models.ForeignKey(Business, on_delete=models.CASCADE)
    role: models.CharField = models.CharField(choices=ROLES, max_length=20)
    joined_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "business")

    def __str__(self) -> str:
        return f"{self.user.email} — {self.role} @ {self.business.name}"


class BusinessInvite(models.Model):
    email: models.EmailField = models.EmailField()
    business: models.ForeignKey = models.ForeignKey(Business, on_delete=models.CASCADE)
    role: models.CharField = models.CharField(
        choices=BusinessMember.ROLES, max_length=20
    )
    token: models.CharField = models.CharField(max_length=255, unique=True)
    invited_by: models.ForeignKey = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )
    is_accepted: models.BooleanField = models.BooleanField(default=False)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("email", "business")
