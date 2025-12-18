# 🔥 Firebase Integration Setup

## Database URL
```
https://hinducalendar-f8670-default-rtdb.firebaseio.com/
```

## ✅ Setup Complete

### Backend (Node.js)
- ✅ Firebase Admin SDK configured
- ✅ Calendar data syncs to Firebase
- ✅ Notes sync to Firebase
- ✅ Real-time updates supported

### Frontend (Web)
- ✅ Firebase REST API client configured
- ✅ Calendar loads from Firebase
- ✅ Notes sync with Firebase
- ✅ Works in browser

### Android App
- ✅ google-services.json copied
- ✅ Firebase dependencies added
- ✅ Google Services plugin configured

## 📊 Firebase Database Structure

```
hinducalendar-f8670-default-rtdb.firebaseio.com/
├── calendars/
│   ├── 2025/
│   │   └── [array of day objects]
│   ├── 2026/
│   │   └── [array of day objects]
│   └── 2027/
│       └── [array of day objects]
└── notes/
    └── [noteId]/
        ├── id
        ├── date
        ├── title
        ├── description
        ├── category
        ├── time
        ├── createdAt
        └── updatedAt
```

## 🔄 Sync Behavior

### Calendar Data
1. **On Load**: Checks Firebase first, falls back to local generation
2. **On Generate**: Saves to both local file and Firebase
3. **Real-time**: Can listen to changes (optional)

### Notes
1. **On Add**: Saves to local file and Firebase
2. **On Update**: Updates both local and Firebase
3. **On Delete**: Deletes from both local and Firebase
4. **On Load**: Checks Firebase first, falls back to local file

## 🚀 Usage

### Backend API
The server automatically syncs with Firebase when:
- Calendar is generated
- Notes are added/updated/deleted

### Frontend
The web app uses Firebase REST API to:
- Load calendar data
- Sync notes
- Real-time updates (optional)

### Android App
The Android app can:
- Access Firebase directly (if using native SDK)
- Or use the web app which syncs with Firebase

## 🔐 Security

**Important**: For production, you should:
1. Set up Firebase Authentication
2. Configure Firebase Security Rules
3. Use service account key for Admin SDK
4. Restrict database access

## 📝 Firebase Rules Example

```json
{
  "rules": {
    "calendars": {
      ".read": true,
      ".write": true
    },
    "notes": {
      ".read": true,
      ".write": true,
      "$noteId": {
        ".validate": "newData.hasChildren(['id', 'date', 'title'])"
      }
    }
  }
}
```

## 🔧 Troubleshooting

### Firebase Not Connecting?
1. Check database URL is correct
2. Verify Firebase project exists
3. Check Firebase console for errors
4. Verify network connectivity

### Data Not Syncing?
1. Check server logs for Firebase errors
2. Verify Firebase Admin SDK is initialized
3. Check database permissions
4. Verify data structure matches

---

**Database URL**: `https://hinducalendar-f8670-default-rtdb.firebaseio.com/`
**Status**: ✅ Configured and Ready

