from django.conf import settings
from django.db import models


class Business(models.Model):
    name = models.CharField(max_length=255, unique=True, blank=False, null=False)
    slug = models.SlugField(max_length=255, unique=True, blank=False, null=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="owned_businesses",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.name


class BusinessMember(models.Model):
    OWNER = "Owner"
    ADMIN = "Admin"
    STAFF = "Staff"
    ROLES = [
        (OWNER, "Owner"),
        (ADMIN, "Admin"),
        (STAFF, "Staff"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    role = models.CharField(choices=ROLES, max_length=20)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "business")

    def __str__(self):
        return f"{self.user.email} — {self.role} @ {self.business.name}"
