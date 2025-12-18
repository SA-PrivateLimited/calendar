// const axios = require('axios'); // Reserved for future API integration
// const moment = require('moment'); // Reserved for future date calculations

// Panchang data structure
// This module fetches and processes Panchang data from various sources

// Tithi names in English, Hindi, and Sanskrit
const tithiNames = {
  en: [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya"
  ],
  hi: [
    "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी",
    "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी",
    "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा/अमावस्या"
  ],
  sa: [
    "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पञ्चमी",
    "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी",
    "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा/अमावस्या"
  ]
};

// Nakshatra names
const nakshatraNames = {
  en: [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
    "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
    "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati",
    "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
    "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
    "Uttara Bhadrapada", "Revati"
  ],
  hi: [
    "अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा",
    "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा",
    "पूर्व फाल्गुनी", "उत्तर फाल्गुनी", "हस्त", "चित्रा", "स्वाती",
    "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल", "पूर्व आषाढ़ा",
    "उत्तर आषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्व भाद्रपद",
    "उत्तर भाद्रपद", "रेवती"
  ],
  sa: [
    "अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा",
    "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा",
    "पूर्व फाल्गुनी", "उत्तर फाल्गुनी", "हस्त", "चित्रा", "स्वाती",
    "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल", "पूर्व आषाढा",
    "उत्तर आषाढा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्व भाद्रपद",
    "उत्तर भाद्रपद", "रेवती"
  ]
};

// Major Hindu festivals with approximate dates (will be refined with actual Panchang)
const majorFestivals = {
  // January
  "01-14": { en: "Makar Sankranti", hi: "मकर संक्रांति", sa: "मकरसङ्क्रान्तिः" },
  "01-26": { en: "Republic Day", hi: "गणतंत्र दिवस", sa: "गणतन्त्रदिवसः" },
  
  // February
  "02-14": { en: "Valentine's Day", hi: "वेलेंटाइन दिवस", sa: "" },
  
  // March
  "03-08": { en: "Holi", hi: "होली", sa: "होलिका" },
  "03-25": { en: "Holi", hi: "होली", sa: "होलिका" },
  
  // April
  "04-14": { en: "Ambedkar Jayanti", hi: "अंबेडकर जयंती", sa: "अम्बेडकरजयन्ती" },
  "04-17": { en: "Ram Navami", hi: "राम नवमी", sa: "रामनवमी" },
  
  // May
  "05-01": { en: "Labour Day", hi: "श्रम दिवस", sa: "श्रमदिवसः" },
  
  // June
  "06-16": { en: "Eid al-Adha", hi: "ईद उल अज़हा", sa: "" },
  
  // July
  "07-17": { en: "Guru Purnima", hi: "गुरु पूर्णिमा", sa: "गुरुपूर्णिमा" },
  
  // August
  "08-15": { en: "Independence Day", hi: "स्वतंत्रता दिवस", sa: "स्वतन्त्रतादिवसः" },
  "08-26": { en: "Raksha Bandhan", hi: "रक्षा बंधन", sa: "रक्षाबन्धनम्" },
  "08-30": { en: "Janmashtami", hi: "जन्माष्टमी", sa: "जन्माष्टमी" },
  
  // September
  "09-07": { en: "Ganesh Chaturthi", hi: "गणेश चतुर्थी", sa: "गणेशचतुर्थी" },
  "09-17": { en: "Onam", hi: "ओणम", sa: "ओणम" },
  
  // October
  "10-02": { en: "Gandhi Jayanti", hi: "गांधी जयंती", sa: "गान्धीजयन्ती" },
  "10-12": { en: "Dussehra", hi: "दशहरा", sa: "दशहरा" },
  "10-31": { en: "Diwali", hi: "दिवाली", sa: "दीपावलिः" },
  
  // November
  "11-01": { en: "Govardhan Puja", hi: "गोवर्धन पूजा", sa: "गोवर्धनपूजा" },
  "11-02": { en: "Bhai Dooj", hi: "भाई दूज", sa: "भ्रातृद्वितीया" },
  "11-14": { en: "Children's Day", hi: "बाल दिवस", sa: "बालदिवसः" },
  
  // December
  "12-25": { en: "Christmas", hi: "क्रिसमस", sa: "क्रिसमसः" }
};

// Calculate tithi for a given date (simplified calculation)
function calculateTithi(date) {
  // This is a simplified calculation. For accurate tithi, use Panchang API
  const startDate = new Date(date.getFullYear(), 0, 1);
  const daysDiff = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
  const tithiIndex = daysDiff % 30;
  const paksha = tithiIndex < 15 ? "Shukla Paksha" : "Krishna Paksha";
  const tithiNum = (tithiIndex % 15) + 1;
  
  return {
    en: `${paksha} ${tithiNames.en[tithiNum - 1]}`,
    hi: `${paksha === "Shukla Paksha" ? "शुक्ल पक्ष" : "कृष्ण पक्ष"} ${tithiNames.hi[tithiNum - 1]}`,
    sa: `${paksha === "Shukla Paksha" ? "शुक्लपक्षः" : "कृष्णपक्षः"} ${tithiNames.sa[tithiNum - 1]}`
  };
}

// Calculate nakshatra for a given date (simplified)
function calculateNakshatra(date) {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const daysDiff = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
  const nakshatraIndex = daysDiff % 27;
  
  return {
    en: nakshatraNames.en[nakshatraIndex],
    hi: nakshatraNames.hi[nakshatraIndex],
    sa: nakshatraNames.sa[nakshatraIndex]
  };
}

// Get festivals for a specific date
function getFestivalsForDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const key = `${month}-${day}`;
  
  const festivals = [];
  
  // Check major festivals
  if (majorFestivals[key]) {
    festivals.push(majorFestivals[key]);
  }
  
  // Check for Ekadashi (11th tithi)
  const tithi = calculateTithi(date);
  if (tithi.en.includes("Ekadashi")) {
    festivals.push({
      en: "Ekadashi",
      hi: "एकादशी",
      sa: "एकादशी"
    });
  }
  
  // Check for Purnima (15th tithi of Shukla Paksha)
  if (tithi.en.includes("Purnima")) {
    festivals.push({
      en: "Purnima",
      hi: "पूर्णिमा",
      sa: "पूर्णिमा"
    });
  }
  
  // Check for Amavasya (15th tithi of Krishna Paksha)
  if (tithi.en.includes("Amavasya")) {
    festivals.push({
      en: "Amavasya",
      hi: "अमावस्या",
      sa: "अमावस्या"
    });
  }
  
  return festivals;
}

// Fetch Panchang data from AstroSage API (if available)
async function fetchPanchangData(date) {
  try {
    // Note: Actual API integration would go here
    // For now, we'll use calculated values
    const tithi = calculateTithi(date);
    const nakshatra = calculateNakshatra(date);
    const festivals = getFestivalsForDate(date);
    
    return {
      tithi,
      nakshatra,
      festivals,
      sunrise: "06:00", // Placeholder
      sunset: "18:00"   // Placeholder
    };
  } catch (error) {
    console.error('Error fetching Panchang data:', error);
    // Return calculated values as fallback
    return {
      tithi: calculateTithi(date),
      nakshatra: calculateNakshatra(date),
      festivals: getFestivalsForDate(date),
      sunrise: "06:00",
      sunset: "18:00"
    };
  }
}

module.exports = {
  calculateTithi,
  calculateNakshatra,
  getFestivalsForDate,
  fetchPanchangData,
  tithiNames,
  nakshatraNames,
  majorFestivals
};

