# Play Store Upload Instructions - Version 1.0.2

## ✅ Fixed Issues

1. **API Level Updated**: Changed from API 34 to API 35 (required by Play Store)
2. **R8/ProGuard Enabled**: Code obfuscation enabled with mapping file generated
3. **Version Updated**: 
   - versionCode: 2 (was 1)
   - versionName: 1.0.2 (was 1.0.0)

## 📦 Files Ready for Upload

### 1. Android App Bundle (AAB)
**Location**: `app/build/outputs/bundle/release/app-release.aab`
- Size: ~2.6 MB (optimized with R8)
- Upload this to Google Play Console

### 2. Deobfuscation Mapping File (REQUIRED)
**Location**: `app/build/outputs/mapping/release/mapping.txt`
- Size: ~11 MB
- Upload this alongside the AAB to help with crash analysis
- Go to: Play Console → Your App → Release → Upload new release
- After uploading AAB, you'll see an option to upload the mapping file

## 📤 Upload Steps

### Step 1: Upload AAB
1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app: **Hindu Panchang Calendar**
3. Go to **Production** → **Create new release**
4. Click **Upload** and select: `app-release.aab`
5. Fill in **Release notes** (e.g., "Updated to API 35, improved performance")

### Step 2: Upload Mapping File
1. After uploading the AAB, scroll down to **Deobfuscation file** section
2. Click **Upload** and select: `mapping.txt`
3. This will help Google Play analyze crashes and ANRs

### Step 3: Review and Submit
1. Review all information
2. Ensure version code is 2 (higher than previous)
3. Click **Review release**
4. Click **Start rollout to Production**

## ✅ Verification Checklist

- [x] targetSdkVersion: 35
- [x] compileSdkVersion: 35
- [x] versionCode: 2
- [x] versionName: 1.0.2
- [x] R8/ProGuard enabled
- [x] Mapping file generated
- [x] AAB file created
- [ ] AAB uploaded to Play Console
- [ ] Mapping file uploaded to Play Console
- [ ] Release submitted for review

## 📝 What Changed

### build.gradle Changes:
```gradle
compileSdkVersion 35          // Was 34
targetSdkVersion 35           // Was 34
versionCode 2                 // Was 1
versionName "1.0.2"           // Was "1.0.0"
minifyEnabled true            // Was false
shrinkResources true          // Was false
```

### Benefits:
- ✅ Meets Play Store API 35 requirement
- ✅ Smaller app size (2.6 MB vs 4.0 MB)
- ✅ Better performance with code optimization
- ✅ Crash analysis support with mapping file

## 🔄 Future Updates

When updating the app:

1. **Increment versionCode** (must be higher than 2)
2. **Update versionName** (e.g., "1.0.3")
3. **Rebuild**:
   ```bash
   cd android
   ./gradlew clean bundleRelease
   ```
4. **Upload new AAB** and **mapping.txt** to Play Console

## ⚠️ Important Notes

- **Mapping File**: Always upload the mapping.txt file with each release
- **Version Code**: Must always increase (cannot decrease)
- **Keystore**: Use the same release.keystore for all updates
- **Testing**: Test the AAB before uploading (use internal testing track)

---

**Ready to upload! 🚀**

