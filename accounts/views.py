from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers import RegisterSerializer


class RegisterView(APIView):
    def post(self, request):
        """
        API endpoint for user registration.

        Creates a User and a Business and stores them in the database.

        Args:
            request (Request): The request object containing the data for the new user.

        Returns:
            Response: A response object containing either a success message or the errors.
        """
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User and Business created."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
