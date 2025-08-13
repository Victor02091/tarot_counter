FROM python:3.11-slim

# Set environment
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_LINK_MODE=copy

# Install dependencies
RUN apt-get update && apt-get install -y gcc

# Install uv 
RUN pip install --no-cache-dir uv

# Set working directory
WORKDIR /app

# Copy uv.lock and pyproject.toml
COPY uv.lock .
COPY pyproject.toml .

# Install dependencies using uv
RUN uv sync --frozen

# Copy the rest of the app
COPY /app .

# Expose FastAPI port
EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
