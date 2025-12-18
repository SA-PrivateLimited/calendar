const pdf = require('pdf-parse');
const fs = require('fs');

// Parse PDF and extract calendar events
async function parsePDF(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    
    // Extract text from PDF
    const text = data.text;
    
    // Parse events from text
    // This is a basic parser - you may need to customize based on PDF format
    const events = extractEvents(text);
    
    return events;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw error;
  }
}

// Extract events from PDF text
function extractEvents(text) {
  const events = [];
  const lines = text.split('\n');
  
  // Common patterns for dates and events
  const datePattern = /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/g;
  const monthPattern = /(January|February|March|April|May|June|July|August|September|October|November|December)/gi;
  
  let currentDate = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Try to extract date
    const dateMatch = line.match(datePattern);
    if (dateMatch) {
      // Parse date
      const dateParts = dateMatch[0].split(/[\/\-\.]/);
      if (dateParts.length === 3) {
        const year = dateParts[2].length === 2 ? `20${dateParts[2]}` : dateParts[2];
        currentDate = `${year}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
      }
    }
    
    // Look for festival/event names (common Hindu festival names)
    const festivalKeywords = [
      'Diwali', 'Holi', 'Dussehra', 'Raksha Bandhan', 'Janmashtami',
      'Ganesh Chaturthi', 'Navratri', 'Karva Chauth', 'Dhanteras',
      'Makar Sankranti', 'Pongal', 'Onam', 'Baisakhi', 'Gudi Padwa',
      'Ugadi', 'Rath Yatra', 'Guru Purnima', 'Ram Navami', 'Hanuman Jayanti',
      'Ekadashi', 'Purnima', 'Amavasya', 'Sankranti'
    ];
    
    for (const keyword of festivalKeywords) {
      if (line.toLowerCase().includes(keyword.toLowerCase()) && currentDate) {
        events.push({
          date: currentDate,
          name: keyword,
          description: line,
          type: 'festival'
        });
        break;
      }
    }
  }
  
  return events;
}

module.exports = {
  parsePDF,
  extractEvents
};

