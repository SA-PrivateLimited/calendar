#!/bin/bash

# Script to create a release keystore for Play Store
# This will prompt for keystore password and key information

KEYSTORE_FILE="app/release.keystore"
KEYSTORE_ALIAS="hindu-calendar-release"

echo "🔐 Creating release keystore for Play Store..."
echo ""
echo "⚠️  IMPORTANT: Save these credentials securely!"
echo "   You'll need them to update your app in the future."
echo ""

# Check if keystore already exists
if [ -f "$KEYSTORE_FILE" ]; then
    echo "⚠️  Release keystore already exists at $KEYSTORE_FILE"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborted. Using existing keystore."
        exit 0
    fi
fi

# Create keystore with keytool
keytool -genkeypair -v \
    -storetype PKCS12 \
    -keystore "$KEYSTORE_FILE" \
    -alias "$KEYSTORE_ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass android \
    -keypass android \
    -dname "CN=SA-privateLimited, OU=Development, O=SA-privateLimited, L=City, ST=State, C=IN"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Release keystore created successfully!"
    echo ""
    echo "📝 Keystore Details:"
    echo "   File: $KEYSTORE_FILE"
    echo "   Alias: $KEYSTORE_ALIAS"
    echo "   Password: android (CHANGE THIS IN PRODUCTION!)"
    echo ""
    echo "⚠️  SECURITY WARNING:"
    echo "   The default password is 'android' - CHANGE IT before uploading to Play Store!"
    echo "   Store the keystore file and password securely - you cannot recover them!"
else
    echo "❌ Failed to create keystore"
    exit 1
fi

