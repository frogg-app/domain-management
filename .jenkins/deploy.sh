#!/bin/bash
set -e

# Stop existing container if running
docker stop domain-management-jenkins 2>/dev/null || true
docker rm domain-management-jenkins 2>/dev/null || true

# Create data directory if it doesn't exist
mkdir -p "$HOME/domain-management-data"

# Launch the app on port 5070
echo "=== Launching Domain Management on port 5070 ==="
docker run -d \
  --name domain-management-jenkins \
  -p 5070:3000 \
  -v "$HOME/domain-management-data:/app/prisma/data" \
  -e NEXTAUTH_URL="https://domains.dev.frogg.app" \
  -e NEXTAUTH_SECRET="${NEXTAUTH_SECRET:-changeme-generate-with-openssl}" \
  -e AUTH_TRUST_HOST="true" \
  -e ENCRYPTION_KEY="${ENCRYPTION_KEY:-0000000000000000000000000000000000000000000000000000000000000000}" \
  --restart unless-stopped \
  domain-management:latest

echo "App launched on port 5070"
