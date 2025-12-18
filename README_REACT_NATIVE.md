# Hindu Panchang Calendar - React Native Android App

A comprehensive React Native Android application for Hindu Panchang Calendar with festivals, tithis, and personal notes.

## 🚀 Features

- ✅ Full 12-month calendar view for 2026
- ✅ Hindu Panchang data (Tithi, Nakshatra)
- ✅ Major Hindu festivals and holidays
- ✅ Personal note management
- ✅ Multilingual support (English, Hindi, Sanskrit)
- ✅ Search functionality
- ✅ Export options (JSON, CSV, PDF)
- ✅ Offline support with local caching
- ✅ Beautiful Material Design UI

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (v18 or higher)
- npm or yarn
- Android Studio installed
- Android SDK (API level 21+)
- Java Development Kit (JDK 11+)
- React Native CLI: `npm install -g react-native-cli`

## 🛠️ Installation

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **For iOS (if needed):**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Start Metro Bundler:**
   ```bash
   npm start
   ```

4. **Run Android App:**
   ```bash
   npm run android
   ```

## 📱 Running the App

### Android

1. **Start Metro:**
   ```bash
   npm start
   ```

2. **Run on Android:**
   ```bash
   npm run android
   ```

   Or use Android Studio to build and run.

### Backend Server (Optional)

If you want to use the backend API:

```bash
npm run server
```

Update the API URL in `src/services/api.js`:
- For Android Emulator: `http://10.0.2.2:3000/api`
- For Physical Device: `http://YOUR_COMPUTER_IP:3000/api`

## 📁 Project Structure

```
Calendar/
├── android/                 # Android native code
├── src/
│   ├── screens/            # Screen components
│   │   ├── CalendarScreen.js
│   │   ├── NoteScreen.js
│   │   ├── SearchScreen.js
│   │   ├── ExportScreen.js
│   │   └── SettingsScreen.js
│   ├── services/          # API services
│   │   └── api.js
│   ├── utils/             # Utilities
│   │   └── localization.js
│   └── theme/             # Theme configuration
│       └── theme.js
├── App.js                 # Main app component
├── index.js               # Entry point
└── package.json
```

## 🎨 Features Overview

### Calendar Screen
- Interactive calendar view
- Tap any date to view details
- See festivals, tithi, nakshatra
- Add notes directly from calendar

### Notes Screen
- View all your notes
- Delete notes
- Navigate to calendar to add notes

### Search Screen
- Search festivals, notes, dates
- Filter by type

### Export Screen
- Export calendar as JSON, CSV, or PDF
- Share exported files

### Settings Screen
- Change language (English/Hindi/Sanskrit)
- Enable/disable notifications
- App information

## 🔧 Configuration

### API Configuration

Edit `src/services/api.js` to configure the API base URL:

```javascript
// For Android Emulator
const API_BASE_URL = 'http://10.0.2.2:3000/api';

// For Physical Device (use your computer's IP)
const API_BASE_URL = 'http://192.168.1.XXX:3000/api';
```

### App Name & Package

- App Name: Edit `android/app/src/main/res/values/strings.xml`
- Package Name: Edit `android/app/build.gradle` (applicationId)

## 📦 Building APK

### Debug APK

```bash
cd android
./gradlew assembleDebug
```

APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK

1. Generate a keystore:
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Configure signing in `android/app/build.gradle`

3. Build release:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

## 🌐 Multilingual Support

The app supports:
- **English** (en)
- **Hindi** (hi) - हिंदी
- **Sanskrit** (sa) - संस्कृत

Language can be changed in Settings screen.

## 📞 Branding

- **Powered by:** SA-privateLimited.com
- **Contact:** +91 8210900726

Branding appears in:
- Settings screen
- Export screen
- All exported files

## 🐛 Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
npm start -- --reset-cache
```

### Clear Cache
```bash
npm start -- --reset-cache
```

## 📝 Notes

- The app works offline with cached calendar data
- Notes are stored locally using AsyncStorage
- Calendar data is cached for 24 hours
- Backend server is optional - app works standalone

## 🔐 Permissions

The app requires:
- Internet (for API calls)
- Storage (for exporting files)

## 📄 License

MIT License

---

**Hindu Panchang Calendar v1.0.0**
Powered by SA-privateLimited.com | Contact: +91 8210900726

