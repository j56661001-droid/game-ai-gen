#!/bin/bash
# This script builds and pushes a Docker image without requiring Node.js locally.
# Usage: ./build.sh [version] [registry] [image_name]

set -e  # Exit immediately if a command exits with a non-zero status.

VERSION=${1:-latest}
REGISTRY=${2:-registry.aiaipool.com}
IMAGE_NAME=${3:-game/ai-gen}

# Print build info
echo "===================================="
echo "Building Docker Image"
echo "Version : $VERSION"
echo "Registry: $REGISTRY"
echo "Image   : $IMAGE_NAME"
echo "===================================="

# Build image
echo "Building Docker image..."
docker build --platform=linux/amd64 -t "$REGISTRY/$IMAGE_NAME:$VERSION" -f docker/app.Dockerfile .

# Push image
echo "Pushing image to registry..."
docker push "$REGISTRY/$IMAGE_NAME:$VERSION"

echo "✅ Build complete: $REGISTRY/$IMAGE_NAME:$VERSION"
echo "The 'dist' directory (if applicable) is ready."
