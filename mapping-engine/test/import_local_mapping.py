import csv
from pathlib import Path

from app.db import get_connection, init_db


def main() -> None:
    init_db()
    conn = get_connection()
    if not conn:
        raise SystemExit("Local store disabled")

    csv_path = Path(__file__).with_name("sample_mappings.csv")
    if not csv_path.exists():
        raise SystemExit("sample_mappings.csv not found")

    with csv_path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        rows = [
            (row["symptom"], row["icd_code"], row["description"])
            for row in reader
        ]

    with conn:
        conn.executemany(
            "INSERT OR REPLACE INTO mappings (symptom, icd_code, description) VALUES (?, ?, ?)",
            rows,
        )
    conn.close()


if __name__ == "__main__":
    main()
