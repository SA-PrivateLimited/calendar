# How to Add logo.png to Android App

## Steps to Add Your Logo:

1. **Prepare your logo.png file** - Make sure you have a square logo image (recommended: 1024x1024px)

2. **Copy logo.png to all mipmap folders:**
   - Copy `logo.png` to: `android/app/src/main/res/mipmap-mdpi/ic_launcher.png`
   - Copy `logo.png` to: `android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png`
   - Copy `logo.png` to: `android/app/src/main/res/mipmap-hdpi/ic_launcher.png`
   - Copy `logo.png` to: `android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png`
   - Copy `logo.png` to: `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png`
   - Copy `logo.png` to: `android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png`
   - Copy `logo.png` to: `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png`
   - Copy `logo.png` to: `android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png`
   - Copy `logo.png` to: `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`
   - Copy `logo.png` to: `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png`

3. **Recommended sizes for each density:**
   - mdpi: 48x48px
   - hdpi: 72x72px
   - xhdpi: 96x96px
   - xxhdpi: 144x144px
   - xxxhdpi: 192x192px

4. **After adding the logo, rebuild the app:**
   ```bash
   cd android
   ./gradlew clean
   ./gradlew assembleDebug
   ```

## Quick Script (if logo.png is in project root):

If your `logo.png` is in the project root, you can run:
```bash
cd android/app/src/main/res
for dir in mipmap-*; do
  cp ../../../logo.png "$dir/ic_launcher.png"
  cp ../../../logo.png "$dir/ic_launcher_round.png"
done
```

## Note:
The AndroidManifest.xml has been updated to use `@mipmap/ic_launcher` instead of the system icon.
