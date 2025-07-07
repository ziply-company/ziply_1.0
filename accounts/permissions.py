from rest_framework.permissions import BasePermission

from business.models import BusinessMember


class isBusinessOwner(BasePermission):
    def has_permission(self, request, view):
        """
        Checks if the user is a business owner.

        :param request: The request object
        :param view: The view object
        :return: True if the user is a business owner, False otherwise
        """
        return BusinessMember.objects.filter(
            user=request.user, role=BusinessMember.OWNER
        ).exists()


class isBusinessAdmin(BasePermission):
    def has_permission(self, request, view):
        """
        Checks if the user is a business admin.

        :param request: The request object
        :param view: The view object
        :return: True if the user is a business admin, False otherwise
        """
        return BusinessMember.objects.filter(
            user=request.user, role__in=[BusinessMember.ADMIN, BusinessMember.OWNER]
        ).exists()


class isBusinessManager(BasePermission):
    def has_permission(self, request, view):
        """
        Checks if the user is a business manager.

        :param request: The request object
        :param view: The view object
        :return: True if the user is a business manager, False otherwise
        """
        return BusinessMember.objects.filter(
            user=request.user,
            role__in=[
                BusinessMember.MANAGER,
                BusinessMember.OWNER,
                BusinessMember.ADMIN,
            ],
        ).exists()


class isBusinessStaff(BasePermission):
    """
    Checks if the user is a member of any business.

    :param request: The request object
    :param view: The view object
    :return: True if the user is a member of any business, False otherwise
    """

    def has_permission(self, request, view):
        return BusinessMember.objects.filter(user=request.user).exists()
