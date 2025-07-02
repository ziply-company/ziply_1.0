from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from ziply.celery import app


@app.task
def send_registration_email(email: str, token: str):
    """
    Sends a registration confirmation email to the user.

    Args:
        email (str): The email address of the user.
        token (str): The token used to confirm the email address.
    """
    confirm_url = f"{settings.FRONTEND_URL}/register/confirm?token={token}"
    context = {'confirm_url': confirm_url, 'email': email}

    html_message = render_to_string("registration_confirmation.html", context)
    plain_message = strip_tags(html_message)

    send_mail(
        subject="Confirm your email for Ziply",
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        html_message=html_message,
    )
