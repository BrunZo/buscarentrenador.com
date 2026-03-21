# /// script
# requires-python = ">=3.11"
# dependencies = ["psycopg2-binary", "python-dotenv"]
# ///

import argparse
import os
import sys
from pathlib import Path

import psycopg2
from dotenv import load_dotenv


def parse_args():
    parser = argparse.ArgumentParser(description="Initialize the database by applying all migrations.")
    parser.add_argument("--env", type=Path, required=True, help="Path to the .env file")
    parser.add_argument("--migrations", type=Path, required=True, help="Path to the migrations directory")
    return parser.parse_args()


def main():
    args = parse_args()

    if not args.env.exists():
        print(f"Error: {args.env} not found", file=sys.stderr)
        sys.exit(1)

    if not args.migrations.exists():
        print(f"Error: {args.migrations} not found", file=sys.stderr)
        sys.exit(1)

    load_dotenv(args.env)
    print(f"Loaded {args.env}")

    migration_files = sorted(args.migrations.glob("*.sql"))
    if not migration_files:
        print(f"No migration files found in {args.migrations}", file=sys.stderr)
        sys.exit(1)

    print(f"Found {len(migration_files)} migration(s): {', '.join(f.name for f in migration_files)}")

    conn = psycopg2.connect(os.environ["POSTGRES_URL"])
    try:
        with conn:
            cur = conn.cursor()
            for migration_file in migration_files:
                apply_migration(cur, migration_file)
        print("Database initialized successfully!")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        print("All migrations rolled back.", file=sys.stderr)
        sys.exit(1)
    finally:
        conn.close()


def apply_migration(cur, migration_file: Path):
    print(f"Applying {migration_file.name}...")
    sql = migration_file.read_text()
    for statement in [s.strip() for s in sql.split("--> statement-breakpoint") if s.strip()]:
        cur.execute(statement)


if __name__ == "__main__":
    main()
