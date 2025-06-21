FROM python:3.12-alpine AS base
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app

# ----- builder -----
FROM base AS builder
RUN apk add --no-cache build-base libffi-dev
COPY requirements.txt .
RUN pip wheel -r requirements.txt -w /wheels
CMD ["uvicorn", "ziply.asgi:application", "--host", "0.0.0.0", "--port", "8000", "--reload"]
# ----- runtime -----
FROM base AS runtime
RUN apk add --no-cache libpq
COPY --from=builder /wheels /wheels
RUN pip install --no-index --find-links=/wheels /wheels/*
COPY . .
