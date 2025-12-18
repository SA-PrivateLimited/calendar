#!/bin/bash

# Script to build release AAB for Google Play Store

echo "🏗️  Building release Android App Bundle (AAB) for Play Store..."
echo ""

# Check if keystore exists
if [ ! -f "app/release.keystore" ]; then
    echo "⚠️  Release keystore not found!"
    echo "   Creating release keystore..."
    ./create_release_keystore.sh
    
    # Create keystore.properties if it doesn't exist
    if [ ! -f "keystore.properties" ]; then
        echo ""
        echo "📝 Creating keystore.properties..."
        cat > keystore.properties << EOF
storeFile=release.keystore
storePassword=android
keyAlias=hindu-calendar-release
keyPassword=android
EOF
        echo "⚠️  Using default password 'android' - CHANGE IT before production!"
    fi
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
./gradlew clean

# Build release AAB
echo ""
echo "📦 Building release AAB..."
./gradlew bundleRelease

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📱 Your AAB file is located at:"
    echo "   app/build/outputs/bundle/release/app-release.aab"
    echo ""
    echo "📤 Next steps:"
    echo "   1. Upload app-release.aab to Google Play Console"
    echo "   2. Complete app listing information"
    echo "   3. Submit for review"
    echo ""
    echo "⚠️  Remember to:"
    echo "   - Change keystore password before production"
    echo "   - Save keystore file and password securely"
    echo "   - Increment versionCode in build.gradle for updates"
else
    echo ""
    echo "❌ Build failed! Check the error messages above."
    exit 1
fi

