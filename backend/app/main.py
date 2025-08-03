from sqlalchemy import create_engine, text


def main():
    DATABASE_URL = "postgresql+psycopg2://victor_user:victor_password@localhost:5432/tarot_db"
    engine = create_engine(DATABASE_URL)

    with engine.connect() as conn:
        result = conn.execute(text("SELECT NOW();"))
        print(result.fetchone())


if __name__ == "__main__":
    main()
