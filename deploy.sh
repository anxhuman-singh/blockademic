#!/bin/bash

set -e  # Exit on error

echo "🔹 Building Docker images..."
docker-compose build --no-cache

echo "🔹 Starting containers..."
docker-compose up -d

echo "✅ Deployment complete!"