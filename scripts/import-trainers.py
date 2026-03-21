# /// script
# requires-python = ">=3.11"
# dependencies = ["psycopg2-binary", "python-dotenv"]
# ///

import argparse
import csv
import os
import sys
from pathlib import Path

import psycopg2
from dotenv import load_dotenv


def parse_args():
    parser = argparse.ArgumentParser(description="Import trainers from a CSV file into the database.")
    parser.add_argument("--env", type=Path, required=True, help="Path to the .env file")
    parser.add_argument("--csv", type=Path, required=True, help="Path to the trainers CSV file")
    parser.add_argument("--sql", type=Path, required=True, help="Path to the import_trainers.sql upsert file")
    return parser.parse_args()


def main():
    args = parse_args()

    for path in [args.env, args.csv, args.sql]:
        if not path.exists():
            print(f"Error: {path} not found", file=sys.stderr)
            sys.exit(1)

    load_dotenv(args.env)
    print(f"Loaded {args.env}")

    trainers = read_csv(args.csv)
    print(f"Found {len(trainers)} rows to import")

    conn = psycopg2.connect(os.environ["POSTGRES_URL"])
    try:
        with conn:
            cur = conn.cursor()
            insert_trainers(cur, trainers, args.sql)
        print("Trainers imported successfully!")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        print("Transaction rolled back.", file=sys.stderr)
        sys.exit(1)
    finally:
        conn.close()


def read_csv(csv_path: Path) -> list[dict]:
    with csv_path.open() as f:
        reader = csv.DictReader(f)
        return [{k: (v.strip() or None) for k, v in row.items()} for row in reader if row.get("email")]


def insert_trainers(cur, trainers: list[dict], sql_path: Path):
    cur.execute("""
        CREATE TEMP TABLE tmp_trainer_import (
            email TEXT, name TEXT, surname TEXT,
            created_at TIMESTAMP, updated_at TIMESTAMP,
            city TEXT, province TEXT,
            places_lit TEXT, groups_lit TEXT, levels_lit TEXT
        ) ON COMMIT DROP
    """)
    cur.executemany(
        """INSERT INTO tmp_trainer_import
           (email, name, surname, created_at, updated_at, city, province, places_lit, groups_lit, levels_lit)
           VALUES (%(email)s, %(name)s, %(surname)s, %(created_at)s, %(updated_at)s,
                   %(city)s, %(province)s, %(places_lit)s, %(groups_lit)s, %(levels_lit)s)""",
        trainers,
    )
    print(f"Inserted {len(trainers)} rows into temp table")
    cur.execute(sql_path.read_text())


if __name__ == "__main__":
    main()
