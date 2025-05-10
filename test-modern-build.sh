#!/bin/zsh
# Script to test the build with modern browsers support only

echo "=== Building and testing modern browsers support ==="

# Run the build
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"

# Check bundle size
echo "=== Analyzing bundle size ==="
DIST_SIZE=$(du -sh ./dist | cut -f1)
echo "Bundle size: $DIST_SIZE"

# Start a preview server
echo "=== Starting preview server ==="
echo "You can test the application at http://localhost:4173"
echo "Press Ctrl+C to stop the server"
npm run preview
