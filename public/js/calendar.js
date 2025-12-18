// Calendar utility functions
// This file contains helper functions for calendar operations

// Get month name in different languages
function getMonthName(monthIndex, language = 'en') {
    const monthNames = {
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        hi: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
        sa: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर']
    };
    
    return monthNames[language] && monthNames[language][monthIndex] 
        ? monthNames[language][monthIndex] 
        : monthNames.en[monthIndex];
}

// Get day name in different languages
function getDayName(dayIndex, language = 'en') {
    const dayNames = {
        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        hi: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
        sa: ['रविवासरः', 'सोमवासरः', 'मङ्गलवासरः', 'बुधवासरः', 'गुरुवासरः', 'शुक्रवासरः', 'शनिवासरः']
    };
    
    return dayNames[language] && dayNames[language][dayIndex] 
        ? dayNames[language][dayIndex] 
        : dayNames.en[dayIndex];
}

// Format date for display
function formatDateDisplay(dateString, language = 'en') {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = getMonthName(date.getMonth(), language);
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
}

// Get festival color based on type
function getFestivalColor(festivalType) {
    const colors = {
        'national': '#dc3545',
        'major': '#667eea',
        'regional': '#28a745',
        'vrata': '#ffc107',
        'muhurat': '#17a2b8'
    };
    
    return colors[festivalType] || '#667eea';
}

// Check if date is today
function isToday(dateString) {
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
}

// Get days in month
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

// Get first day of month
function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

