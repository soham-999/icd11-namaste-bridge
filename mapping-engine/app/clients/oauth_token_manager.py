"""OAuth2 token manager for WHO ICD-11 API authentication."""

from __future__ import annotations

import logging
import threading
from dataclasses import dataclass
from time import time
from typing import Optional

import httpx


@dataclass
class TokenResponse:
    """OAuth2 token response with expiration tracking."""

    access_token: str
    expires_in: int  # seconds
    acquired_at: float  # timestamp


class OAuth2TokenManager:
    """Manages OAuth2 token lifecycle including acquisition, caching, and refresh.

    This class handles token acquisition from the WHO OAuth2 endpoint with:
    - Thread-safe token caching
    - Automatic refresh 60 seconds before expiration
    - Graceful handling of missing credentials (returns None, no exceptions)
    - Comprehensive logging for observability

    Thread Safety:
        All public methods are thread-safe for concurrent FastAPI requests.

    Error Handling:
        Never raises exceptions to caller. Returns None on any failure to enable
        graceful fallback to local/mock data sources.
    """

    # Refresh buffer: refresh token 60 seconds before expiration
    REFRESH_BUFFER_SECONDS = 60

    def __init__(
        self,
        client_id: Optional[str],
        client_secret: Optional[str],
        token_url: str,
        scope: str,
        timeout_seconds: int,
        logger: logging.Logger,
    ):
        """Initialize token manager with credentials and configuration.

        Args:
            client_id: OAuth2 client ID (None if credentials not configured)
            client_secret: OAuth2 client secret (None if credentials not configured)
            token_url: OAuth2 token endpoint URL
            scope: OAuth2 scope (e.g., "icdapi_access")
            timeout_seconds: HTTP request timeout
            logger: Logger instance for structured logging
        """
        self._client_id = client_id
        self._client_secret = client_secret
        self._token_url = token_url
        self._scope = scope
        self._timeout_seconds = timeout_seconds
        self._logger = logger

        # Thread-safe token cache
        self._token: Optional[TokenResponse] = None
        self._lock = threading.Lock()

    def get_token(self) -> Optional[str]:
        """Get valid OAuth2 access token.

        This method returns a cached token if valid, or acquires a new token
        if the cached token is expired or missing. Token is considered expired
        60 seconds before actual expiration to provide a safety buffer.

        Returns:
            Access token string if available, None if:
            - Credentials are missing (client_id or client_secret is None)
            - Token acquisition failed (network error, invalid credentials, etc.)

        Thread Safety:
            Safe to call from multiple threads concurrently.

        Error Handling:
            Never raises exceptions. Returns None for graceful fallback.
        """
        # Fast path: check if credentials are missing (no lock needed)
        if self._client_id is None or self._client_secret is None:
            return None

        with self._lock:
            # Check if cached token is still valid
            if self._is_token_valid():
                return self._token.access_token

            # Acquire new token
            token_response = self._acquire_token()
            if token_response is None:
                return None

            # Cache the new token
            self._token = token_response
            self._logger.info(
                "OAuth2 token acquired successfully",
                extra={
                    "expires_in": token_response.expires_in,
                    "token_url": self._token_url,
                },
            )
            return token_response.access_token

    def _acquire_token(self) -> Optional[TokenResponse]:
        """Acquire new token from WHO token endpoint.

        Makes a POST request to the OAuth2 token endpoint with client credentials.

        Returns:
            TokenResponse with access_token and expires_in, or None on failure.

        Error Handling:
            - Network errors: logs warning, returns None
            - Invalid credentials: logs error, returns None
            - Timeout: logs warning, returns None
            - HTTP errors: logs error, returns None
        """
        try:
            response = httpx.post(
                self._token_url,
                data={
                    "grant_type": "client_credentials",
                    "client_id": self._client_id,
                    "client_secret": self._client_secret,
                    "scope": self._scope,
                },
                headers={
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                timeout=self._timeout_seconds,
            )
            response.raise_for_status()

            payload = response.json()
            return TokenResponse(
                access_token=payload["access_token"],
                expires_in=payload["expires_in"],
                acquired_at=time(),
            )

        except httpx.TimeoutException:
            self._logger.warning(
                "OAuth2 token acquisition timed out",
                extra={
                    "token_url": self._token_url,
                    "timeout_seconds": self._timeout_seconds,
                },
            )
            return None

        except httpx.HTTPStatusError as e:
            self._logger.error(
                "OAuth2 token acquisition failed with HTTP error",
                extra={
                    "token_url": self._token_url,
                    "status_code": e.response.status_code,
                    "error": str(e),
                },
            )
            return None

        except httpx.HTTPError as e:
            print(f"\n\n--- OAUTH NETWORK ERROR ---\n{repr(e)}\n---------------------------\n\n")
            self._logger.error(
                "OAuth2 token acquisition failed with network error",
                extra={
                    "token_url": self._token_url,
                    "error": str(e),
                },
            )
            return None

        except (KeyError, ValueError) as e:
            self._logger.error(
                "OAuth2 token response parsing failed",
                extra={
                    "token_url": self._token_url,
                    "error": str(e),
                },
            )
            return None

    def _is_token_valid(self) -> bool:
        """Check if cached token exists and hasn't expired.

        Token is considered expired 60 seconds before actual expiration
        to provide a safety buffer for in-flight requests.

        Returns:
            True if token exists and is valid, False otherwise.

        Note:
            This method must be called with self._lock held.
        """
        if self._token is None:
            return False

        # Calculate expiration time with safety buffer
        expires_at = self._token.acquired_at + self._token.expires_in
        time_until_expiry = expires_at - time()

        return time_until_expiry > self.REFRESH_BUFFER_SECONDS

    def clear_token(self) -> None:
        """Clear cached token.

        Useful for testing or manual token refresh. The next call to get_token()
        will acquire a new token.

        Thread Safety:
            Safe to call from multiple threads concurrently.
        """
        with self._lock:
            self._token = None
            self._logger.debug("OAuth2 token cache cleared")
