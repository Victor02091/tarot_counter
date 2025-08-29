FROM python:3.12-slim-bookworm AS base

########## Build Image ###########

FROM base AS builder

# Install uv
COPY --from=ghcr.io/astral-sh/uv:0.4.9 /uv /bin/uv

# Set environment
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1

# Install dependencies
RUN apt-get update && apt-get install -y gcc

# Set working directory
WORKDIR /app

# Copy only uv.lock and pyproject.toml first (layer caching)
COPY uv.lock pyproject.toml ./

# Install dependencies using uv
RUN --mount=type=cache,target=/root/.cache/uv \ 
uv sync --frozen --no-install-project --no-dev

# Copy the rest of the app
COPY ./app ./app
COPY ./alembic ./alembic
COPY ./alembic.ini ./alembic.ini

# Build project
RUN --mount=type=cache,target=/root/.cache/uv \ 
uv sync --frozen --no-dev

########## Final Image ###########

# Create final image without build tools (lighter)
FROM base
COPY --from=builder /app /app 

# Make sure that venv is used by default
ENV PATH=/app/.venv/bin:$PATH PYTHONPATH=/app

# Set working directory
WORKDIR /app

# FastAPI port
EXPOSE 8000

# Clear entry point
ENTRYPOINT []

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]