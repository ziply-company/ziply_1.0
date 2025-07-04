from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models


# Define a custom user manager class
class UserManager(BaseUserManager):
    # Method to create a new user
    def create_user(self, email, password=None, **extra_fields):
        """
        Creates and saves a User with the given email and password.

        Args:
            email (str): The email address of the user.
            password (str, optional): The password of the user. Defaults to None.
            **extra_fields: Additional keyword arguments are passed to the User model.

        Raises:
            ValueError: If the email address is empty.
        """
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    # Method to create a new superuser
    def create_superuser(self, email, password=None, **extra_fields):
        """
        Creates and saves a User with the given email and password.

        Args:
            email (str): The email address of the user.
            password (str, optional): The password of the user. Defaults to None.
            **extra_fields: Additional keyword arguments are passed to the User model.

        Returns:
            User: The created user with is_staff and is_superuser set to True.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


# Define a custom user model
class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.email
