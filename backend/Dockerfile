FROM python:3.11-slim

# Set environment
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install dependencies
RUN apt-get update && apt-get install -y gcc

WORKDIR /app

COPY backend/uv.lock .
COPY backend/pyproject.toml .

RUN pip install uv
RUN uv sync

COPY backend /app

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
