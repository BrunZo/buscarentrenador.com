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
    parser = argparse.ArgumentParser(description="Drop all application tables from the database.")
    parser.add_argument("--env", type=Path, required=True, help="Path to the .env file")
    return parser.parse_args()


def main():
    args = parse_args()

    if not args.env.exists():
        print(f"Error: {args.env} not found", file=sys.stderr)
        sys.exit(1)

    load_dotenv(args.env)
    print(f"Loaded {args.env}")

    conn = psycopg2.connect(os.environ["POSTGRES_URL"])
    try:
        with conn:
            cur = conn.cursor()
            cur.execute("""
                DROP TABLE IF EXISTS rate_limits CASCADE;
                DROP TABLE IF EXISTS verifications CASCADE;
                DROP TABLE IF EXISTS accounts CASCADE;
                DROP TABLE IF EXISTS sessions CASCADE;
                DROP TABLE IF EXISTS trainers CASCADE;
                DROP TABLE IF EXISTS users CASCADE;
            """)
        print("Database cleared successfully!")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
