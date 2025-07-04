from django.contrib import admin

from .models import Business, BusinessInvite, BusinessMember


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "owner", "created_at")
    search_fields = ("name", "slug", "owner__email")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(BusinessMember)
class BusinessMemberAdmin(admin.ModelAdmin):
    list_display = ("user", "business", "role", "joined_at")
    list_filter = ("business", "role")
    search_fields = ("user__email", "business__name")


@admin.register(BusinessInvite)
class BusinessInviteAdmin(admin.ModelAdmin):
    list_display = ("email", "business", "role", "invited_by", "is_accepted", "created_at")
    list_filter = ("business", "role", "is_accepted")
    search_fields = ("email", "business__name", "invited_by__email")
