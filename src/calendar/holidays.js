// Indian National Holidays Data
// Source: Government of India official holiday list

const nationalHolidays = {
  // Fixed holidays (same date every year)
  fixed: [
    { month: 1, day: 26, name: "Republic Day", nameHindi: "गणतंत्र दिवस", nameSanskrit: "गणतन्त्रदिवसः" },
    { month: 8, day: 15, name: "Independence Day", nameHindi: "स्वतंत्रता दिवस", nameSanskrit: "स्वतन्त्रतादिवसः" },
    { month: 10, day: 2, name: "Gandhi Jayanti", nameHindi: "गांधी जयंती", nameSanskrit: "गान्धीजयन्ती" }
  ],
  
  // Variable holidays (calculated based on lunar calendar or specific rules)
  // These will be calculated dynamically
};

// Optional holidays (regional/state-specific)
const optionalHolidays = [
  { month: 1, day: 1, name: "New Year's Day", nameHindi: "नव वर्ष", nameSanskrit: "नववर्षः" },
  { month: 4, day: 14, name: "Ambedkar Jayanti", nameHindi: "अंबेडकर जयंती", nameSanskrit: "अम्बेडकरजयन्ती" },
  { month: 5, day: 1, name: "Labour Day", nameHindi: "श्रम दिवस", nameSanskrit: "श्रमदिवसः" },
  { month: 11, day: 14, name: "Children's Day", nameHindi: "बाल दिवस", nameSanskrit: "बालदिवसः" },
  { month: 12, day: 25, name: "Christmas", nameHindi: "क्रिसमस", nameSanskrit: "क्रिसमसः" }
];

// Check if a date is a national holiday
function isNationalHoliday(date) {
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  const day = date.getDate();
  
  // Check fixed holidays
  for (const holiday of nationalHolidays.fixed) {
    if (holiday.month === month && holiday.day === day) {
      return {
        isHoliday: true,
        name: holiday.name,
        nameHindi: holiday.nameHindi,
        nameSanskrit: holiday.nameSanskrit,
        type: 'national'
      };
    }
  }
  
  return { isHoliday: false };
}

// Check if a date is an optional holiday
function isOptionalHoliday(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  for (const holiday of optionalHolidays) {
    if (holiday.month === month && holiday.day === day) {
      return {
        isHoliday: true,
        name: holiday.name,
        nameHindi: holiday.nameHindi,
        nameSanskrit: holiday.nameSanskrit,
        type: 'optional'
      };
    }
  }
  
  return { isHoliday: false };
}

module.exports = {
  nationalHolidays,
  optionalHolidays,
  isNationalHoliday,
  isOptionalHoliday
};

