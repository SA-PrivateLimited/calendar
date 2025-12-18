const fs = require('fs');
const path = require('path');
const { fetchPanchangData } = require('./panchang');
const { isNationalHoliday, isOptionalHoliday } = require('./holidays');

// Day names in multiple languages
const dayNames = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  hi: ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
  sa: ["रविवासरः", "सोमवासरः", "मङ्गलवासरः", "बुधवासरः", "गुरुवासरः", "शुक्रवासरः", "शनिवासरः"]
};

// Month names
const monthNames = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  hi: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
  sa: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर"]
};

// Generate calendar for a specific year
async function generateCalendar(year) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  // Build array of all dates first
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log(`📅 Generating calendar for ${year} (${dates.length} days)...`);
  const startTime = Date.now();

  // Process all days in parallel using Promise.all
  const calendar = await Promise.all(dates.map(async (date) => {
    const dateStr = formatDate(date);
    const dayOfWeek = date.getDay();

    // Fetch Panchang data
    const panchangData = await fetchPanchangData(date);

    // Check for national holidays
    const holidayCheck = isNationalHoliday(date);
    const optionalHolidayCheck = isOptionalHoliday(date);

    // Prepare festivals array
    const festivals = [];
    if (panchangData.festivals && panchangData.festivals.length > 0) {
      festivals.push(...panchangData.festivals);
    }
    if (optionalHolidayCheck.isHoliday) {
      festivals.push({
        en: optionalHolidayCheck.name,
        hi: optionalHolidayCheck.nameHindi,
        sa: optionalHolidayCheck.nameSanskrit
      });
    }

    // Create calendar entry
    return {
      date: dateStr,
      day: {
        en: dayNames.en[dayOfWeek],
        hi: dayNames.hi[dayOfWeek],
        sa: dayNames.sa[dayOfWeek]
      },
      tithi: panchangData.tithi || { en: "", hi: "", sa: "" },
      nakshatra: panchangData.nakshatra || { en: "", hi: "", sa: "" },
      festivals: festivals,
      nationalHoliday: holidayCheck.isHoliday,
      optionalHoliday: optionalHolidayCheck.isHoliday,
      sunrise: panchangData.sunrise || "",
      sunset: panchangData.sunset || "",
      notes: []
    };
  }));

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ Calendar generated in ${duration}s (parallel processing)`);

  // Save calendar to local file
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const calendarPath = path.join(dataDir, `calendar-${year}.json`);
  fs.writeFileSync(calendarPath, JSON.stringify(calendar, null, 2));
  console.log(`✅ Calendar ${year} saved to local file`);

  return calendar;
}

// Format date as YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Load calendar from file if exists
function loadCalendar(year) {
  const calendarPath = path.join(__dirname, '../../data', `calendar-${year}.json`);
  if (fs.existsSync(calendarPath)) {
    try {
      const data = fs.readFileSync(calendarPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading calendar:', error);
      return null;
    }
  }
  return null;
}

// Get calendar entry for a specific date
async function getCalendarEntry(date) {
  const year = date.getFullYear();
  let calendar = loadCalendar(year);
  
  if (!calendar) {
    calendar = await generateCalendar(year);
  }
  
  const dateStr = formatDate(date);
  return calendar.find(entry => entry.date === dateStr);
}

module.exports = {
  generateCalendar,
  loadCalendar,
  getCalendarEntry,
  formatDate,
  dayNames,
  monthNames
};

