from django.core.signing import BadSignature, SignatureExpired, TimestampSigner
from rest_framework import serializers

from accounts.models import User
from business.models import Business, BusinessInvite, BusinessMember
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
            raise serializers.ValidationError(
                "An invite with this email already exists."
            )
        if BusinessInvite.objects.filter(
            email=value, business=business, is_accepted=False
        ).exists():
            raise serializers.ValidationError(
                "An invite with this email is already pending."
            )
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
            raise ValueError(
                "Request and business must be provided in serializer context."
            )

        email = validated_data["email"]
        role = validated_data["role"]
        token_data = f"{email}:{business.id}:{role}"
        token = signer.sign(token_data)

        invite = BusinessInvite.objects.create(
            email=email,
            role=role,
            token=token,
            business=business,
            invited_by=request.user,
        )
        send_invitation_email.delay(email, token, business.name, request.user.name)
        return invite


class InvitationTokenValidationSerializer(serializers.Serializer):
    token = serializers.CharField()

    def validate_token(self, value):
        """
        Validates the token from the invitation email.

        Checks if the token has expired (24 hours after signing) or if the signature
        is invalid.

        Args:
            value (str): The token to validate.

        Returns:
            str: The validated token.

        Raises:
            serializers.ValidationError: If the token is invalid or has expired.
        """

        try:
            original = signer.unsign(value, max_age=60 * 60 * 24)
        except SignatureExpired as exc:
            raise serializers.ValidationError("This token has expired.") from exc
        except BadSignature as exc:
            raise serializers.ValidationError("Invalid token.") from exc
        return original

    def validate(self, attrs):
        """
        Validates the given token and ensures it matches an existing, unaccepted
        BusinessInvite instance.

        Args:
            attrs (dict): The validated data from the serializer.

        Returns:
            dict: The validated data with the email, role, business, and invite
            instance added to it.

        Raises:
            ValidationError: If the token is invalid or does not match an
            existing, unaccepted BusinessInvite instance.
        """

        original = attrs.get("token")

        try:
            email, business_id, role = original.split(":")
        except ValueError as exc:
            raise serializers.ValidationError("Invalid token format.") from exc

        try:
            business = Business.objects.get(id=int(business_id))
        except Business.DoesNotExist as exc:
            raise serializers.ValidationError("Business not found.") from exc

        if business.id != int(business_id):
            raise serializers.ValidationError("Business ID does not match the token.")

        token = self.initial_data["token"]
        invite_qs = BusinessInvite.objects.filter(
            email=email, business=business, token=token, is_accepted=False
        )
        if not invite_qs.exists():
            raise serializers.ValidationError("No valid invite found for this token.")

        attrs["email"] = email
        attrs["role"] = role
        attrs["business"] = business
        attrs["invite"] = invite_qs.first()

        return attrs


class InvitationAcceptSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate_token(self, value):
        """
        Validates the given token and ensures it matches an existing, unaccepted
        BusinessInvite instance.

        Checks if the token has expired (24 hours after signing) or if the signature
        is invalid. If the token is valid, it checks if the invite associated with
        the token exists and has not been accepted yet.

        Args:
            value (str): The token to validate.

        Returns:
            str: The validated token.

        Raises:
            serializers.ValidationError: If the token is invalid or has expired.
        """

        try:
            original = signer.unsign(value, max_age=60 * 60 * 24)
        except SignatureExpired as exc:
            raise serializers.ValidationError("This token has expired.") from exc
        except BadSignature as exc:
            raise serializers.ValidationError("Invalid token.") from exc

        try:
            email, business_id, role = original.split(":")
        except ValueError as exc:
            raise serializers.ValidationError("Invalid token format.") from exc

        try:
            business = Business.objects.get(id=int(business_id))
        except Business.DoesNotExist as exp:
            raise serializers.ValidationError("Business not found.") from exp

        if business.id != int(business_id):
            raise serializers.ValidationError("Business ID does not match the token.")

        if BusinessInvite.objects.filter(
            email=email, business=business, token=value, is_accepted=False
        ).exists():
            self.context["email"] = email
            self.context["role"] = role
            self.context["business"] = business
        else:
            raise serializers.ValidationError("No valid invite found for this token.")
        return value

    def validate(self, attrs):
        """
        Validates the given data and checks if a user with the same email address already exists.

        Raises a ValidationError if the email address already exists.

        Args:
            attrs (dict): The validated data from the serializer.

        Returns:
            dict: The validated data.

        Raises:
            serializers.ValidationError: If a user with the same email address already exists.
        """
        try:
            if User.objects.filter(email=self.context["email"]).exists():
                raise serializers.ValidationError(
                    "A user with this email already exists. Please log in instead."
                )
        except KeyError as exc:
            raise serializers.ValidationError("Email not found in context.") from exc
        return attrs

    def create(self, validated_data):
        """
        Creates a new User and BusinessMember, and marks the invitation as accepted.

        This method creates a new user with the given email and password, assigns
        a default name derived from the email, and adds the user as a member of the
        specified business with the designated role. It also marks the associated
        BusinessInvite as accepted.

        Args:
            validated_data (dict): The validated data containing the password
            and token.

        Raises:
            serializers.ValidationError: If the email or business is not found in
            the context, or if the invite does not exist or has already been accepted.
        """

        try:
            user = User.objects.create_user(
                email=self.context["email"],
                password=validated_data["password"],
                name=self.context["email"].split("@")[0],  # Default name from email
            )
        except KeyError as exc:
            raise serializers.ValidationError("Email not found in context.") from exc

        try:
            BusinessMember.objects.create(
                user=user,
                business=self.context["business"],
                role=self.context["role"],
            )
        except KeyError as exc:
            raise serializers.ValidationError("Business not found in context.") from exc

        try:
            invite = BusinessInvite.objects.get(
                email=self.context["email"],
                business=self.context["business"],
                token=validated_data["token"],
                is_accepted=False,
            )
            invite.is_accepted = True
            invite.save()
        except BusinessInvite.DoesNotExist as exc:
            raise serializers.ValidationError(
                "Invite does not exist or has already been accepted."
            ) from exc
        return user
