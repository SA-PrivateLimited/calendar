# 🔥 Firebase Collections Structure

## 📊 Optimized Database Structure

### Collection 1: `calendar/`
**Purpose**: Store calendar days data

**Structure**:
```
calendar/
└── 2026/
    ├── 2026-01-01/ (day object)
    ├── 2026-01-02/ (day object)
    └── ...
```

**Day Object Structure**:
```json
{
  "date": "2026-01-15",
  "day": { "en": "Thursday", "hi": "गुरुवार", "sa": "गुरुवासरः" },
  "tithi": { "en": "Shukla Paksha Panchami", ... },
  "nakshatra": { "en": "Pushya", ... },
  "festivals": [...],
  "nationalHoliday": false,
  "notes": []
}
```

**Benefits**:
- ✅ Fast lookup by date: `calendar/2026/2026-01-15`
- ✅ Can query date ranges
- ✅ Individual day updates don't affect entire calendar
- ✅ Reduced data transfer

### Collection 2: `notes/`
**Purpose**: Store user notes

**Structure**:
```
notes/
├── 1765927349989/ (note object)
├── 1765927390107/ (note object)
└── ...
```

**Note Object Structure**:
```json
{
  "id": "1765927349989",
  "date": "2026-01-15",
  "title": "Meeting",
  "description": "Team meeting",
  "category": "personal",
  "time": "10:00",
  "createdAt": "2026-01-10T10:00:00.000Z",
  "updatedAt": "2026-01-10T10:00:00.000Z"
}
```

**Benefits**:
- ✅ Fast lookup by note ID
- ✅ Can query by date or category
- ✅ Individual note operations are efficient
- ✅ Scales well with many notes

## 🚀 Optimized Queries

### Load Calendar (Optimized)
```javascript
// Load entire year
GET /api/calendar/2026

// Load date range (reduces data transfer)
GET /api/calendar/2026?startDate=2026-01-01&endDate=2026-01-31
```

### Load Notes (Optimized)
```javascript
// Load all notes
GET /api/notes

// Load notes for specific date (filtered query)
GET /api/notes?date=2026-01-15

// Load notes by category (filtered query)
GET /api/notes?category=personal
```

## 📈 Performance Improvements

### Before (Single Collection)
- ❌ Load entire calendar array (365+ objects)
- ❌ Load all notes (could be hundreds)
- ❌ High initial load time
- ❌ Large data transfer

### After (Optimized Collections)
- ✅ Load calendar from `calendar/` collection
- ✅ Load notes from `notes/` collection separately
- ✅ Can filter/query efficiently
- ✅ Reduced initial load time
- ✅ Smaller data transfers
- ✅ Lazy loading support

## 🔄 Sync Strategy

1. **Calendar Generation**:
   - Saves to `calendar/2026/` collection
   - Each day stored as `calendar/2026/YYYY-MM-DD`

2. **Notes Management**:
   - Saves to `notes/` collection
   - Each note stored as `notes/[noteId]`
   - Updates calendar day's notes array

3. **Loading**:
   - Calendar loads from `calendar/` collection
   - Notes load from `notes/` collection
   - Merged on client side

## 📱 App Load Optimization

### Initial Load
1. Load calendar for current month only (optional)
2. Load notes for visible dates only
3. Lazy load other months as needed

### On-Demand Loading
- Load specific day when clicked
- Load notes for specific date when needed
- Cache frequently accessed data

---

**Database URL**: `https://hinducalendar-f8670-default-rtdb.firebaseio.com/`
**Collections**: `calendar/` and `notes/`
**Status**: ✅ Optimized and Ready

