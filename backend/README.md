# Tarot counter Backend

This is the backend of the Tarot game result counter app, built with **python** and **FastAPI**.

## 🛠️ Setup

### 0. Install UV

If not already, install astral uv.

On Linux :

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

On Windows :

```bash
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

More info on [official website](https://docs.astral.sh/uv/getting-started/installation/#__tabbed_1_1).

### 1. Install project and dependencies

Make sure you're in the `backend` directory , then run:

```bash
uv sync
```

### 2. Database migration

Create a standard .env file and set your db address as DATABASE_URL.

Exemple :

```bash
DATABASE_URL="postgresql+psycopg2://victor_user:victor_password@localhost:5432/tarot_db"
```

If your database is new, you can create all required tables using this command (make sure your db is accessible):

```bash
uv run alembic upgrade head
```

## Start the app api

Start the app with:

```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
```


By default, this will start the app api at : [http://localhost:8000](http://localhost:8000)

You can acess the swagger at [http://localhost:8000/docs](http://localhost:8000/docs)

## Modify table schemas

If you make a change in SQL Alchemy models, you want to update the structure of the tables (make sure your db is accessible).

You need to commit the changes to alembic :

```bash
alembic revision -m "commit message" --autogenerate
```

And update your db tables :

```bash
uv run alembic upgrade head
```
