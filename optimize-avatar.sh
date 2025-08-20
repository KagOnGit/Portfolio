#!/usr/bin/env bash
set -euo pipefail

echo "🖼️  Avatar Image Optimizer"
echo "=================================="

# Check if ImageMagick is available
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Installing via Homebrew..."
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew not found. Please install ImageMagick manually:"
        echo "   brew install imagemagick"
        echo "   or visit: https://imagemagick.org/script/download.php"
        exit 1
    fi
    brew install imagemagick
fi

# Check for input image
if [ $# -eq 0 ]; then
    echo "📝 Usage: ./optimize-avatar.sh input-image.jpg"
    echo ""
    echo "💡 Place your image in the project folder and run:"
    echo "   ./optimize-avatar.sh my-photo.jpg"
    echo ""
    echo "🎯 The script will:"
    echo "   • Resize to 400x400px"
    echo "   • Crop to perfect circle"
    echo "   • Optimize file size"
    echo "   • Save as public/avatar.png"
    exit 1
fi

INPUT_FILE="$1"

if [ ! -f "$INPUT_FILE" ]; then
    echo "❌ File not found: $INPUT_FILE"
    exit 1
fi

echo "🔄 Processing: $INPUT_FILE"

# Create output directory
mkdir -p public

# Step 1: Resize and crop to square (400x400)
echo "  📐 Resizing to 400x400..."
convert "$INPUT_FILE" \
    -resize 400x400^ \
    -gravity center \
    -extent 400x400 \
    public/avatar-temp.png

# Step 2: Create circular mask and apply
echo "  ⭕ Creating circular crop..."
convert public/avatar-temp.png \
    \( -size 400x400 xc:black -fill white -draw "circle 200,200 200,40" \) \
    -alpha off -compose copy_opacity -composite \
    public/avatar.png

# Step 3: Optimize file size
echo "  🗜️  Optimizing file size..."
convert public/avatar.png \
    -strip \
    -interlace Plane \
    -quality 85 \
    public/avatar.png

# Clean up temp file
rm -f public/avatar-temp.png

# Get file size
SIZE=$(stat -f%z public/avatar.png 2>/dev/null || stat -c%s public/avatar.png 2>/dev/null || echo 0)

echo "✅ Avatar optimized successfully!"
echo "   📁 Output: public/avatar.png"
echo "   📏 Size: ${SIZE} bytes"
echo ""
echo "🚀 Ready to deploy:"
echo "   git add public/avatar.png"
echo "   git commit -m 'feat: update avatar with professional photo'"
echo "   git push origin main"
echo "   npx vercel --prod"
