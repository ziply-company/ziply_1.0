# ---- Base Stage ----
# Using the 'slim' version. It's slightly larger than 'alpine' but much more reliable
# for Python packages that require compilation, avoiding glibc/musl issues.
FROM python:3.12-slim AS base

# Set environment variables for optimizing Python and pip
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100

WORKDIR /app

# ---- Builder Stage ----
# This stage compiles Python dependencies into "wheels" for fast installation
FROM base AS builder

# Install system dependencies required for compilation (e.g., for psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends build-essential libpq-dev

COPY requirements.txt .
# Create wheels and save them in /wheels
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

# ---- Runtime Stage ----
# This is the final, optimized image for running the application
FROM base AS runtime

# Install only the system dependencies needed for runtime (postgres client)
RUN apt-get update && apt-get install -y --no-install-recommends libpq5 && rm -rf /var/lib/apt/lists/*

# Create a non-root user to run the application
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy the pre-built wheels from the 'builder' stage
COPY --from=builder /wheels /wheels
# Install Python packages from local wheels without hitting the network
RUN pip install --no-index --find-links=/wheels /wheels/*

# Copy our application code (thanks to .dockerignore, only necessary files are copied)
COPY . .

# Change ownership of the files to our new user
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

# Expose the port the application will run on
EXPOSE 8000

# Command to run. The --reload flag is kept for development.
CMD ["uvicorn", "ziply.asgi:application", "--host", "0.0.0.0", "--port", "8000", "--reload"]
