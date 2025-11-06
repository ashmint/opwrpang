#!/usr/bin/env bash
set -euo pipefail

DB_DIR="/app/data"
DB_FILE="$(ls "$DB_DIR"/*.db "$DB_DIR"/*.sqlite 2>/dev/null | head -n1 || true)"

# If a DB exists from an earlier run, ensure 'resources.enabled' exists.
if [ -n "${DB_FILE}" ] && command -v sqlite3 >/dev/null 2>&1; then
  if ! sqlite3 "$DB_FILE" "PRAGMA table_info(resources);" | awk -F'|' '{print $2}' | grep -qx enabled; then
    echo "Patching DB: adding resources.enabled"
    sqlite3 "$DB_FILE" "ALTER TABLE resources ADD COLUMN enabled INTEGER DEFAULT 1 NOT NULL;"
  fi
fi

# hand off to your app's normal start (runs migrations + server)
exec npm run start