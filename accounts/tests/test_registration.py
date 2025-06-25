import pytest
from rest_framework.test import APIClient

from accounts.models import User


@pytest.mark.django_db
def test_user_registration():
    """
    Test the user registration API endpoint.

    This test verifies that a new user can be successfully registered
    via the API. It sends a POST request with valid user data and
    checks that the response status code is 201 (Created) and that
    the response contains the correct email address.
    """
    client = APIClient()
    data = {
        "email": "newuser@example.com",
        "password": "securepassword123",
        "name": "New User",
    }
    response = client.post("/accounts/register/", data)
    print(response.json())
    assert response.status_code == 201
    assert "message" in response.data
    assert response.data["message"] == "User and Business created."
    assert User.objects.filter(email=data["email"]).exists()
