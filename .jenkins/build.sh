#!/bin/bash
set -e

echo "=== Building Domain Management ==="

# Build Docker image with build number tag
docker build -t domain-management:${BUILD_NUMBER} -t domain-management:latest .

echo "Docker image built: domain-management:${BUILD_NUMBER}"
echo "Build successful!"

echo "Build completed successfully!"
