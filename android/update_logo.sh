#!/bin/bash

# Script to update logo.png in all Android mipmap folders
# This script resizes logo.png to appropriate sizes for each density

LOGO_SOURCE="../logo.png"
RES_DIR="app/src/main/res"

# Check if logo.png exists
if [ ! -f "$LOGO_SOURCE" ]; then
    echo "❌ Error: logo.png not found at $LOGO_SOURCE"
    exit 1
fi

echo "📱 Updating Android app icons from logo.png..."

# Function to resize and copy logo
update_icon() {
    local density=$1
    local size=$2
    local folder="$RES_DIR/mipmap-$density"
    
    # Create folder if it doesn't exist
    mkdir -p "$folder"
    
    # Check if ImageMagick or sips is available
    if command -v convert &> /dev/null; then
        # Use ImageMagick
        convert "$LOGO_SOURCE" -resize "${size}x${size}" "$folder/ic_launcher.png"
        convert "$LOGO_SOURCE" -resize "${size}x${size}" "$folder/ic_launcher_round.png"
        echo "✅ Updated $density (${size}x${size}) using ImageMagick"
    elif command -v sips &> /dev/null; then
        # Use sips (macOS)
        sips -z $size $size "$LOGO_SOURCE" --out "$folder/ic_launcher.png" > /dev/null 2>&1
        sips -z $size $size "$LOGO_SOURCE" --out "$folder/ic_launcher_round.png" > /dev/null 2>&1
        echo "✅ Updated $density (${size}x${size}) using sips"
    else
        # Fallback: just copy the file
        cp "$LOGO_SOURCE" "$folder/ic_launcher.png"
        cp "$LOGO_SOURCE" "$folder/ic_launcher_round.png"
        echo "⚠️  Copied logo to $density (no resizing - install ImageMagick or use sips for proper sizing)"
    fi
}

# Update icons for each density
# mdpi: 48x48
# hdpi: 72x72
# xhdpi: 96x96
# xxhdpi: 144x144
# xxxhdpi: 192x192

update_icon "mdpi" "48"
update_icon "hdpi" "72"
update_icon "xhdpi" "96"
update_icon "xxhdpi" "144"
update_icon "xxxhdpi" "192"

echo ""
echo "✅ Logo update complete!"
echo "📝 Note: For Play Store, you need:"
echo "   - 512x512 icon (feature graphic)"
echo "   - Properly sized icons in all densities"

