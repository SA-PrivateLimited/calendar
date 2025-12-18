# 📱 Running Calendar on Android Emulator

## ✅ Server Status

The calendar server is now running and accessible from the emulator!

## 🌐 Access URLs

### From Android Emulator Browser:
```
http://10.0.2.2:3000
```
*(10.0.2.2 is the special IP that Android emulator uses to access the host machine's localhost)*

### From Physical Device (Same Network):
```
http://192.168.1.10:3000
```

### From Host Machine:
```
http://localhost:3000
```

## 🚀 Quick Start

### Option 1: Using Emulator Browser (Easiest)

1. **Start Android Emulator**
   ```bash
   # If using Android Studio
   # Tools > Device Manager > Start Emulator
   
   # Or via command line
   emulator -avd <your_avd_name>
   ```

2. **Open Browser in Emulator**
   - Open Chrome or any browser in the emulator
   - Navigate to: `http://10.0.2.2:3000`

3. **You're Done!** 🎉
   - The calendar should load with all features

### Option 2: Using React Native WebView (If Available)

If you have React Native setup, you can create a WebView wrapper:

```javascript
import React from 'react';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <WebView
      source={{ uri: 'http://10.0.2.2:3000' }}
      style={{ flex: 1 }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
}
```

Then run:
```bash
npx react-native run-android
```

## 🔧 Troubleshooting

### Server Not Accessible?

1. **Check Server is Running:**
   ```bash
   curl http://localhost:3000
   ```

2. **Check Firewall:**
   - Make sure port 3000 is not blocked
   - On macOS: System Preferences > Security & Privacy > Firewall

3. **Verify Emulator Network:**
   - In emulator: Settings > Network & Internet > Check connection

### Connection Refused?

- Make sure server is bound to `0.0.0.0` (already configured)
- Check server logs: `tail -f server.log`

### Port Already in Use?

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Restart server
npm start
```

## 📱 Testing Features on Emulator

Once loaded in emulator browser:

✅ **Calendar View** - Swipe through months
✅ **Add Notes** - Tap any date to add notes
✅ **Search** - Use search functionality
✅ **Export** - Export calendar as JSON/CSV/PDF
✅ **Language Switch** - Test Hindi/Sanskrit translations
✅ **Responsive Design** - Test mobile layout

## 🎯 Next Steps

1. **Test all features** in emulator browser
2. **Verify responsive design** works correctly
3. **Test touch interactions** (tap, swipe, scroll)
4. **Check performance** on emulator

## 📞 Support

If you encounter issues:
- Check `server.log` for errors
- Verify emulator can access internet
- Try restarting both server and emulator

---

**Server Running:** ✅
**Access URL:** http://10.0.2.2:3000
**Status:** Ready for emulator testing

