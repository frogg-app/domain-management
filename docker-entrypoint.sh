#!/bin/sh
set -e

DB_PATH="/app/prisma/data/domain-management.db"
SEED_DB="/app/prisma/seed.db"

# Initialize database if it doesn't exist (copy from seed created during build)
if [ ! -f "$DB_PATH" ] && [ -f "$SEED_DB" ]; then
  echo "Initializing database from seed..."
  cp "$SEED_DB" "$DB_PATH"
  echo "Database initialized."
fi

# Fix data directory permissions and drop to nextjs user if running as root
if [ "$(id -u)" = "0" ]; then
  chown -R nextjs:nodejs /app/prisma/data 2>/dev/null || true
  exec gosu nextjs node server.js
else
  exec node server.js
fi
