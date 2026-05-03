from typing import Literal

from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Load environment variables as settings."""

    environment: Literal["local", "test", "dev", "preprod", "prod"] = "prod"
    log_level: str = "INFO"

    frontend_url: str = "http://localhost:5173"

    db_username: str = "victor_user"
    db_password: str = "victor_password"
    db_host: str = "localhost"
    db_port: str = "5432"
    db_name: str = "tarot_db"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @computed_field
    @property
    def db_uri(self) -> str:
        """Construct the database URI from components."""
        return f"postgresql+psycopg2://{self.db_username}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"

    @property
    def database_url(self) -> str:
        """Alias for db_uri for backward compatibility or existing usage."""
        return self.db_uri


settings = Settings()
