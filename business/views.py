from django.core.signing import TimestampSigner
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import isBusinessManager
from business.models import BusinessMember
from business.serializers import (
    BusinessInviteSerrializer,
    BusinessMemberSerializer,
    InvitationAcceptSerializer,
    InvitationTokenValidationSerializer,
)

signer = TimestampSigner()


class BusinessMembersView(APIView):
    permission_classes = [IsAuthenticated, isBusinessManager]

    def get(self, request):
        """
        Return a list of all members of the current business.

        :param request: The request object
        :return: A list of BusinessMember objects
        """
        business = request.business
        members = BusinessMember.objects.filter(business=business).select_related(
            "user"
        )
        serializer = BusinessMemberSerializer(members, many=True)
        return Response(serializer.data)


class BusinessInviteView(APIView):
    permission_classes = [IsAuthenticated, isBusinessManager]

    def post(self, request):
        """
        Creates a new BusinessInvite and sends an invitation email.

        Args:
            request: The request object containing the invitation data.

        Returns:
            Response: A response object containing either a success message or the errors.
        """
        serializer = BusinessInviteSerrializer(
            data=request.data,
            context={"request": request, "business": request.business},
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Invitation sent successfully."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InvitationTokenValidationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Validates the given token and ensures it matches an existing, unaccepted
        BusinessInvite instance.

        Args:
            request (Request): The request object containing the token.

        Returns:
            Response: A response object containing either a success message or the errors.
        """
        serializer = InvitationTokenValidationSerializer(
            data=request.data, context={"business": request.business}
        )
        if serializer.is_valid():
            return Response(
                {
                    "email": serializer.validated_data["email"],
                    "role": serializer.validated_data["role"],
                    "business_name": serializer.validated_data["business"].name,
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InvitationAcceptView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = InvitationAcceptSerializer(data=request.data)
        """
    Accepts an invitation using the provided token and creates a user account.

    Validates the token and ensures it matches an existing, unaccepted BusinessInvite
    instance. If valid, a user account is created and the invitation is marked as accepted.

    Args:
        request (Request): The request object containing the token and additional data.

    Returns:
        Response: A response object containing a success message if the invitation
        is accepted, or the errors if the validation fails.
        """

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Invitation accepted. Account created."})
        return Response(serializer.errors, status=400)
