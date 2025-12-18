#!/bin/bash

# Start Android Emulator Script
# This script starts the Android emulator and opens the calendar app

echo "🚀 Starting Android Emulator..."

# Path to emulator
EMULATOR_PATH="/Users/sandeepgupta/Library/Android/sdk/emulator/emulator"

# Available AVDs
AVD_NAME="Medium_Phone"

# Check if emulator is already running
if adb devices | grep -q "emulator"; then
    echo "✅ Emulator is already running!"
    adb devices
else
    echo "📱 Starting emulator: $AVD_NAME"
    $EMULATOR_PATH -avd $AVD_NAME -no-snapshot-load > /dev/null 2>&1 &
    
    echo "⏳ Waiting for emulator to boot..."
    sleep 10
    
    # Wait for emulator to be ready
    echo "🔍 Checking emulator status..."
    adb wait-for-device
    sleep 5
    
    echo "✅ Emulator is ready!"
    adb devices
fi

# Open calendar in browser
echo ""
echo "🌐 Opening calendar in emulator browser..."
sleep 3
adb shell am start -a android.intent.action.VIEW -d "http://10.0.2.2:3000" com.android.browser 2>/dev/null || \
adb shell am start -a android.intent.action.VIEW -d "http://10.0.2.2:3000" com.google.android.apps.chrome 2>/dev/null || \
echo "💡 Please manually open browser in emulator and navigate to: http://10.0.2.2:3000"

echo ""
echo "✅ Setup complete!"
echo "📍 Calendar URL: http://10.0.2.2:3000"

