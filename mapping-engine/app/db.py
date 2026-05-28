from __future__ import annotations

import os
import sqlite3
from typing import Optional

from .config import settings


def _ensure_data_dir(db_path: str) -> None:
    data_dir = os.path.dirname(db_path)
    if data_dir:
        os.makedirs(data_dir, exist_ok=True)


def get_connection() -> Optional[sqlite3.Connection]:
    if not settings.local_enabled:
        return None
    _ensure_data_dir(settings.local_db_path)
    conn = sqlite3.connect(settings.local_db_path)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = get_connection()
    if not conn:
        return
    with conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS mappings (
                symptom TEXT PRIMARY KEY,
                icd_code TEXT,
                description TEXT
            )
            """
        )
