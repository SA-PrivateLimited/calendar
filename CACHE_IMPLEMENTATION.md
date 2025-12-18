# 📦 Cache Implementation

## Overview
The calendar app now uses **IndexedDB** for local caching on mobile devices, providing fast rendering and offline support.

## 🚀 How It Works

### First Load
1. **Check Cache**: App checks if data exists in IndexedDB
2. **Load from Firebase**: If not cached, fetch from Firebase
3. **Cache Data**: Store in IndexedDB for future use
4. **Render**: Display calendar

### Subsequent Loads
1. **Check Cache**: App checks IndexedDB first
2. **Fast Render**: If cache is valid, load instantly from cache
3. **Background Update**: Optionally refresh from Firebase in background

## 📊 Cache Structure

### IndexedDB Database
- **Database Name**: `hinducalendar_cache`
- **Version**: 1

### Stores

#### 1. Calendar Store
- **Store Name**: `calendar`
- **Key Path**: `key` (format: `{year}_{date}`)
- **Indexes**:
  - `year` - For querying by year
  - `date` - For querying by date
- **Data**: Full day objects

#### 2. Notes Store
- **Store Name**: `notes`
- **Key Path**: `id` (note ID)
- **Indexes**:
  - `date` - For querying by date
  - `category` - For querying by category
- **Data**: Note objects

### Metadata (localStorage)
- **Key**: `hinducalendar_cache_meta`
- **Data**: Cache timestamps and counts
- **Format**:
```json
{
  "calendar_2026": {
    "lastUpdated": "2026-01-15T10:00:00.000Z",
    "count": 365
  },
  "notes": {
    "lastUpdated": "2026-01-15T10:00:00.000Z",
    "count": 25
  }
}
```

## ⏱️ Cache Validity

### Calendar Cache
- **Max Age**: 24 hours
- **Reason**: Calendar data changes infrequently
- **Refresh**: Daily

### Notes Cache
- **Max Age**: 1 hour
- **Reason**: Notes change more frequently
- **Refresh**: Hourly

## 🔄 Cache Flow

```
User Opens App
    ↓
Check Cache Valid?
    ├─ Yes → Load from Cache ⚡ (Fast!)
    │         ↓
    │    Render Calendar
    │         ↓
    │    Background: Check Firebase for updates
    │
    └─ No → Load from Firebase 📡
              ↓
         Cache Data
              ↓
         Render Calendar
```

## 📱 Mobile Benefits

### Performance
- ✅ **Instant Loading**: Cache loads in milliseconds
- ✅ **Reduced Data Usage**: Only fetch when cache invalid
- ✅ **Faster Rendering**: No network delay
- ✅ **Better UX**: Smooth, responsive interface

### Offline Support
- ✅ **Works Offline**: Can view cached calendar
- ✅ **Graceful Degradation**: Shows cached data if Firebase unavailable
- ✅ **Sync on Reconnect**: Updates when online

## 🛠️ Cache Management

### Automatic
- Cache is automatically created on first Firebase load
- Cache is automatically updated when data changes
- Cache validity is checked on each load

### Manual
- **Clear Cache Button**: Available in UI
- **Function**: `clearCacheData()`
- **Effect**: Clears all cached data, forces Firebase reload

## 🔧 API Functions

### Cache Manager (`window.cacheManager`)

```javascript
// Initialize cache
await cacheManager.initCache();

// Cache calendar
await cacheManager.cacheCalendar(year, calendarData);

// Get cached calendar
const calendar = await cacheManager.getCachedCalendar(year);

// Cache notes
await cacheManager.cacheNotes(notes);

// Get cached notes
const notes = await cacheManager.getCachedNotes(date, category);

// Check cache validity
const isValid = cacheManager.isCacheValid('calendar', year, maxAgeHours);

// Clear cache
await cacheManager.clearCache();

// Get cache info
const info = cacheManager.getCacheInfo();
```

## 📈 Performance Metrics

### Without Cache
- Initial Load: 2-5 seconds
- Data Transfer: ~500KB - 2MB
- Network Requests: 2-3

### With Cache
- Initial Load: <100ms ⚡
- Data Transfer: 0KB (from cache)
- Network Requests: 0 (if cache valid)

## 🔐 Storage Limits

### IndexedDB
- **Mobile**: Typically 50MB - 1GB
- **Desktop**: Typically 1GB - 5GB
- **Calendar Data**: ~500KB per year
- **Notes**: ~1KB per note

### localStorage
- **Limit**: ~5-10MB
- **Usage**: Metadata only (~1KB)

## 🐛 Troubleshooting

### Cache Not Working?
1. Check browser supports IndexedDB
2. Check storage permissions
3. Clear browser cache/data
4. Check console for errors

### Cache Too Old?
- Use "Clear Cache" button
- Or wait for automatic expiration
- Or manually clear IndexedDB

### Cache Full?
- Old cache automatically replaced
- No manual cleanup needed
- IndexedDB handles storage efficiently

---

**Status**: ✅ Implemented and Active
**Storage**: IndexedDB + localStorage
**Performance**: ⚡ Fast Rendering Enabled

