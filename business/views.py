from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import isBusinessManager
from business.models import BusinessMember
from business.serializers import BusinessMemberSerializer


class BusinessMembersView(APIView):
    permission_classes = [IsAuthenticated, isBusinessManager]

    def get(self, request):
        business = request.business
        members = BusinessMember.objects.filter(business=business).select_related("user")
        serializer = BusinessMemberSerializer(members, many=True)
        return Response(serializer.data)
