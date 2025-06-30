from django.utils.text import slugify
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from accounts.models import User
from business.models import Business, BusinessMember


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("email", "name", "password")

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)

        # Create business after user
        try:
            business_name = f"{user.name}'s Business"
            business_slug = slugify(f"{user.name}-{user.id}")

            business = Business.objects.create(
                name=business_name, slug=business_slug, owner=user
            )
            BusinessMember.objects.create(
                user=user, business=business, role=BusinessMember.OWNER
            )
        except Exception as e:
            user.delete()  # Rollback user creation if business creation fails
            raise serializers.ValidationError(f"Error creating business: {str(e)}")

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
        token['email'] = user.email
        token['name'] = user.name
        return token
