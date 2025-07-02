from django.core.signing import BadSignature, TimestampSigner
from django.db import transaction
from django.utils.text import slugify
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from accounts.models import User
from business.models import Business, BusinessMember

from .tasks import send_registration_email

signer = TimestampSigner()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True, required=True)
    business_name = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ("email", "business_name", "name", "password", "token")

    def validate(self, data):
        """
        Validates the token and ensures the email from the token matches the
        email provided in the form data.
        """
        token = data.get("token")
        email = data.get("email")
        try:
            # Set token lifetime to 1 hour (3600 seconds)
            email_from_token = signer.unsign(token, max_age=3600)
        except BadSignature:
            raise serializers.ValidationError({"token": "Invalid or expired token."})  # noqa: B904

        # Security check: ensure the email from the token matches the form data.
        if email_from_token != email:
            raise serializers.ValidationError(
                {"email": "Email does not match the token."}
            )  # noqa: E501

        return data

    @transaction.atomic
    def create(self, validated_data):
        """
        Creates a new user with the given data and also creates a business with
        the user as the owner.

        The user is created with the given data, and a business is created with
        the user as the owner. The business name is based on the user's name and
        ID.

        If the business creation fails for any reason, the user creation is
        rolled back and a validation error is raised.

        Args:
            validated_data (dict): The validated data from the serializer.

        Returns:
            User: The created user.
        """
        password = validated_data.pop("password")
        validated_data.pop("token")  # Remove token before creating user
        business_name = validated_data.pop("business_name")

        # Now validated_data only contains fields relevant to the User model
        user = User.objects.create_user(password=password, **validated_data)  # type: ignore
        # Create business after user
        # If any of these operations fail, the user creation will be rolled back automatically.  # noqa: E501
        business_slug = slugify(f"{business_name}-{user.id}")
        business = Business.objects.create(
            name=business_name, slug=business_slug, owner=user
        )
        BusinessMember.objects.create(
            user=user, business=business, role=BusinessMember.OWNER
        )

        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        """
        Overwrite the get_token method to add custom fields to the token.

        Args:
            user (User): The user object.

        Returns:
            dict: The token with custom fields.
        """
        token = super().get_token(user)
        token["email"] = user.email
        token["name"] = user.name
        return token


class EmailStartSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        """Checks if a user with this email already exists."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists.")
        return value

    def save(self, **kwargs):
        """
        Sends a registration email with a token.

        This method signs the validated email to generate a token and
        sends a registration email containing this token to the specified email address.

        Args:
            **kwargs: Additional keyword arguments.
        """
        email = self.validated_data["email"]
        token = signer.sign(email)
        send_registration_email.delay(email, token)
