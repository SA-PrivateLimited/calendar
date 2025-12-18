#!/bin/bash

# Script to create symbols.zip file for Google Play Console
# This file contains native debug symbols for crash reporting

echo "📦 Creating symbols.zip file for Google Play Console..."
echo ""

SYMBOLS_DIR="app/build/intermediates/merged_native_libs/release/out/lib"
SYMBOLS_ZIP="app/build/outputs/native-debug-symbols/release/native-debug-symbols.zip"

# Create output directory
mkdir -p app/build/outputs/native-debug-symbols/release

# Check if native libraries exist
if [ -d "$SYMBOLS_DIR" ] && [ "$(ls -A $SYMBOLS_DIR 2>/dev/null)" ]; then
    echo "✅ Found native libraries, creating symbols.zip..."
    
    # Create symbols.zip with native libraries
    cd "$SYMBOLS_DIR"
    zip -r "../../../../outputs/native-debug-symbols/release/native-debug-symbols.zip" . > /dev/null 2>&1
    cd - > /dev/null
    
    echo "✅ Symbols.zip created successfully!"
    ls -lh "$SYMBOLS_ZIP" | awk '{print "   File: " $9 " (" $5 ")"}'
else
    echo "⚠️  No native libraries found (this is normal for WebView-only apps)"
    echo "   Creating empty symbols.zip file..."
    
    # Create an empty zip file
    cd app/build/outputs/native-debug-symbols/release
    zip native-debug-symbols.zip - > /dev/null 2>&1 <<EOF
# Empty symbols file - no native code in this app
EOF
    cd - > /dev/null
    
    echo "✅ Empty symbols.zip created (for apps without native code)"
    ls -lh "$SYMBOLS_ZIP" | awk '{print "   File: " $9 " (" $5 ")"}'
fi

echo ""
echo "📤 Upload this file to Google Play Console:"
echo "   $SYMBOLS_ZIP"
echo ""
echo "📍 Location in Play Console:"
echo "   App → Release → [Your Release] → Native debug symbols"

