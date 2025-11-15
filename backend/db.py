import json
import sqlite3
from pathlib import Path
from typing import Optional, Sequence, Any

# Store the DB next to db.py (backend/database.db)
DB_PATH = str(Path(__file__).with_name("database.db"))

def get_connection(db_path: str = DB_PATH) -> sqlite3.Connection:
    return sqlite3.connect(db_path)

def init_db(conn: Optional[sqlite3.Connection] = None, db_path: str = DB_PATH) -> None:
    """
    Creates the table if it doesn't exist.
    Columns: mood_level, energy_level, loneliness_level, risk_level, summary
    """
    close_after = False
    if conn is None:
        conn = get_connection(db_path)
        close_after = True

    try:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS mood_classifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                mood_level INTEGER,
                energy_level INTEGER,
                loneliness_level INTEGER,
                risk_level INTEGER,
                summary TEXT
            )
        """)
        conn.commit()
    finally:
        if close_after:
            conn.close()

def save_classification_from_output(
    classification: Sequence[Any],
    conn: Optional[sqlite3.Connection] = None,
    db_path: str = DB_PATH
) -> int:
    """
    Expects the shape you specified:
      classification[-1].content[0].text -> JSON string like:
        {
          "mood_level": 3,
          "energy_level": 3,
          "loneliness_level": 0,
          "risk_level": 0,
          "summary": "..."
        }

    Inserts those values into the mood_classifications table.
    Returns the inserted row id.
    """
    # Get the JSON string directly
    text = classification

    # Parse JSON and map to columns
    data = json.loads(text)

    close_after = False
    if conn is None:
        conn = get_connection(db_path)
        close_after = True

    try:
        init_db(conn=conn)  # ensure table exists
        cur = conn.execute(
            """
            INSERT INTO mood_classifications (
                mood_level, energy_level, loneliness_level, risk_level, summary
            ) VALUES (?, ?, ?, ?, ?)
            """,
            (
                int(data["mood_level"]),
                int(data["energy_level"]),
                int(data["loneliness_level"]),
                int(data["risk_level"]),
                data.get("summary"),
            ),
        )
        conn.commit()
        return int(cur.lastrowid)
    finally:
        if close_after:
            conn.close()