#!/bin/bash

# Script to create symbols.zip file for Google Play Store
# Google Play requires native debug symbols in a specific format

echo "📦 Creating symbols.zip for Google Play Store..."
echo ""

OUTPUT_DIR="app/build/outputs/native-debug-symbols/release"
SYMBOLS_ZIP="$OUTPUT_DIR/native-debug-symbols.zip"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Check for native libraries in merged_native_libs
NATIVE_LIBS_DIR="app/build/intermediates/merged_native_libs/release/out/lib"

if [ -d "$NATIVE_LIBS_DIR" ] && [ "$(ls -A $NATIVE_LIBS_DIR 2>/dev/null)" ]; then
    echo "✅ Found native libraries, creating symbols.zip..."
    
    # Create symbols.zip with proper structure
    cd "$NATIVE_LIBS_DIR"
    
    # Create zip with ABI folders (arm64-v8a, armeabi-v7a, x86, x86_64)
    zip -r "../../../../outputs/native-debug-symbols/release/native-debug-symbols.zip" . > /dev/null 2>&1
    
    cd - > /dev/null
    
    echo "✅ Symbols.zip created with native libraries"
else
    echo "⚠️  No native libraries found in merged_native_libs"
    echo "   Checking AAB file for native libraries..."
    
    # Extract and check AAB for native libs
    TEMP_DIR=$(mktemp -d)
    cd "$TEMP_DIR"
    
    unzip -q "../../app/build/outputs/bundle/release/app-release.aab" -d . 2>/dev/null
    
    if [ -d "base/lib" ] && [ "$(ls -A base/lib 2>/dev/null)" ]; then
        echo "✅ Found native libraries in AAB, extracting..."
        
        # Create symbols.zip with proper ABI structure
        cd base/lib
        zip -r "../../../../outputs/native-debug-symbols/release/native-debug-symbols.zip" . > /dev/null 2>&1
        cd - > /dev/null
        
        echo "✅ Symbols.zip created from AAB native libraries"
    else
        echo "⚠️  No native libraries found (WebView-only app)"
        echo "   Creating minimal symbols.zip file..."
        
        # Create a minimal valid zip file
        cd "$OUTPUT_DIR"
        echo "# Native debug symbols for Hindu Panchang Calendar" > README.txt
        echo "# Version: 1.0.3 (versionCode: 3)" >> README.txt
        echo "# This app uses WebView and has minimal native code" >> README.txt
        zip native-debug-symbols.zip README.txt > /dev/null 2>&1
        rm README.txt
        
        echo "✅ Minimal symbols.zip created"
    fi
    
    # Cleanup
    cd - > /dev/null
    rm -rf "$TEMP_DIR"
fi

# Verify the file was created
if [ -f "$SYMBOLS_ZIP" ]; then
    echo ""
    echo "✅ Symbols.zip created successfully!"
    echo ""
    echo "📦 File Details:"
    ls -lh "$SYMBOLS_ZIP" | awk '{print "   Location: " $9 "\n   Size: " $5}'
    echo ""
    echo "📋 Contents:"
    unzip -l "$SYMBOLS_ZIP" 2>/dev/null | tail -5
    echo ""
    echo "📤 Upload to Play Console:"
    echo "   Go to: Release → Native debug symbols → Upload"
    echo "   File: $SYMBOLS_ZIP"
else
    echo "❌ Failed to create symbols.zip"
    exit 1
fi

