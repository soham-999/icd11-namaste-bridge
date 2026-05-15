from pydantic import BaseModel


class Settings(BaseModel):
    service_name: str = "mapping-engine"
    service_version: str = "0.1.0"
    api_prefix: str = "/v1"
    who_api_base_url: str = "https://id.who.int/icd"
    who_api_version: str = "v2"
    who_token: str | None = None
    request_timeout_seconds: int = 5


settings = Settings()
