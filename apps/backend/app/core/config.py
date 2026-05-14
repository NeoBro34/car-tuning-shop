import os
from functools import cached_property


class Settings:
    PROJECT_NAME = "Car Tuning Shop API"
    API_V1_PREFIX = "/api/v1"
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://postgres:postgres@localhost:5432/car_tuning_shop",
    )
    SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret-key")
    ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
    )
    UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")

    @cached_property
    def is_default_secret(self) -> bool:
        return self.SECRET_KEY == "change-this-secret-key"


settings = Settings()
