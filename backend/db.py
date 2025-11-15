from __future__ import annotations

from datetime import datetime
from typing import Optional, Iterator

from sqlmodel import SQLModel, Field, create_engine, Session
from sqlalchemy import text


class AlertRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    mood_level: int = Field(default=0, index=True)
    energy_level: int = Field(default=0, index=True)
    loneliness_level: int = Field(default=0, index=True)
    risk_level: int = Field(default=0, index=True)
    summary: str = Field(default="")
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)


# SQLite file in the backend folder
DATABASE_URL = "sqlite:///database.db"
engine = create_engine(DATABASE_URL, echo=False)


def init_db() -> None:
    """Create tables if they don't exist and ensure required columns are present (simple migration)."""
    SQLModel.metadata.create_all(engine)
    _ensure_alertrecord_columns()


def _ensure_alertrecord_columns() -> None:
    """Add missing columns to AlertRecord if an older schema exists.

    Note: SQLite supports ADD COLUMN but not DROP COLUMN on old versions.
    We'll add new columns if missing and leave any legacy columns (like 'level') as-is.
    """
    with engine.connect() as conn:
        # Check table exists
        res = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='alertrecord'"))
        if res.fetchone() is None:
            return
        # Inspect columns
        cols_res = conn.execute(text("PRAGMA table_info('alertrecord')"))
        existing_cols = {row[1].lower() for row in cols_res.fetchall()}
        # Define required columns
        required = {
            "mood_level": "INTEGER DEFAULT 0",
            "energy_level": "INTEGER DEFAULT 0",
            "loneliness_level": "INTEGER DEFAULT 0",
            "risk_level": "INTEGER DEFAULT 0",
            "summary": "TEXT DEFAULT ''",
            "created_at": "TEXT",  # SQLModel handles DATETIME; TEXT is acceptable in SQLite
        }
        for col, coltype in required.items():
            if col not in existing_cols:
                try:
                    conn.execute(text(f"ALTER TABLE alertrecord ADD COLUMN {col} {coltype}"))
                except Exception as e:
                    print("[db migrate] column", col, "->", e)
        conn.commit()


def get_session() -> Iterator[Session]:
    """FastAPI dependency that yields a SQLModel Session."""
    with Session(engine) as session:
        yield session
