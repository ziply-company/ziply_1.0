from django.http import HttpResponseForbidden
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import AnonymousUser

from business.models import Business, BusinessMember


class CurrentBusinessMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.jwt_auth = JWTAuthentication()

    def __call__(self, request):
        """
        If the request has a X-Business-Slug header and the user is authenticated,
        set request.business to the corresponding Business instance if it exists
        and the user is a member of the business. Otherwise, return 403 Forbidden.
        If the request does not have a X-Business-Slug header or the user is
        not authenticated, set request.business to None.
        """
        try:
            user_auth_tuple = self.jwt_auth.authenticate(request)
            if user_auth_tuple is not None:
                request.user, _ = user_auth_tuple
        except Exception:
            request.user = AnonymousUser()
        business_slug = request.headers.get("X-Business-Slug")

        request.business = None
        request.role = None
        user = request.user

        if user.is_authenticated and business_slug:
            try:
                business = Business.objects.get(slug=business_slug)
            except Business.DoesNotExist:
                return HttpResponseForbidden("Business not found.")

            try:
                member = BusinessMember.objects.get(user=user, business=business)
            except BusinessMember.DoesNotExist:
                return HttpResponseForbidden("You are not a member of this business.")

            request.business = business
            request.role = member.role

        response = self.get_response(request)
        return response
