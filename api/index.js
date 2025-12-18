// Main API handler for Vercel serverless functions
const path = require('path');
const fs = require('fs');

// Helper to get data directory (works in both local and Vercel)
function getDataDir() {
  // Try project data directory first
  const projectDataDir = path.join(__dirname, '..', 'data');
  if (fs.existsSync(projectDataDir)) {
    return projectDataDir;
  }
  // Fallback to /tmp for Vercel
  const tmpDataDir = '/tmp/calendar-data';
  if (!fs.existsSync(tmpDataDir)) {
    fs.mkdirSync(tmpDataDir, { recursive: true });
  }
  return tmpDataDir;
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const urlPath = req.url.split('?')[0];
    const query = req.query || {};

    // Calendar endpoint: /api/calendar/:year
    if (urlPath.startsWith('/api/calendar/')) {
      const { generateCalendar } = require('../src/calendar/generator');
      const year = parseInt(urlPath.split('/').pop() || query.year || new Date().getFullYear());

      if (!year || isNaN(year)) {
        return res.status(400).json({ error: 'Invalid year parameter' });
      }

      // Try to load from local file first
      try {
        const { loadCalendar } = require('../src/calendar/generator');
        const localCalendar = loadCalendar(year);
        if (localCalendar && localCalendar.length > 0) {
          console.log(`✅ Loaded calendar ${year} from file (${localCalendar.length} days)`);
          return res.json(localCalendar);
        }
      } catch (error) {
        console.warn('Could not load from file, generating:', error.message);
      }

      // Generate new calendar
      console.log(`📅 Generating calendar for ${year}...`);
      const calendar = await generateCalendar(year);
      return res.json(calendar);
    }

    // Notes endpoints: /api/notes
    if (urlPath === '/api/notes' || urlPath.startsWith('/api/notes')) {
      const { getNotes, addNote, updateNote, deleteNote } = require('../src/notes/manager');

      if (req.method === 'GET') {
        const notes = await getNotes();
        return res.json(notes);
      }

      if (req.method === 'POST') {
        const note = await addNote(req.body);
        return res.status(201).json(note);
      }

      if (req.method === 'PUT') {
        const { id, ...updateData } = req.body;
        const note = await updateNote(id, updateData);
        return res.json(note);
      }

      if (req.method === 'DELETE') {
        const { id } = query;
        await deleteNote(id);
        return res.json({ message: 'Note deleted successfully' });
      }
    }

    // Festivals endpoint: /api/festivals/:year
    if (urlPath.startsWith('/api/festivals/')) {
      const { generateCalendar } = require('../src/calendar/generator');
      const year = parseInt(urlPath.split('/').pop() || new Date().getFullYear());
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
      
      return res.json(festivals);
    }

    // Holidays endpoint: /api/holidays/:year
    if (urlPath.startsWith('/api/holidays/')) {
      const { generateCalendar } = require('../src/calendar/generator');
      const year = parseInt(urlPath.split('/').pop() || new Date().getFullYear());
      const calendar = await generateCalendar(year);
      const holidays = calendar.filter(day => day.nationalHoliday);
      return res.json(holidays);
    }

    return res.status(404).json({ error: 'Endpoint not found', path: urlPath });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
