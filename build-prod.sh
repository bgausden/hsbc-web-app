#!/bin/zsh
# Build the application with the new project structure

echo "=== Building production bundle with new project structure ==="
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "Production files are in the dist/ directory"
    echo "You can preview the build with 'npm run preview'"
else
    echo "❌ Build failed. Please check the error messages."
    exit 1
fi
