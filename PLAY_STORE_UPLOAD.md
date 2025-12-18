# Google Play Store Upload Guide

## ✅ Completed Steps

1. **Logo Updated**: Logo.png has been updated in all Android mipmap folders (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
2. **Release Keystore Created**: Release keystore created at `android/app/release.keystore`
3. **Build Configuration**: Updated `build.gradle` with release signing configuration
4. **AAB Built**: Release Android App Bundle (AAB) created successfully

## 📦 AAB File Location

Your release AAB file is located at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

## 🔐 Keystore Information

**⚠️ IMPORTANT: Save these credentials securely!**

- **Keystore File**: `android/app/release.keystore`
- **Keystore Password**: `android` (⚠️ CHANGE THIS BEFORE PRODUCTION!)
- **Key Alias**: `hindu-calendar-release`
- **Key Password**: `android` (⚠️ CHANGE THIS BEFORE PRODUCTION!)

**Security Note**: The default password is "android" - you MUST change it before uploading to Play Store!

## 📤 Upload to Google Play Console

### Step 1: Access Google Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Sign in with your Google account
3. Create a new app or select existing app

### Step 2: Create App Listing
1. **App Name**: Hindu Panchang Calendar
2. **Default Language**: English (or Hindi)
3. **App Type**: App
4. **Free or Paid**: Free

### Step 3: Upload AAB
1. Go to **Production** → **Create new release**
2. Upload the file: `android/app/build/outputs/bundle/release/app-release.aab`
3. Fill in release notes (what's new in this version)

### Step 4: Complete Store Listing

#### Required Assets:
- **App Icon**: 512x512 PNG (create from logo.png)
- **Feature Graphic**: 1024x500 PNG (for Play Store banner)
- **Screenshots**: 
  - Phone: At least 2 screenshots (min 320px, max 3840px)
  - Tablet (optional): At least 2 screenshots

#### App Details:
- **Short Description**: Up to 80 characters
  - Example: "Complete Hindu Panchang Calendar with festivals, tithis, and nakshatras"
- **Full Description**: Up to 4000 characters
  - Describe features, festivals, calendar functionality
- **App Category**: Lifestyle / Productivity
- **Content Rating**: Complete questionnaire
- **Privacy Policy**: Required URL (create one if you don't have)

### Step 5: Complete Required Forms
1. **Content Rating**: Complete questionnaire
2. **Target Audience**: Select appropriate age groups
3. **Data Safety**: Declare data collection practices
4. **Ads**: Declare if app contains ads
5. **Pricing**: Set as Free

### Step 6: Review and Submit
1. Review all information
2. Click **Submit for review**
3. Wait for Google's review (usually 1-3 days)

## 🔄 Updating Your App

When you need to update your app:

1. **Increment Version**:
   - Update `versionCode` in `android/app/build.gradle` (must be higher than previous)
   - Update `versionName` in `android/app/build.gradle` (e.g., "1.0.1")

2. **Rebuild AAB**:
   ```bash
   cd android
   ./gradlew clean bundleRelease
   ```

3. **Upload New AAB**:
   - Go to Play Console → Production → Create new release
   - Upload new AAB file
   - Add release notes
   - Submit for review

## 📝 Important Notes

1. **Keystore Security**: 
   - Keep `release.keystore` file secure
   - Never lose the keystore password - you cannot recover it!
   - Consider using Google Play App Signing for added security

2. **Version Code**: 
   - Must increment for each release
   - Cannot be decreased
   - Current version: 1 (versionCode 1)

3. **Testing**: 
   - Test the AAB file before uploading
   - Use Google Play Console's internal testing track first

4. **Privacy Policy**: 
   - Required for Play Store
   - Must be accessible via HTTPS URL
   - Should describe data collection practices

## 🛠️ Build Commands

### Build Release AAB:
```bash
cd android
./gradlew clean bundleRelease
```

### Build Release APK (for testing):
```bash
cd android
./gradlew clean assembleRelease
```

### Update Logo:
```bash
cd android
./update_logo.sh
```

## 📱 App Information

- **Package Name**: com.SAHinduCalendar
- **App Name**: Hindu Panchang Calendar
- **Version**: 1.0.0 (versionCode: 1)
- **Min SDK**: 21 (Android 5.0)
- **Target SDK**: 34 (Android 14)

## ✅ Checklist Before Upload

- [x] Logo updated in all mipmap folders
- [x] Release keystore created
- [x] AAB built successfully
- [ ] Change keystore password (IMPORTANT!)
- [ ] Create 512x512 app icon
- [ ] Create 1024x500 feature graphic
- [ ] Take screenshots of the app
- [ ] Write app description
- [ ] Create privacy policy URL
- [ ] Complete content rating questionnaire
- [ ] Fill data safety form

## 🆘 Troubleshooting

### Build Fails:
- Check Java version (need Java 8+)
- Ensure Android SDK is installed
- Check `keystore.properties` file exists

### Upload Fails:
- Verify AAB file size (should be reasonable)
- Check version code is higher than previous
- Ensure all required fields are filled

### Keystore Issues:
- Never lose the keystore file or password
- If lost, you'll need to create a new app listing
- Consider using Google Play App Signing

---

**Good luck with your Play Store submission! 🚀**

