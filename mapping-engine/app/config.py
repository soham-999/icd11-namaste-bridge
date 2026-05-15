from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="ME_",
        env_file=".env",
        extra="ignore",
    )
    service_name: str = "mapping-engine"
    service_version: str = "0.1.0"
    api_prefix: str = "/v1"
    who_api_base_url: str = "https://id.who.int/icd"
    who_api_version: str = "v2"
    who_token: str | None = None
    request_timeout_seconds: int = 5
    supported_sources: List[str] = ["mock"]
    supported_features: List[str] = ["traditional_mapping", "fusion_scoring"]


settings = Settings()
