# Native Debug Symbols Upload Guide

## 📦 Symbols.zip File Created

**Location**: `app/build/outputs/native-debug-symbols/release/native-debug-symbols.zip`

## 📤 Upload to Google Play Console

### Step 1: Access Your Release
1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app: **Hindu Panchang Calendar**
3. Go to **Test and release** → **Internal testing** (or **Production**)
4. Click on your release (or create a new one)

### Step 2: Upload Symbols File
1. In the release page, scroll down to find **"Native debug symbols"** section
2. Click **"Upload"** or **"Add file"**
3. Select the file: `native-debug-symbols.zip`
4. Wait for upload to complete

### Alternative Method:
If you don't see the "Native debug symbols" section:
1. After uploading your AAB file
2. Look for **"App bundles and APKs"** section
3. Click on your uploaded AAB file
4. You should see options to upload:
   - Deobfuscation file (mapping.txt)
   - Native debug symbols (symbols.zip)

## 📋 Complete Upload Checklist

For a complete release, upload these files:

1. **AAB File** ✅
   - File: `app/build/outputs/bundle/release/app-release.aab`
   - Size: ~2.6 MB
   - Version: 3 (1.0.3)

2. **Deobfuscation File** ✅
   - File: `app/build/outputs/mapping/release/mapping.txt`
   - Size: ~11 MB
   - Required for R8/ProGuard crash analysis

3. **Native Debug Symbols** ✅
   - File: `app/build/outputs/native-debug-symbols/release/native-debug-symbols.zip`
   - Size: ~246 bytes (empty - no native code)
   - Required for native crash analysis (if applicable)

## ⚠️ Important Notes

- **Native Symbols**: This app is primarily WebView-based, so the symbols.zip file is minimal
- **If Required**: If Play Console requires native symbols and rejects the empty file, you may need to enable native debug symbols in build.gradle
- **Future Updates**: Always upload symbols.zip with each release if your app uses native code

## 🔄 Regenerating Symbols

To regenerate symbols.zip after building:

```bash
cd android
./create_symbols_zip.sh
```

Or manually:
```bash
cd android/app/build/intermediates/merged_native_libs/release/out/lib
zip -r ../../../../../outputs/native-debug-symbols/release/native-debug-symbols.zip .
```

---

**All files ready for upload! 🚀**

