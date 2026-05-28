from __future__ import annotations

from typing import List, Optional

from ..db import get_connection, init_db
from ..schemas import ICDMatch, AdminMapping


class LocalMappingRepository:
    def __init__(self) -> None:
        init_db()

    def find_icd(self, symptom: str) -> Optional[ICDMatch]:
        conn = get_connection()
        if not conn:
            return None
        row = conn.execute(
            "SELECT icd_code, description FROM mappings WHERE symptom = ?",
            (symptom,),
        ).fetchone()
        conn.close()
        if not row:
            return None
        return ICDMatch(
            icd_code=row["icd_code"],
            description=row["description"],
            source="local",
            confidence=0.8,
        )

    def upsert(self, symptom: str, icd_code: str, description: str | None) -> Optional[AdminMapping]:
        conn = get_connection()
        if not conn:
            return None
        with conn:
            conn.execute(
                "INSERT OR REPLACE INTO mappings (symptom, icd_code, description) VALUES (?, ?, ?)",
                (symptom, icd_code, description),
            )
        conn.close()
        return AdminMapping(
            symptom=symptom,
            icd_code=icd_code,
            description=description,
        )

    def delete(self, symptom: str) -> bool:
        conn = get_connection()
        if not conn:
            return False
        with conn:
            cursor = conn.execute(
                "DELETE FROM mappings WHERE symptom = ?",
                (symptom,),
            )
        conn.close()
        return cursor.rowcount > 0

    def list(self, limit: int = 50, offset: int = 0) -> List[AdminMapping]:
        conn = get_connection()
        if not conn:
            return []
        rows = conn.execute(
            "SELECT symptom, icd_code, description FROM mappings ORDER BY symptom LIMIT ? OFFSET ?",
            (limit, offset),
        ).fetchall()
        conn.close()
        return [
            AdminMapping(
                symptom=row["symptom"],
                icd_code=row["icd_code"],
                description=row["description"],
            )
            for row in rows
        ]
