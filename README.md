# Hindu Panchang Calendar System

A comprehensive, interactive calendar system with Hindu Panchang features, festival tracking, and personal note management.

## Features

- **12-Month Calendar**: Full year view with all Hindu festivals and events
- **Panchang Integration**: Tithis, Nakshatras, Yogas, Karanas
- **Festival Tracking**: All major Hindu festivals, vrats, muhurats
- **National Holidays**: Indian national and optional holidays
- **Note Management**: Add, edit, delete personal notes
- **Multilingual Support**: English, Hindi, Sanskrit
- **Export Options**: JSON, PDF, CSV formats
- **Search & Filter**: Search by date, festival, category
- **Color Coding**: Visual distinction for different event types

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

Visit `http://localhost:3000` in your browser.

## Project Structure

```
Calendar/
├── server.js              # Express server
├── src/
│   ├── calendar/
│   │   ├── generator.js   # Calendar data generator
│   │   ├── panchang.js    # Panchang data fetcher
│   │   └── holidays.js    # National holidays data
│   ├── notes/
│   │   └── manager.js     # Note management system
│   └── utils/
│       ├── pdfParser.js   # PDF extraction utility
│       └── export.js      # Export functionality
├── public/
│   ├── index.html         # Main UI
│   ├── css/
│   │   └── styles.css     # Styling
│   └── js/
│       ├── app.js         # Main application logic
│       └── calendar.js    # Calendar UI rendering
└── data/
    └── calendar.json      # Generated calendar data
```

## API Endpoints

- `GET /api/calendar/:year` - Get calendar for a year
- `POST /api/notes` - Add a note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `GET /api/search` - Search notes/festivals
- `GET /api/export/:format` - Export calendar (json/pdf/csv)

## Data Format

```json
{
  "date": "2024-01-15",
  "day": "Monday",
  "tithi": "Shukla Paksha Panchami",
  "nakshatra": "Pushya",
  "festivals": ["Makar Sankranti"],
  "nationalHoliday": false,
  "notes": []
}
```

# calendar
