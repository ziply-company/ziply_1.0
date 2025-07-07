from pathlib import Path

from dotenv import load_dotenv

from .settings import *  # noqa: F401,F403

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")
# mypy: ignore-errors
DEBUG = False

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "test",
        "USER": "test",
        "PASSWORD": "test",
        "HOST": "localhost",
        "PORT": 5432,
    }
}

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://localhost:6379/1",
        "OPTIONS": {"CLIENT_CLASS": "django_redis.client.DefaultClient"},
    }
}
