from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    EmailStartSerializer,
    MyTokenObtainPairSerializer,
    RegisterSerializer,
)


class RegisterView(APIView):
    def post(self, request):
        """
        API endpoint for final user registration with a token.

        Validates the token from the email confirmation link, creates a User
        and a Business, and stores them in the database.

        Args:
            request (Request): The request object containing the user data and token.

        Returns:
            Response: A response object containing either a success message or the errors.
        """
        # All validation logic, including token checks, is now handled by the serializer.
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Automatically log in the user by generating JWT tokens
            refresh = MyTokenObtainPairSerializer.get_token(user)

            return Response(
                {
                    "message": "User and Business created successfully.",
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class EmailStartView(APIView):
    def post(self, request):
        """
        API endpoint for starting the email confirmation process.

        Takes an email address as the only argument and sends a
        confirmation email to that address.

        Args:
            request (Request): The request object containing the email address.

        Returns:
            Response: A response object containing either a success message or the errors.
        """
        serializer = EmailStartSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Email confirmation started."},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
