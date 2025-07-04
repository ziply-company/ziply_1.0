from rest_framework import serializers
from django.core.signing import TimestampSigner

from business.models import BusinessMember, BusinessInvite
from business.tasks import send_invitation_email

signer = TimestampSigner()


class BusinessMemberSerializer(serializers.ModelSerializer):
    """
    A serializer for the BusinessMember model.

    This serializer converts a BusinessMember instance into a dictionary with the following fields:
    - email: The email address of the associated User instance.
    - name: The name of the associated User instance.
    - role: The role of the BusinessMember instance.
    - joined_at: The date and time the BusinessMember instance was created.

    Attributes:
        email (serializers.EmailField): The email address of the associated User instance.
        name (serializers.CharField): The name of the associated User instance.

    Meta:
        model (BusinessMember): The model that this serializer is for.
        fields (list): The fields from the model that should be included in the serialized data.
    """  # noqa: E501

    email = serializers.EmailField(source="user.email")
    name = serializers.CharField(source="user.name")

    class Meta:
        model = BusinessMember
        fields = ["email", "name", "role", "joined_at"]


class BusinessInviteSerrializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessInvite
        fields = ["email", "role"]

    def validate_role(self, value):

        """
        Validates the role of a BusinessInvite.

        Raises a ValidationError if the role is not one of the allowed roles.

        Args:
            value (str): The role to validate.

        Returns:
            str: The validated role.
        """

        if value not in dict(BusinessMember.ROLES):
            raise serializers.ValidationError("Invalid role specified.")
        return value

    def validate_email(self, value):

        """
        Validates the email address of a BusinessInvite.

        Raises a ValidationError if an invite with the given email already exists, or if an invite with the given email is already pending.

        Args:
            value (str): The email address to validate.

        Returns:
            str: The validated email address.
        """
        business = self.context["business"]
        if BusinessInvite.objects.filter(email=value, business=business).exists():
            raise serializers.ValidationError("An invite with this email already exists.")
        if BusinessInvite.objects.filter(email=value, business=business, is_accepted=False).exists():
            raise serializers.ValidationError("An invite with this email is already pending.")
        return value

    def create(self, validated_data):
        """
        Creates a new BusinessInvite with the given data and sends an invitation email.

        Args:
            validated_data (dict): The validated data from the serializer.

        Returns:
            BusinessInvite: The created BusinessInvite.
        """
        request = self.context.get("request")
        business = self.context.get("business")

        if not request or not business:
            raise ValueError("Request and business must be provided in serializer context.")

        email = validated_data["email"]
        role = validated_data["role"]
        token_data = f"{email}:{business.id}:{role}"
        token = signer.sign(token_data)

        invite = BusinessInvite.objects.create(
            email=email,
            role=role,
            token=token,
            business=business,
            invited_by=request.user
        )
        send_invitation_email.delay(email, token, business.name, request.user.name)
        return invite
