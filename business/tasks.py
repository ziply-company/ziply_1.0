from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from ziply.celery import app


@app.task
def send_invitation_email(
    email: str, token: str, business_name: str, invited_by_name: str
):
    """
    Sends a invitation confirmation email to the user.

    Args:
        email (str): The email address of the user.
        token (str): The token used to confirm the email address.
        business_name (str): The name of the business.
        invited_by_name (str): The name of the person who sent the invitation.
    """
    invite_url = f"{settings.FRONTEND_URL}/members/invite-confirm?token={token}"
    context = {
        "invite_url": invite_url,
        "email": email,
        "business_name": business_name,
        "invited_by_name": invited_by_name,
    }

    html_message = render_to_string("invitation_confirmation.html", context)
    plain_message = strip_tags(html_message)

    send_mail(
        subject=f"You're invited to join {business_name} on Ziply",
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        html_message=html_message,
    )
