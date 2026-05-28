from app.db import get_connection, init_db


def main() -> None:
    init_db()
    conn = get_connection()
    if not conn:
        raise SystemExit("Local store disabled")
    with conn:
        conn.execute(
            "INSERT OR REPLACE INTO mappings (symptom, icd_code, description) VALUES (?, ?, ?)",
            ("fatigue", "TM010", "Prana depletion"),
        )
    conn.close()


if __name__ == "__main__":
    main()
