from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import isBusinessManager
from business.models import BusinessMember
from business.serializers import BusinessInviteSerrializer, BusinessMemberSerializer


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
