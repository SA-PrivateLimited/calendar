# Quick Start Guide - Hindu Panchang Calendar 2026

## ✅ Calendar Generated Successfully!

The calendar for **2026** has been generated and is ready to use.

## 🚀 Starting the Application

1. **Install Dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   npm start
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:3000`

## 📅 Features Available

### Calendar Features
- ✅ Full 12-month calendar for 2026
- ✅ Hindu Panchang data (Tithi, Nakshatra)
- ✅ Major Hindu festivals
- ✅ National holidays (India)
- ✅ Optional holidays
- ✅ Multilingual support (English, Hindi, Sanskrit)

### Note Management
- ✅ Add personal notes to any date
- ✅ Edit existing notes
- ✅ Delete notes
- ✅ Categorize notes (personal, festival, task, reminder)
- ✅ Add optional time to notes

### Export Options
- ✅ Export as JSON
- ✅ Export as CSV
- ✅ Export as PDF (with branding)

### Search & Filter
- ✅ Search by date
- ✅ Search by festival name
- ✅ Search by note content
- ✅ Filter by category

## 📁 Generated Files

- `data/calendar-2026.json` - Complete calendar data for 2026
- `data/notes.json` - User notes storage

## 🌐 API Endpoints

- `GET /api/calendar/:year` - Get calendar for a year
- `POST /api/notes` - Add a note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `GET /api/search?query=...&type=...` - Search notes/festivals
- `GET /api/export/:format?year=2026` - Export calendar (json/csv/pdf)
- `GET /api/festivals/:year` - Get all festivals for a year
- `GET /api/holidays/:year` - Get all national holidays

## 📱 Usage Examples

### Adding a Note
1. Click on any date in the calendar
2. Fill in the note form
3. Click "Save"

### Exporting Calendar
1. Click "Export" button
2. Choose format (JSON/CSV/PDF)
3. File will download automatically

### Searching
1. Click "Search" button
2. Enter search query
3. Select search type
4. Click "Search"

## 🎨 Branding

The application includes branding:
- **Powered by:** SA-privateLimited.com
- **Contact:** +91 8210900726

This branding appears in:
- Footer of the web interface
- PDF exports
- CSV exports

## 📝 Calendar Data Structure

Each day in the calendar includes:
```json
{
  "date": "2026-01-15",
  "day": {
    "en": "Thursday",
    "hi": "गुरुवार",
    "sa": "गुरुवासरः"
  },
  "tithi": {
    "en": "Shukla Paksha Panchami",
    "hi": "शुक्ल पक्ष पंचमी",
    "sa": "शुक्लपक्षः पञ्चमी"
  },
  "nakshatra": {
    "en": "Pushya",
    "hi": "पुष्य",
    "sa": "पुष्य"
  },
  "festivals": [...],
  "nationalHoliday": false,
  "optionalHoliday": false,
  "sunrise": "06:00",
  "sunset": "18:00",
  "notes": []
}
```

## 🔧 Customization

### Adding PDF Events
1. Upload a PDF via `/api/upload-pdf` endpoint
2. The system will extract events from the PDF
3. Events will be merged with Panchang data

### Updating Festival Data
Edit `src/calendar/panchang.js` to add more festivals or update existing ones.

### Changing Branding
Update footer in:
- `public/index.html` (web interface)
- `src/utils/export.js` (PDF/CSV exports)

## 📞 Support

For support, contact:
- **Phone:** +91 8210900726
- **Website:** SA-privateLimited.com

---

**Calendar System v1.0**
Powered by SA-privateLimited.com

