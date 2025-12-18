// Simple minimal version - guaranteed to work
let currentYear = 2026;
let currentLanguage = 'en';
let calendarData = [];
let currentView = 'month';

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('App starting...');
    setupEventListeners();
    await loadCalendar(currentYear);
});

// Setup basic event listeners
function setupEventListeners() {
    const yearSelect = document.getElementById('yearSelect');
    if (yearSelect) {
        yearSelect.addEventListener('change', async (e) => {
            currentYear = parseInt(e.target.value);
            await loadCalendar(currentYear);
        });
    }

    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            renderCalendar();
        });
    }

    const viewSelect = document.getElementById('viewSelect');
    if (viewSelect) {
        viewSelect.addEventListener('change', (e) => {
            currentView = e.target.value;
            renderCalendar();
        });
    }
}

// Load calendar from server
async function loadCalendar(year) {
    const container = document.getElementById('calendarView');
    if (!container) {
        console.error('Calendar container not found!');
        return;
    }

    container.innerHTML = '<div class="loading">Loading calendar...</div>';
    console.log(`Loading calendar for ${year}...`);

    try {
        const response = await fetch(`/api/calendar/${year}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        calendarData = await response.json();
        console.log(`✅ Loaded ${calendarData.length} days`);

        renderCalendar();
    } catch (error) {
        console.error('Error loading calendar:', error);
        container.innerHTML = `
            <div style="text-align: center; padding: 60px; color: #ef4444;">
                <h3>Failed to load calendar</h3>
                <p>${error.message}</p>
                <button class="btn btn-primary" onclick="location.reload()">Retry</button>
            </div>
        `;
    }
}

// Render the calendar
function renderCalendar() {
    const container = document.getElementById('calendarView');
    if (!container || !calendarData || calendarData.length === 0) {
        console.error('Cannot render - missing container or data');
        return;
    }

    container.innerHTML = '';
    console.log(`Rendering ${calendarData.length} days in ${currentView} view`);

    if (currentView === 'month') {
        renderMonthView();
    } else {
        container.innerHTML = '<p style="text-align: center; padding: 40px;">Day and Week views coming soon!</p>';
    }
}

// Render month view
function renderMonthView() {
    const container = document.getElementById('calendarView');

    // Group days by month
    const months = {};
    calendarData.forEach(day => {
        const month = day.date.substring(0, 7); // YYYY-MM
        if (!months[month]) {
            months[month] = [];
        }
        months[month].push(day);
    });

    // Render each month
    Object.keys(months).sort().forEach(monthKey => {
        const monthDays = months[monthKey];
        const monthSection = createMonthSection(monthKey, monthDays);
        container.appendChild(monthSection);
    });
}

// Create a month section
function createMonthSection(monthKey, days) {
    const section = document.createElement('div');
    section.className = 'month-section';

    // Month header
    const header = document.createElement('div');
    header.className = 'month-header';
    const [year, monthNum] = monthKey.split('-');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    header.textContent = `${monthNames[parseInt(monthNum) - 1]} ${year}`;
    section.appendChild(header);

    // Calendar grid
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const headerCell = document.createElement('div');
        headerCell.className = 'day-header';
        headerCell.textContent = day;
        grid.appendChild(headerCell);
    });

    // Get first day of month
    const firstDay = new Date(monthKey + '-01');
    const startDay = firstDay.getDay();

    // Add empty cells before month starts
    for (let i = 0; i < startDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'day-cell other-month';
        grid.appendChild(emptyCell);
    }

    // Add day cells
    days.forEach(day => {
        const cell = createDayCell(day);
        grid.appendChild(cell);
    });

    section.appendChild(grid);
    return section;
}

// Create a day cell
function createDayCell(day) {
    const cell = document.createElement('div');
    cell.className = 'day-cell';

    const dayNum = parseInt(day.date.substring(8, 10));
    const today = new Date().toISOString().substring(0, 10);

    if (day.date === today) {
        cell.classList.add('today');
    }
    if (day.nationalHoliday) {
        cell.classList.add('national-holiday');
    }
    if (day.festivals && day.festivals.length > 0) {
        cell.classList.add('festival-day');
    }

    // Get localized value helper
    const getLocalizedValue = (obj) => {
        if (typeof obj === 'string') return obj;
        if (!obj) return '';
        return obj[currentLanguage] || obj.en || obj.name || '';
    };

    // Build cell content
    let html = `<div class="day-number">${dayNum}</div>`;
    html += `<div class="day-info">${getLocalizedValue(day.day)}</div>`;

    if (day.tithi) {
        html += `<div class="day-info">📿 ${getLocalizedValue(day.tithi)}</div>`;
    }

    if (day.festivals && day.festivals.length > 0) {
        html += '<div class="festival-list">';
        day.festivals.slice(0, 2).forEach(festival => {
            html += `<div class="festival-item">${getLocalizedValue(festival)}</div>`;
        });
        if (day.festivals.length > 2) {
            html += `<div class="festival-item">+${day.festivals.length - 2} more</div>`;
        }
        html += '</div>';
    }

    if (day.nationalHoliday) {
        html += '<div style="position: absolute; top: 5px; right: 5px; font-size: 12px;">🇮🇳</div>';
    }

    cell.innerHTML = html;
    return cell;
}
