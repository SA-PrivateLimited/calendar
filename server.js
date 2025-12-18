const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { generateCalendar } = require('./src/calendar/generator');
const { exportCalendar } = require('./src/utils/export');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for PDF uploads
const upload = multer({ dest: 'uploads/' });

// Ensure data directory exists
if (!fs.existsSync('data')) {
  fs.mkdirSync('data');
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get calendar for a specific year (from local files)
app.get('/api/calendar/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year);

    // Try local file first
    const { loadCalendar } = require('./src/calendar/generator');
    const localCalendar = loadCalendar(year);

    if (localCalendar && localCalendar.length > 0) {
      console.log(`✅ Loaded calendar ${year} from local file (${localCalendar.length} days)`);
      return res.json(localCalendar);
    }

    // If not found, generate new calendar
    console.log(`📅 Generating new calendar for ${year}...`);
    const calendar = await generateCalendar(year);
    res.json(calendar);
  } catch (error) {
    console.error('Error loading calendar:', error);
    res.status(500).json({ error: 'Failed to load calendar' });
  }
});

// Upload PDF and extract events
app.post('/api/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }
    
    const { parsePDF } = require('./src/utils/pdfParser');
    const events = await parsePDF(req.file.path);
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json({ events, message: 'PDF parsed successfully' });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    res.status(500).json({ error: 'Failed to parse PDF' });
  }
});


// Export calendar
app.get('/api/export/:format', async (req, res) => {
  try {
    const { format } = req.params;
    const { year } = req.query;
    const calendar = await generateCalendar(parseInt(year) || new Date().getFullYear());
    
    const exported = await exportCalendar(calendar, format);
    
    if (format === 'json') {
      res.json(calendar);
    } else if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=calendar-${year}.csv`);
      res.send(exported);
    } else if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=calendar-${year}.pdf`);
      res.send(exported);
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export calendar' });
  }
});

// Get festivals list
app.get('/api/festivals/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const calendar = await generateCalendar(year);
    const festivals = [];
    
    calendar.forEach(day => {
      if (day.festivals && day.festivals.length > 0) {
        day.festivals.forEach(festival => {
          festivals.push({
            date: day.date,
            name: festival,
            tithi: day.tithi,
            nakshatra: day.nakshatra
          });
        });
      }
    });
    
    res.json(festivals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get festivals' });
  }
});

// Get national holidays
app.get('/api/holidays/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const calendar = await generateCalendar(year);
    const holidays = calendar.filter(day => day.nationalHoliday);
    
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get holidays' });
  }
});

const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`\n🚀 Calendar Server is running!`);
  console.log(`📍 Local:   http://localhost:${PORT}`);
  console.log(`🌐 Network: http://192.168.1.10:${PORT}`);
  console.log(`\n💡 To access from emulator, use: http://10.0.2.2:${PORT}`);
  console.log(`💡 To access from device on same network, use: http://192.168.1.10:${PORT}\n`);
});

