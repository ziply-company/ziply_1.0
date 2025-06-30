from rest_framework import serializers

from business.models import BusinessMember


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
