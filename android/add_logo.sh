#!/bin/bash

# Script to add logo.png to Android app
# Usage: ./add_logo.sh [path_to_logo.png]

LOGO_FILE="${1:-../logo.png}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RES_DIR="$SCRIPT_DIR/app/src/main/res"

if [ ! -f "$LOGO_FILE" ]; then
    echo "❌ Error: logo.png not found at $LOGO_FILE"
    echo "Usage: ./add_logo.sh [path_to_logo.png]"
    echo ""
    echo "Looking for logo.png in common locations..."
    if [ -f "../logo.png" ]; then
        LOGO_FILE="../logo.png"
        echo "✅ Found logo.png in project root"
    elif [ -f "../../logo.png" ]; then
        LOGO_FILE="../../logo.png"
        echo "✅ Found logo.png in project root"
    else
        echo "Please provide the path to your logo.png file"
        exit 1
    fi
fi

echo "📱 Adding logo to Android app..."
echo "Source: $LOGO_FILE"
echo ""

# Copy to all mipmap folders
for dir in "$RES_DIR"/mipmap-*; do
    if [ -d "$dir" ]; then
        echo "Copying to $(basename "$dir")..."
        cp "$LOGO_FILE" "$dir/ic_launcher.png"
        cp "$LOGO_FILE" "$dir/ic_launcher_round.png"
    fi
done

echo ""
echo "✅ Logo added successfully!"
echo "Rebuild the app to see the new icon:"
echo "  cd android && ./gradlew clean && ./gradlew assembleDebug"
