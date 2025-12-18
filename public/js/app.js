// Main application logic
let currentYear = 2026;
let currentLanguage = 'en';
let calendarData = [];
let filteredCalendarData = [];
let currentView = 'month'; // 'day', 'week', or 'month'
let currentDate = new Date(); // For day/week view navigation
let activeFilters = {
    tithi: 'all',
    festival: 'all',
    nakshatra: 'all'
};

// Debounce helper function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing calendar app...');
    
    // Initialize cache manager first
    if (window.cacheManager) {
        try {
            await window.cacheManager.initCache();
            console.log('✅ Cache manager initialized');
        } catch (error) {
            console.warn('Cache initialization failed:', error);
            // Continue without cache
        }
    } else {
        console.warn('⚠️ Cache manager not available');
    }
    
    // Setup event listeners
    try {
        setupEventListeners();
        console.log('✅ Event listeners setup complete');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
    
    // Load calendar (will use cache if available)
    try {
        await loadCalendar(currentYear);
    } catch (error) {
        console.error('Fatal error loading calendar:', error);
        const container = document.getElementById('calendarView');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px; color: #ef4444;">
                    <h3>Fatal Error</h3>
                    <p>${error.message}</p>
                    <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 20px;">Reload Page</button>
                </div>
            `;
        }
    }
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('yearSelect').addEventListener('change', async (e) => {
        currentYear = parseInt(e.target.value);
        await loadCalendar(currentYear);
        // Update month selector options for new year
        updateMonthSelector(currentYear);
    });
    
    // Initialize month selector
    updateMonthSelector(currentYear);
    
    document.getElementById('languageSelect').addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        renderCalendar();
    });
    
    // Month selector - scroll to selected month
    const monthSelect = document.getElementById('monthSelect');
    if (monthSelect) {
        monthSelect.addEventListener('change', (e) => {
            const monthValue = e.target.value;
            if (monthValue) {
                scrollToMonth(monthValue);
                // Reset dropdown after selection
                setTimeout(() => {
                    monthSelect.value = '';
                }, 500);
            }
        });
    }
    
    // Theme toggle button - cycles through themes
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themes = ['grey', 'blue', 'green', 'purple', 'orange', 'teal'];
    let currentThemeIndex = 0;
    
    if (themeToggleBtn) {
        // Load saved theme
        const savedTheme = localStorage.getItem('calendarTheme') || 'grey';
        currentThemeIndex = themes.indexOf(savedTheme);
        if (currentThemeIndex === -1) currentThemeIndex = 0;
        
        applyTheme(themes[currentThemeIndex]);
        
        themeToggleBtn.addEventListener('click', () => {
            // Cycle to next theme
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            const nextTheme = themes[currentThemeIndex];
            applyTheme(nextTheme);
            localStorage.setItem('calendarTheme', nextTheme);
        });
    }
    
    // Function to apply theme
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        // Update inline styles in JavaScript that use hardcoded colors
        updateThemeColors(theme);
    }
    
    // Function to update theme colors in JavaScript
    function updateThemeColors(theme) {
        const themeColors = {
            grey: { primary: '#6b7280', dark: '#4b5563' },
            blue: { primary: '#3b82f6', dark: '#2563eb' },
            green: { primary: '#10b981', dark: '#059669' },
            purple: { primary: '#8b5cf6', dark: '#7c3aed' },
            orange: { primary: '#f59e0b', dark: '#d97706' },
            teal: { primary: '#14b8a6', dark: '#0d9488' }
        };
        
        const colors = themeColors[theme] || themeColors.grey;
        // Store for use in dynamic content
        window.currentThemeColors = colors;
    }
    
    // Simple filter dropdowns with clear buttons
    const filterTithi = document.getElementById('filterTithi');
    const filterFestival = document.getElementById('filterFestival');
    const filterNakshatra = document.getElementById('filterNakshatra');
    const clearTithi = document.getElementById('clearTithi');
    const clearFestival = document.getElementById('clearFestival');
    const clearNakshatra = document.getElementById('clearNakshatra');
    
    if (filterTithi) {
        filterTithi.addEventListener('change', (e) => {
            activeFilters.tithi = e.target.value;
            updateClearButtons();
            applyFiltersImmediate();
            renderCalendar();
            if (e.target.value !== 'all') {
                // Apply filter first
                applyFiltersImmediate();
                setTimeout(() => {
                    // Check if calendarData is loaded
                    if (!calendarData || calendarData.length === 0) {
                        console.error('Calendar data not loaded yet!');
                        alert('Calendar is still loading. Please wait...');
                        return;
                    }
                    
                    // Filter data specifically for this tithi
                    const filtered = calendarData.filter(day => {
                        if (!day || !day.tithi) return false;
                        const tithi = typeof day.tithi === 'string' ? day.tithi : (day.tithi?.en || '').toLowerCase();
                        return tithi.includes(e.target.value.toLowerCase());
                    });
                    console.log('Tithi filter selected:', e.target.value, 'Found', filtered.length, 'dates');
                    console.log('Total calendarData:', calendarData.length);
                    showFilterResults('Tithi', e.target.value, filtered);
                }, 200);
            } else {
                closeFilterResultsModal();
            }
        });
    }
    
    if (filterFestival) {
        filterFestival.addEventListener('change', (e) => {
            activeFilters.festival = e.target.value;
            updateClearButtons();
            applyFiltersImmediate();
            renderCalendar();
            if (e.target.value !== 'all') {
                // Apply filter first
                applyFiltersImmediate();
                setTimeout(() => {
                    // Check if calendarData is loaded
                    if (!calendarData || calendarData.length === 0) {
                        console.error('Calendar data not loaded yet!');
                        alert('Calendar is still loading. Please wait...');
                        return;
                    }
                    
                    // Filter data specifically for festivals
                    const filtered = calendarData.filter(day => {
                        if (!day) return false;
                        if (e.target.value === 'major') {
                            return day.festivals && day.festivals.length > 0;
                        }
                        return true;
                    });
                    console.log('Festival filter selected:', e.target.value, 'Found', filtered.length, 'dates');
                    console.log('Total calendarData:', calendarData.length);
                    showFilterResults('Major Festivals', e.target.value, filtered);
                }, 200);
            } else {
                closeFilterResultsModal();
            }
        });
    }
    
    if (filterNakshatra) {
        filterNakshatra.addEventListener('change', (e) => {
            activeFilters.nakshatra = e.target.value;
            updateClearButtons();
            applyFiltersImmediate();
            renderCalendar();
            if (e.target.value !== 'all') {
                // Apply filter first
                applyFiltersImmediate();
                setTimeout(() => {
                    // Check if calendarData is loaded
                    if (!calendarData || calendarData.length === 0) {
                        console.error('Calendar data not loaded yet!');
                        alert('Calendar is still loading. Please wait...');
                        return;
                    }
                    
                    // Filter data specifically for this nakshatra
                    const filtered = calendarData.filter(day => {
                        if (!day || !day.nakshatra) return false;
                        const nakshatra = typeof day.nakshatra === 'string' ? day.nakshatra : (day.nakshatra?.en || '').toLowerCase();
                        return nakshatra.includes(e.target.value.toLowerCase());
                    });
                    console.log('Nakshatra filter selected:', e.target.value, 'Found', filtered.length, 'dates');
                    console.log('Total calendarData:', calendarData.length);
                    showFilterResults('Nakshatra', e.target.value, filtered);
                }, 200);
            } else {
                closeFilterResultsModal();
            }
        });
    }
    
    // Clear button handlers
    if (clearTithi) {
        clearTithi.addEventListener('click', (e) => {
            e.stopPropagation();
            if (filterTithi) filterTithi.value = 'all';
            activeFilters.tithi = 'all';
            updateClearButtons();
            renderCalendar();
            closeFilterResultsModal();
        });
    }
    
    if (clearFestival) {
        clearFestival.addEventListener('click', (e) => {
            e.stopPropagation();
            if (filterFestival) filterFestival.value = 'all';
            activeFilters.festival = 'all';
            updateClearButtons();
            renderCalendar();
            closeFilterResultsModal();
        });
    }
    
    if (clearNakshatra) {
        clearNakshatra.addEventListener('click', (e) => {
            e.stopPropagation();
            if (filterNakshatra) filterNakshatra.value = 'all';
            activeFilters.nakshatra = 'all';
            updateClearButtons();
            renderCalendar();
            closeFilterResultsModal();
        });
    }
    
    // Function to update clear button visibility
    function updateClearButtons() {
        if (clearTithi) {
            clearTithi.style.display = activeFilters.tithi !== 'all' ? 'flex' : 'none';
        }
        if (clearFestival) {
            clearFestival.style.display = activeFilters.festival !== 'all' ? 'flex' : 'none';
        }
        if (clearNakshatra) {
            clearNakshatra.style.display = activeFilters.nakshatra !== 'all' ? 'flex' : 'none';
        }
    }
    
    // Function to show filter results in modal
    function showFilterResults(filterType, filterValue, filteredData) {
        console.log('=== showFilterResults START ===');
        console.log('filterType:', filterType);
        console.log('filterValue:', filterValue);
        console.log('filteredData:', filteredData);
        console.log('filteredData length:', filteredData?.length);
        
        const modal = document.getElementById('filterResultsModal');
        const title = document.getElementById('filterResultsTitle');
        const content = document.getElementById('filterResultsContent');
        
        if (!modal) {
            console.error('❌ filterResultsModal not found!');
            alert('Modal element not found!');
            return;
        }
        if (!title) {
            console.error('❌ filterResultsTitle not found!');
            alert('Title element not found!');
            return;
        }
        if (!content) {
            console.error('❌ filterResultsContent not found!');
            alert('Content element not found!');
            return;
        }
        
        // Always show modal, even if no data
        if (!filteredData || filteredData.length === undefined) {
            console.warn('⚠️ filteredData is invalid, showing empty message');
            title.textContent = `${filterType}: ${filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}`;
            content.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">No data available for this filter.</p>';
        } else {
            title.textContent = `${filterType}: ${filterValue.charAt(0).toUpperCase() + filterValue.slice(1)} (${filteredData.length} dates)`;
            
            if (filteredData.length === 0) {
                content.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">No dates found matching this filter.</p>';
            } else {
                let html = '<div style="display: grid; gap: 10px; max-height: 400px; overflow-y: auto;">';
                filteredData.forEach((day, index) => {
                    if (!day || !day.date) {
                        console.warn('Invalid day data at index:', index, day);
                        return;
                    }
                    
                    try {
                        const date = new Date(day.date);
                        if (isNaN(date.getTime())) {
                            console.warn('Invalid date:', day.date);
                            return;
                        }
                        
                        const dateStr = date.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                        });
                        
                        let details = [];
                        if (day.tithi) {
                            const tithi = typeof day.tithi === 'string' ? day.tithi : (day.tithi?.en || '');
                            if (tithi) details.push(`Tithi: ${tithi}`);
                        }
                        if (day.nakshatra) {
                            const nakshatra = typeof day.nakshatra === 'string' ? day.nakshatra : (day.nakshatra?.en || '');
                            if (nakshatra) details.push(`Nakshatra: ${nakshatra}`);
                        }
                        if (day.festivals && day.festivals.length > 0) {
                            const festivals = day.festivals.map(f => typeof f === 'string' ? f : (f.en || f.name || '')).join(', ');
                            if (festivals) details.push(`Festivals: ${festivals}`);
                        }
                        
                        html += `
                            <div style="padding: 12px; background: #f9fafb; border-radius: 8px; border-left: 3px solid #6b7280;">
                                <div style="font-weight: 600; color: #6b7280; margin-bottom: 5px;">${dateStr}</div>
                                ${details.length > 0 ? `<div style="font-size: 13px; color: #6b7280;">${details.join(' • ')}</div>` : '<div style="font-size: 13px; color: #9ca3af;">No additional details</div>'}
                            </div>
                        `;
                    } catch (error) {
                        console.error('Error processing day:', day, error);
                    }
                });
                html += '</div>';
                content.innerHTML = html;
            }
        }
        
        // Force modal to show at top of viewport
        console.log('Setting modal to display...');
        modal.style.cssText = 'display: flex !important; position: fixed !important; z-index: 9999 !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background-color: rgba(0,0,0,0.6) !important; align-items: flex-start !important; justify-content: center !important; visibility: visible !important; opacity: 1 !important; padding-top: 20px !important; overflow-y: auto !important;';
        
        // Scroll modal content to top of viewport
        setTimeout(() => {
            modal.scrollTop = 0;
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 10);
        
        document.body.style.overflow = 'hidden';
        // Prevent scrolling on the calendar container
        const calendarView = document.getElementById('calendarView');
        if (calendarView) {
            calendarView.style.overflow = 'hidden';
            calendarView.style.position = 'fixed';
        }
        
        console.log('Modal style set. Computed display:', window.getComputedStyle(modal).display);
        console.log('Modal content:', content.innerHTML.substring(0, 100));
        console.log('=== showFilterResults END ===');
    }
    
    // Function to close filter results modal
    function closeFilterResultsModal() {
        const modal = document.getElementById('filterResultsModal');
        if (modal) {
            // Restore scroll position
            const scrollY = document.body.style.top;
            // Force close with !important to override inline styles
            modal.style.cssText = 'display: none !important;';
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
            // Restore calendar container
            const calendarView = document.getElementById('calendarView');
            if (calendarView) {
                calendarView.style.overflow = '';
                calendarView.style.position = '';
            }
        }
    }
    
    // Close filter results modal when clicking close button
    const filterResultsModal = document.getElementById('filterResultsModal');
    if (filterResultsModal) {
        const closeBtn = filterResultsModal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeFilterResultsModal);
        }
    }
    
    // Initial update
    updateClearButtons();

    // Modal close handlers - use event delegation for dynamically added modals
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('close') || e.target.textContent === '×') {
            e.preventDefault();
            e.stopPropagation();
            const modal = e.target.closest('.modal');
            if (modal) {
                console.log('Closing modal:', modal.id);
                // Restore scroll position
                const scrollY = document.body.style.top;
                // Remove inline styles that might prevent closing
                modal.style.cssText = 'display: none !important;';
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                if (scrollY) {
                    window.scrollTo(0, parseInt(scrollY || '0') * -1);
                }
                // Restore calendar container
                const calendarView = document.getElementById('calendarView');
                if (calendarView) {
                    calendarView.style.overflow = '';
                    calendarView.style.position = '';
                }
            }
        }
    });

    // Event delegation for day cell clicks - show day details modal
    // Use a single, well-ordered handler with proper event stopping
    const calendarView = document.getElementById('calendarView');
    if (calendarView) {
        // Remove any existing listeners by cloning the element
        const newCalendarView = calendarView.cloneNode(true);
        calendarView.parentNode.replaceChild(newCalendarView, calendarView);
        
        // Re-attach the listener to the new element
        const freshCalendarView = document.getElementById('calendarView');
        if (freshCalendarView) {
            freshCalendarView.addEventListener('click', (e) => {
                // Check if clicking on a day cell
                const dayCell = e.target.closest('.day-cell');
                if (dayCell) {
                    // Don't trigger if clicking on interactive elements
                    if (e.target.closest('.note-btn') || 
                        e.target.closest('.filter-clear-btn') || 
                        e.target.closest('.close') || 
                        e.target.closest('.modal') ||
                        e.target.closest('.modal-content')) {
                        return;
                    }
                    
                    const dateStr = dayCell.getAttribute('data-date');
                    if (dateStr) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        console.log('Opening day details for:', dateStr);
                        // Use setTimeout to ensure modal opens after event propagation completes
                        setTimeout(() => {
                            showDayDetails(dateStr);
                        }, 0);
                        return false;
                    }
                }
            }, true); // Use capture phase to run before other handlers
        }
    } else {
        console.error('calendarView element not found!');
    }

    // Close modal when clicking outside (must be after calendar click handler)
    window.addEventListener('click', (e) => {
        // Only close if clicking directly on modal background, not on calendar elements or modal content
        if (e.target.classList.contains('modal') && !e.target.closest('.modal-content') && !e.target.closest('.day-cell')) {
            const modal = e.target;
            modal.style.cssText = 'display: none !important;';
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        }
    });
    
    // Store the selected date for scrolling back after modal closes
    let selectedDateForScroll = null;
    
    // Function to show day details modal
    function showDayDetails(dateStr) {
        console.log('=== showDayDetails START ===');
        console.log('dateStr:', dateStr);
        console.log('calendarData length:', calendarData.length);
        
        // Store the selected date
        selectedDateForScroll = dateStr;
        
        const day = calendarData.find(d => d.date === dateStr);
        console.log('Day found:', day);
        if (!day) {
            console.warn('Day not found for date:', dateStr);
            return;
        }
        
        const modal = document.getElementById('dayDetailsModal');
        const title = document.getElementById('dayDetailsTitle');
        const content = document.getElementById('dayDetailsContent');
        
        console.log('Modal elements:', { modal: !!modal, title: !!title, content: !!content });
        if (!modal) {
            console.error('dayDetailsModal not found!');
            return;
        }
        if (!title) {
            console.error('dayDetailsTitle not found!');
            return;
        }
        if (!content) {
            console.error('dayDetailsContent not found!');
            return;
        }
        
        console.log('All elements found, proceeding...');
        
        const date = new Date(dateStr);
        const dateFormatted = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        title.textContent = `📅 ${dateFormatted}`;
        
        let html = '<div style="display: flex; flex-direction: column; gap: 20px;">';
        
        // Tithi
        if (day.tithi) {
            const tithi = typeof day.tithi === 'string' ? day.tithi : (day.tithi?.en || day.tithi?.hi || '');
            if (tithi) {
                html += `
                    <div style="padding: 15px; background: #f9fafb; border-radius: 10px; border-left: 4px solid var(--primary-color);">
                        <div style="font-weight: 600; color: var(--primary-color); margin-bottom: 5px; font-size: 14px;">TITHI</div>
                        <div style="font-size: 16px; color: #374151;">${tithi}</div>
                    </div>
                `;
            }
        }
        
        // Nakshatra
        if (day.nakshatra) {
            const nakshatra = typeof day.nakshatra === 'string' ? day.nakshatra : (day.nakshatra?.en || day.nakshatra?.hi || '');
            if (nakshatra) {
                html += `
                    <div style="padding: 15px; background: #f9fafb; border-radius: 10px; border-left: 4px solid var(--primary-color);">
                        <div style="font-weight: 600; color: var(--primary-color); margin-bottom: 5px; font-size: 14px;">NAKSHATRA</div>
                        <div style="font-size: 16px; color: #374151;">${nakshatra}</div>
                    </div>
                `;
            }
        }
        
        // Festivals
        if (day.festivals && day.festivals.length > 0) {
            html += `
                <div style="padding: 15px; background: #f9fafb; border-radius: 10px; border-left: 4px solid var(--primary-color);">
                    <div style="font-weight: 600; color: var(--primary-color); margin-bottom: 10px; font-size: 14px;">FESTIVALS</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
            `;
            day.festivals.forEach(festival => {
                const festivalName = typeof festival === 'string' ? festival : (festival.en || festival.name || '');
                html += `
                    <div style="padding: 10px; background: white; border-radius: 6px; font-size: 15px; color: #374151;">
                        🎉 ${festivalName}
                    </div>
                `;
            });
            html += '</div></div>';
        } else {
            html += `
                <div style="padding: 15px; background: #f9fafb; border-radius: 10px; border-left: 4px solid var(--primary-color);">
                    <div style="font-weight: 600; color: var(--primary-color); margin-bottom: 5px; font-size: 14px;">FESTIVALS</div>
                    <div style="font-size: 15px; color: #6b7280;">No festivals on this day</div>
                </div>
            `;
        }
        
        // National Holiday
        if (day.nationalHoliday) {
            html += `
                <div style="padding: 15px; background: #fee2e2; border-radius: 10px; border-left: 4px solid #ef4444;">
                    <div style="font-weight: 600; color: #ef4444; font-size: 14px;">🇮🇳 National Holiday</div>
                </div>
            `;
        }
        
        html += '</div>';
        content.innerHTML = html;
        
        // Store current scroll position
        const scrollY = window.scrollY;
        
        console.log('Setting modal styles...');
        // Position modal at top of viewport (visible screen)
        modal.style.cssText = 'display: flex !important; position: fixed !important; z-index: 9999 !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background-color: rgba(0,0,0,0.6) !important; align-items: flex-start !important; justify-content: center !important; visibility: visible !important; opacity: 1 !important; padding-top: 20px !important; overflow-y: auto !important;';
        
        // Scroll modal content to top of viewport
        setTimeout(() => {
            modal.scrollTop = 0;
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 10);
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        
        // Prevent calendar container scrolling
        const calendarView = document.getElementById('calendarView');
        if (calendarView) {
            calendarView.style.overflow = 'hidden';
        }
        
        console.log('Modal display set. Computed display:', window.getComputedStyle(modal).display);
        console.log('=== showDayDetails END ===');
    }
    
    // Close day details modal
    const dayDetailsModal = document.getElementById('dayDetailsModal');
    if (dayDetailsModal) {
        const restoreScroll = () => {
            const scrollY = document.body.style.top;
            // Force close with !important to override inline styles
            dayDetailsModal.style.cssText = 'display: none !important;';
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            
            const calendarView = document.getElementById('calendarView');
            if (calendarView) {
                calendarView.style.overflow = '';
                calendarView.style.position = '';
            }
            
            // Scroll to the selected date's month section
            if (selectedDateForScroll) {
                const date = new Date(selectedDateForScroll);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                console.log('Scrolling to month:', monthKey);
                
                setTimeout(() => {
                    // Scroll to month without notification and without highlight
                    scrollToMonth(monthKey, false, false);
                    // Also scroll to the specific date cell if possible
                    const dayCell = document.querySelector(`[data-date="${selectedDateForScroll}"]`);
                    if (dayCell) {
                        setTimeout(() => {
                            dayCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 500);
                    }
                }, 100);
            } else if (scrollY) {
                // Fallback to original scroll position if no date was stored
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        };
        
        const closeBtn = dayDetailsModal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', restoreScroll);
        }
        
        // Close modal when clicking outside
        dayDetailsModal.addEventListener('click', (e) => {
            if (e.target === dayDetailsModal) {
                restoreScroll();
            }
        });
    }
}

// Load calendar data (optimized - cache-first strategy)
async function loadCalendar(year) {
    const container = document.getElementById('calendarView');
    if (!container) {
        console.error('Calendar container not found!');
        return;
    }
    
    container.innerHTML = '<div class="loading">Loading calendar...</div>';

    try {
        let loadedData = null;

        // Step 1: Try to load from cache first (instant rendering)
        if (window.cacheManager) {
            try {
                await window.cacheManager.initCache();
                const cacheValid = window.cacheManager.isCacheValid('calendar', year, 24);
                if (cacheValid) {
                    loadedData = await window.cacheManager.getCachedCalendar(year);
                    if (loadedData && loadedData.length > 0) {
                        console.log(`⚡ Loaded ${loadedData.length} days from cache`);
                        calendarData = loadedData;
                        filteredCalendarData = [...calendarData];
                        renderCalendar();
                        
                        // Refresh from API in background
                        refreshCalendarFromAPI(year).catch(err => {
                            console.warn('Background refresh failed:', err);
                        });
                        return;
                    }
                }
            } catch (cacheError) {
                console.warn('Cache read error:', cacheError);
            }
        }

        // Step 2: Load from API
        loadedData = await refreshCalendarFromAPI(year);
        
        if (loadedData && loadedData.length > 0) {
            // Set global calendar data
            calendarData = loadedData;
            filteredCalendarData = [...calendarData];
            renderCalendar();
        } else {
            throw new Error('No calendar data received');
        }

    } catch (error) {
        console.error('Error loading calendar:', error);
        console.error('Error details:', error.message, error.stack);

        // Try to load from cache as fallback
        if (window.cacheManager) {
            try {
                const cachedCalendar = await window.cacheManager.getCachedCalendar(year);
                if (cachedCalendar && cachedCalendar.length > 0) {
                    console.log('📦 Using cached calendar as fallback');
                    calendarData = cachedCalendar;
                    filteredCalendarData = [...calendarData];
                    renderCalendar();
                    showNotification('📦 Using cached data (offline)', 'warning');
                    return;
                }
            } catch (cacheError) {
                console.error('Cache fallback failed:', cacheError);
            }
        }

        container.innerHTML = `
            <div style="text-align: center; padding: 60px; color: #ef4444;">
                <h3>Failed to load calendar</h3>
                <p>Error: ${error.message || 'Unknown error'}</p>
                <p style="font-size: 12px; color: #666; margin-top: 10px;">Check console for details</p>
                <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 20px;">Retry</button>
            </div>
        `;
    }
}

// Helper function to refresh calendar from API
async function refreshCalendarFromAPI(year) {
    console.log(`📡 Loading calendar from API for year ${year}...`);
    
    try {
        const response = await fetch(`/api/calendar/${year}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const loadedData = await response.json();
        
        if (!Array.isArray(loadedData) || loadedData.length === 0) {
            throw new Error('Invalid calendar data received');
        }
        
        console.log(`✅ Loaded ${loadedData.length} days from API`);

        // Cache the data for next time
        if (window.cacheManager) {
            try {
                await window.cacheManager.cacheCalendar(year, loadedData);
            } catch (cacheError) {
                console.warn('Failed to cache calendar:', cacheError);
            }
        }

        return loadedData;
    } catch (error) {
        console.error('API fetch error:', error);
        throw error;
    }
}

// Render calendar based on current view
function renderCalendar() {
    const container = document.getElementById('calendarView');
    container.innerHTML = '';

    // Apply filters before rendering (immediate, no debounce)
    applyFiltersImmediate();
    
    // Always render month view (all months)
    renderMonthView();
}

// Scroll to a specific month in the calendar
function scrollToMonth(monthKey, showNotificationFlag = true, highlightMonth = true) {
    const monthSection = document.querySelector(`[data-month="${monthKey}"]`);
    if (monthSection) {
        // Scroll to the month section smoothly
        monthSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
        });
        
        // Highlight the month briefly (only if requested)
        if (highlightMonth) {
            monthSection.style.transition = 'background-color 0.3s';
            monthSection.style.backgroundColor = '#fef3c7';
            setTimeout(() => {
                monthSection.style.backgroundColor = '';
            }, 2000);
        }
        
        if (showNotificationFlag) {
            showNotification(`📅 Scrolled to ${getMonthNameFromKey(monthKey)}`, 'success');
        }
    } else {
        if (showNotificationFlag) {
            showNotification('Month not found. Please wait for calendar to load.', 'warning');
        }
    }
}

// Get month name from month key (e.g., "2026-01" -> "January 2026")
function getMonthNameFromKey(monthKey) {
    const monthNames = {
        '01': 'January', '02': 'February', '03': 'March', '04': 'April',
        '05': 'May', '06': 'June', '07': 'July', '08': 'August',
        '09': 'September', '10': 'October', '11': 'November', '12': 'December'
    };
    const [year, month] = monthKey.split('-');
    return `${monthNames[month]} ${year}`;
}

// Update month selector dropdown options based on current year
function updateMonthSelector(year) {
    const monthSelect = document.getElementById('monthSelect');
    if (!monthSelect) return;
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Clear existing options except the first "Select Month..." option
    monthSelect.innerHTML = '<option value="">Select Month...</option>';
    
    // Add options for all 12 months
    for (let i = 1; i <= 12; i++) {
        const monthNum = String(i).padStart(2, '0');
        const monthKey = `${year}-${monthNum}`;
        const option = document.createElement('option');
        option.value = monthKey;
        option.textContent = `${monthNames[i - 1]} ${year}`;
        monthSelect.appendChild(option);
    }
}

// Apply filters to calendar data (immediate, used internally)
function applyFiltersImmediate() {
    // Apply simple filters
    filteredCalendarData = calendarData.filter(day => {
        // Tithi filter
        if (activeFilters.tithi !== 'all') {
            const tithi = typeof day.tithi === 'string' ? day.tithi : (day.tithi?.en || '').toLowerCase();
            if (!tithi.includes(activeFilters.tithi)) return false;
        }
        
        // Festival filter
        if (activeFilters.festival !== 'all') {
            if (activeFilters.festival === 'major') {
                const hasMajorFestival = day.festivals && day.festivals.length > 0;
                if (!hasMajorFestival) return false;
            }
        }
        
        // Nakshatra filter
        if (activeFilters.nakshatra !== 'all') {
            const nakshatra = typeof day.nakshatra === 'string' ? day.nakshatra : (day.nakshatra?.en || '').toLowerCase();
            if (!nakshatra.includes(activeFilters.nakshatra.toLowerCase())) return false;
        }
        
        return true;
    });
    
    // Show filter count
    showFilterCount();
}

// Debounced version of applyFilters (300ms delay)
const applyFilters = debounce(applyFiltersImmediate, 300);

// Clear all filters
function clearFilters() {
    const filterTithi = document.getElementById('filterTithi');
    const filterFestival = document.getElementById('filterFestival');
    const filterNakshatra = document.getElementById('filterNakshatra');

    if (filterTithi) filterTithi.value = 'all';
    if (filterFestival) filterFestival.value = 'all';
    if (filterNakshatra) filterNakshatra.value = 'all';

    activeFilters = {
        tithi: 'all',
        festival: 'all',
        nakshatra: 'all'
    };
    
    // Update clear button visibility
    if (typeof updateClearButtons === 'function') {
        updateClearButtons();
    }
    
    filteredCalendarData = [...calendarData];
    
    // Re-render
    renderCalendar();
    
    showFilterCount();
}

// Show filter count indicator
function showFilterCount() {
    const hasActiveFilters = filteredCalendarData.length !== calendarData.length;
    const filterCount = calendarData.length - filteredCalendarData.length;
    
    let indicator = document.getElementById('filterIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'filterIndicator';
        indicator.className = 'filter-indicator';
        document.querySelector('.controls').appendChild(indicator);
    }
    
    if (hasActiveFilters) {
        indicator.textContent = `🔍 ${filteredCalendarData.length} of ${calendarData.length} days shown`;
        indicator.style.display = 'block';
    } else {
        indicator.style.display = 'none';
    }
}

// Switch between views
function switchView(view) {
    currentView = view;
    
    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${view}ViewBtn`).classList.add('active');
    
    // Render the selected view
    renderCalendar();
}

// Render month view (existing functionality)
function renderMonthView() {
    const container = document.getElementById('calendarView');

    // Group by month using ALL calendar data (not filtered) to show complete months
    const months = {};
    calendarData.forEach(day => {
        const month = day.date.substring(0, 7);
        if (!months[month]) {
            months[month] = [];
        }
        months[month].push(day);
    });

    // Use DocumentFragment for efficient batch DOM insertion
    const fragment = document.createDocumentFragment();

    // Render each month with all days
    Object.keys(months).sort().forEach(month => {
        const monthSection = createMonthSection(month, months[month]);
        // Add data attribute for month scrolling
        monthSection.setAttribute('data-month', month);
        fragment.appendChild(monthSection);
    });

    // Single DOM update
    container.appendChild(fragment);
}

// Render week view
function renderWeekView() {
    const container = document.getElementById('calendarView');
    
    // Get the start of the week (Sunday)
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    // Get 7 days of the week from filtered data
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dateStr = formatDate(date);
        const dayData = filteredCalendarData.find(d => d.date === dateStr);
        if (dayData) {
            weekDays.push(dayData);
        } else {
            // Create placeholder if day not in calendar data
            weekDays.push({
                date: dateStr,
                day: { en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i] },
                tithi: { en: '' },
                nakshatra: { en: '' },
                festivals: [],
                notes: []
            });
        }
    }
    
    // Create week view container
    const weekContainer = document.createElement('div');
    weekContainer.className = 'week-view-container';
    
    // Week navigation
    const navDiv = document.createElement('div');
    navDiv.className = 'week-nav';
    navDiv.innerHTML = `
        <button class="nav-btn" onclick="navigateWeek(-1)">← Previous Week</button>
        <span class="week-range">${formatDateRange(weekDays[0]?.date, weekDays[6]?.date)}</span>
        <button class="nav-btn" onclick="navigateWeek(1)">Next Week →</button>
        <button class="nav-btn" onclick="goToToday()">Today</button>
    `;
    weekContainer.appendChild(navDiv);
    
    // Week grid
    const weekGrid = document.createElement('div');
    weekGrid.className = 'week-grid';
    
    weekDays.forEach(day => {
        const dayCard = createDayCard(day, true);
        weekGrid.appendChild(dayCard);
    });
    
    weekContainer.appendChild(weekGrid);
    container.appendChild(weekContainer);
}

// Render day view
function renderDayView() {
    const container = document.getElementById('calendarView');
    const dateStr = formatDate(currentDate);
    const dayData = filteredCalendarData.find(d => d.date === dateStr);
    
    if (!dayData) {
        container.innerHTML = '<div class="loading">Loading day view...</div>';
        return;
    }
    
    const dayContainer = document.createElement('div');
    dayContainer.className = 'day-view-container';
    
    // Day navigation
    const navDiv = document.createElement('div');
    navDiv.className = 'day-nav';
    navDiv.innerHTML = `
        <button class="nav-btn" onclick="navigateDay(-1)">← Previous Day</button>
        <span class="day-title">${formatDateDisplay(dayData.date)}</span>
        <button class="nav-btn" onclick="navigateDay(1)">Next Day →</button>
        <button class="nav-btn" onclick="goToToday()">Today</button>
    `;
    dayContainer.appendChild(navDiv);
    
    // Day card (detailed)
    const dayCard = createDayCard(dayData, false);
    dayContainer.appendChild(dayCard);
    
    container.appendChild(dayContainer);
}

// Create detailed day card
function createDayCard(day, compact = false) {
    const card = document.createElement('div');
    card.className = `day-card ${compact ? 'compact' : 'detailed'}`;
    
    if (compact) {
        // Compact version for week view
        card.innerHTML = `
            <div class="day-card-header">
                <div class="day-card-number">${parseInt(day.date.substring(8, 10))}</div>
                <div class="day-card-day">${getLocalizedValue(day.day)}</div>
            </div>
            <div class="day-card-content">
                ${day.tithi && day.tithi.en ? `<div class="day-card-info">📿 ${getLocalizedValue(day.tithi)}</div>` : ''}
                ${day.nakshatra && day.nakshatra.en ? `<div class="day-card-info">⭐ ${getLocalizedValue(day.nakshatra)}</div>` : ''}
                ${day.festivals && day.festivals.length > 0 ? `
                    <div class="day-card-festivals">
                        ${day.festivals.slice(0, 2).map(f => `
                            <div class="festival-badge">${getLocalizedValue(f)}</div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    } else {
        // Detailed version for day view
        card.innerHTML = `
            <div class="day-card-header-detailed">
                <div class="day-card-date">${formatDateDisplay(day.date)}</div>
                <div class="day-card-day-name">${getLocalizedValue(day.day)}</div>
            </div>
            <div class="day-card-body">
                <div class="day-card-section">
                    <h3>📿 Panchang Details</h3>
                    ${day.tithi && day.tithi.en ? `
                        <div class="info-row">
                            <span class="info-label">Tithi:</span>
                            <span class="info-value">${getLocalizedValue(day.tithi)}</span>
                        </div>
                    ` : ''}
                    ${day.nakshatra && day.nakshatra.en ? `
                        <div class="info-row">
                            <span class="info-label">Nakshatra:</span>
                            <span class="info-value">${getLocalizedValue(day.nakshatra)}</span>
                        </div>
                    ` : ''}
                    ${day.sunrise ? `
                        <div class="info-row">
                            <span class="info-label">Sunrise:</span>
                            <span class="info-value">${day.sunrise}</span>
                        </div>
                    ` : ''}
                    ${day.sunset ? `
                        <div class="info-row">
                            <span class="info-label">Sunset:</span>
                            <span class="info-value">${day.sunset}</span>
                        </div>
                    ` : ''}
                </div>
                
                ${day.festivals && day.festivals.length > 0 ? `
                    <div class="day-card-section">
                        <h3>🎉 Festivals & Events</h3>
                        <div class="festivals-list">
                            ${day.festivals.map(f => `
                                <div class="festival-item-detailed">${getLocalizedValue(f)}</div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    // Store date in data attribute for event delegation
    card.setAttribute('data-date', day.date);

    return card;
}

// Navigation functions
function navigateDay(days) {
    currentDate.setDate(currentDate.getDate() + days);
    renderCalendar();
}

function navigateWeek(weeks) {
    currentDate.setDate(currentDate.getDate() + (weeks * 7));
    renderCalendar();
}

function goToToday() {
    currentDate = new Date();
    renderCalendar();
}

// Format date range
function formatDateRange(startDate, endDate) {
    if (!startDate || !endDate) return '';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const monthNames = {
        en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        hi: ['जन', 'फर', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
        sa: ['जन', 'फर', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर']
    };
    const monthName = monthNames[currentLanguage] || monthNames.en;
    return `${start.getDate()} ${monthName[start.getMonth()]} - ${end.getDate()} ${monthName[end.getMonth()]} ${end.getFullYear()}`;
}

// Format date for display
function formatDateDisplay(dateString) {
    const date = new Date(dateString);
    const monthNames = {
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        hi: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
        sa: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर']
    };
    const dayNames = {
        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        hi: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
        sa: ['रविवासरः', 'सोमवासरः', 'मङ्गलवासरः', 'बुधवासरः', 'गुरुवासरः', 'शुक्रवासरः', 'शनिवासरः']
    };
    const monthName = monthNames[currentLanguage] || monthNames.en;
    const dayName = dayNames[currentLanguage] || dayNames.en;
    return `${dayName[date.getDay()]}, ${date.getDate()} ${monthName[date.getMonth()]} ${date.getFullYear()}`;
}

// Check if a day matches the current filters
function isDayFiltered(day) {
    // If no filters are active, all days match
    const hasActiveFilters = activeFilters.tithi !== 'all' ||
        activeFilters.festival !== 'all' ||
        activeFilters.nakshatra !== 'all';
    
    if (!hasActiveFilters) {
        return true; // No filters, show all days
    }
    
    // Check if day is in filteredCalendarData
    return filteredCalendarData.some(d => d.date === day.date);
}

// Make navigation functions globally available
window.navigateDay = navigateDay;
window.navigateWeek = navigateWeek;
window.goToToday = goToToday;

// Create month section
function createMonthSection(month, days) {
    const section = document.createElement('div');
    section.className = 'month-section';
    
    const monthNames = {
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        hi: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
        sa: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर']
    };
    
    const monthNum = parseInt(month.substring(5, 7)) - 1;
    const monthName = monthNames[currentLanguage][monthNum] || monthNames.en[monthNum];
    
    const header = document.createElement('div');
    header.className = 'month-header';
    header.textContent = `${monthName} ${month.substring(0, 4)}`;
    
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    // Use DocumentFragment for efficient batch insertion
    const gridFragment = document.createDocumentFragment();

    // Day headers
    const dayHeaders = {
        en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        hi: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
        sa: ['रवि', 'सोम', 'मङ्गल', 'बुध', 'गुरु', 'शुक्र', 'शनि']
    };

    dayHeaders[currentLanguage].forEach(day => {
        const headerCell = document.createElement('div');
        headerCell.className = 'day-header';
        headerCell.textContent = day;
        gridFragment.appendChild(headerCell);
    });

    // Create calendar cells - ensure ALL days of the month are shown
    const firstDay = new Date(month + '-01');
    const startDay = firstDay.getDay();
    const year = parseInt(month.substring(0, 4));
    const monthIndex = parseInt(month.substring(5, 7)) - 1;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    // Create a map of days for quick lookup
    const daysMap = {};
    days.forEach(day => {
        daysMap[day.date] = day;
    });

    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'day-cell other-month';
        gridFragment.appendChild(emptyCell);
    }

    // Add ALL days of the month (1 to daysInMonth)
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
        const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        const day = daysMap[dateStr];

        if (day) {
            // Day exists in calendar data
            const cell = createDayCell(day);

            // Check if this day matches filters
            const matchesFilter = isDayFiltered(day);
            if (!matchesFilter) {
                cell.classList.add('filtered-out');
                cell.style.opacity = '0.4';
            }

            gridFragment.appendChild(cell);
        } else {
            // Day doesn't exist in data - create placeholder
            const dateObj = new Date(year, monthIndex, dayNum);
            const placeholderDay = {
                date: dateStr,
                day: {
                    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dateObj.getDay()],
                    hi: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'][dateObj.getDay()],
                    sa: ['रविवासरः', 'सोमवासरः', 'मङ्गलवासरः', 'बुधवासरः', 'गुरुवासरः', 'शुक्रवासरः', 'शनिवासरः'][dateObj.getDay()]
                },
                tithi: { en: '', hi: '', sa: '' },
                nakshatra: { en: '', hi: '', sa: '' },
                festivals: [],
                notes: [],
                nationalHoliday: false,
                optionalHoliday: false
            };
            const cell = createDayCell(placeholderDay);
            cell.classList.add('no-data');
            gridFragment.appendChild(cell);
        }
    }

    // Add empty cells for days after month ends to complete the grid
    const totalCells = startDay + daysInMonth;
    const remainingCells = 7 - (totalCells % 7);
    if (remainingCells < 7) {
        for (let i = 0; i < remainingCells; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day-cell other-month';
            gridFragment.appendChild(emptyCell);
        }
    }

    // Single batch append
    grid.appendChild(gridFragment);
    
    section.appendChild(header);
    section.appendChild(grid);
    
    return section;
}

// Create day cell
function createDayCell(day) {
    const cell = document.createElement('div');
    cell.className = 'day-cell';
    
    const dayNum = parseInt(day.date.substring(8, 10));
    const today = new Date();
    const isToday = day.date === formatDate(today);
    
    // Add visual indicators
    if (isToday) {
        cell.classList.add('today');
    }
    if (day.nationalHoliday) {
        cell.classList.add('national-holiday');
    }
    if (day.festivals && day.festivals.length > 0) {
        cell.classList.add('festival-day');
    }
    
    // Get festival icons/emojis
    const getFestivalIcon = (festivalName) => {
        const name = typeof festivalName === 'string' ? festivalName : (festivalName.en || festivalName.name || '');
        if (name.toLowerCase().includes('diwali')) return '🪔';
        if (name.toLowerCase().includes('holi')) return '🎨';
        if (name.toLowerCase().includes('dussehra')) return '⚔️';
        if (name.toLowerCase().includes('rakhi') || name.toLowerCase().includes('raksha')) return '🪢';
        if (name.toLowerCase().includes('janmashtami')) return '🕉️';
        if (name.toLowerCase().includes('ganesh')) return '🐘';
        if (name.toLowerCase().includes('ekadashi')) return '🌙';
        if (name.toLowerCase().includes('purnima')) return '🌕';
        if (name.toLowerCase().includes('amavasya')) return '🌑';
        return '🎉';
    };
    
    cell.innerHTML = `
        <div class="day-number">
            ${isToday ? '📍 ' : ''}${dayNum}
        </div>
        <div class="day-info">${getLocalizedValue(day.day)}</div>
        ${day.tithi ? `<div class="day-info">📿 ${getLocalizedValue(day.tithi)}</div>` : ''}
        ${day.nakshatra ? `<div class="day-info">⭐ ${getLocalizedValue(day.nakshatra)}</div>` : ''}
        ${day.festivals && day.festivals.length > 0 ? `
            <div class="festival-list">
                ${day.festivals.slice(0, 2).map(f => `
                    <div class="festival-item" title="${getLocalizedValue(f)}">
                        ${getFestivalIcon(f)} ${getLocalizedValue(f)}
                    </div>
                `).join('')}
                ${day.festivals.length > 2 ? `<div class="festival-item">+${day.festivals.length - 2} more</div>` : ''}
            </div>
        ` : ''}
        ${day.nationalHoliday ? '<div style="position: absolute; top: 5px; right: 5px; font-size: 12px;">🇮🇳</div>' : ''}
    `;
    
    // Store date in data attribute for event delegation
    cell.setAttribute('data-date', day.date);
    cell.setAttribute('title', day.date);

    return cell;
}

// Memoization cache for localized values
const localizationCache = new WeakMap();

// Get localized value (with memoization)
function getLocalizedValue(obj) {
    if (typeof obj === 'string') return obj;
    if (!obj) return '';

    // Check cache
    if (localizationCache.has(obj)) {
        const cached = localizationCache.get(obj);
        if (cached[currentLanguage]) return cached[currentLanguage];
    }

    // Compute value
    const value = obj[currentLanguage] || obj.en || obj.name || '';

    // Update cache
    if (!localizationCache.has(obj)) {
        localizationCache.set(obj, {});
    }
    const cache = localizationCache.get(obj);
    cache[currentLanguage] = value;

    return value;
}

// Format date
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Open note modal
function openNoteModal(date, existingNotes = []) {
    // Load fresh notes for this date
    fetch(`/api/notes?date=${date}`)
        .then(response => response.json())
        .then(notes => {
            // Display notes list if there are any
            displayNotesInModal(date, notes);
        })
        .catch(error => {
            console.error('Error loading notes:', error);
            displayNotesInModal(date, existingNotes || []);
        });
}

// Display notes in modal
function displayNotesInModal(date, notes) {
    currentEditingNote = null;
    document.getElementById('noteDate').value = date;
    document.getElementById('noteId').value = '';
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteDescription').value = '';
    document.getElementById('noteCategory').value = 'personal';
    document.getElementById('noteTime').value = '';
    
    // Update modal title to show note count
    const noteCount = notes.length;
    document.getElementById('modalTitle').textContent = noteCount > 0 
        ? `📝 Notes for ${date} (${noteCount})` 
        : `📝 Add Note - ${date}`;
    
    // Show existing notes if any
    const notesContainer = document.getElementById('existingNotesContainer');
    if (!notesContainer) {
        // Create container for existing notes
        const form = document.getElementById('noteForm');
        const notesDiv = document.createElement('div');
        notesDiv.id = 'existingNotesContainer';
        notesDiv.className = 'existing-notes';
        form.insertBefore(notesDiv, form.firstChild);
    }
    
    const container = document.getElementById('existingNotesContainer');
    if (notes.length > 0) {
        container.innerHTML = `
            <h3 style="margin-bottom: 15px; color: ${window.currentThemeColors?.primary || '#6b7280'};">Existing Notes:</h3>
            <div class="notes-list">
                ${notes.map(note => `
                    <div class="note-item" style="background: #f5f5f5; padding: 12px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid ${window.currentThemeColors?.primary || '#6b7280'};">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div style="flex: 1;">
                                <strong style="color: #333; font-size: 16px;">${note.title || 'Untitled'}</strong>
                                ${note.description ? `<p style="margin: 5px 0; color: #666; font-size: 14px;">${note.description}</p>` : ''}
                                <div style="display: flex; gap: 10px; margin-top: 8px; font-size: 12px; color: #999;">
                                    <span>📁 ${note.category}</span>
                                    ${note.time ? `<span>🕐 ${note.time}</span>` : ''}
                                </div>
                            </div>
                            <div style="display: flex; gap: 5px;">
                                <button type="button" class="btn-edit-note" onclick="editNote('${note.id}')" style="padding: 5px 10px; font-size: 12px; background: ${window.currentThemeColors?.primary || '#6b7280'}; color: white; border: none; border-radius: 5px; cursor: pointer;">Edit</button>
                                <button type="button" class="btn-delete-note" onclick="deleteNoteFromModal('${note.id}')" style="padding: 5px 10px; font-size: 12px; background: #ef4444; color: white; border: none; border-radius: 5px; cursor: pointer;">Delete</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <hr style="margin: 20px 0; border: none; border-top: 2px solid #e5e7eb;">
            <h3 style="margin-bottom: 15px; color: ${window.currentThemeColors?.primary || '#6b7280'};">Add New Note:</h3>
        `;
    } else {
        container.innerHTML = '';
    }
    
    document.getElementById('deleteNoteBtn').style.display = 'none';
    document.getElementById('noteModal').style.display = 'block';
}

// Edit note function
window.editNote = function(noteId) {
    fetch(`/api/notes`)
        .then(response => response.json())
        .then(notes => {
            const note = notes.find(n => n.id === noteId);
            if (note) {
                currentEditingNote = note;
                document.getElementById('noteId').value = note.id;
                document.getElementById('noteTitle').value = note.title || '';
                document.getElementById('noteDescription').value = note.description || '';
                document.getElementById('noteCategory').value = note.category || 'personal';
                document.getElementById('noteTime').value = note.time || '';
                document.getElementById('modalTitle').textContent = `Edit Note - ${note.date}`;
                document.getElementById('deleteNoteBtn').style.display = 'inline-block';
                
                // Scroll to form
                document.getElementById('noteTitle').scrollIntoView({ behavior: 'smooth', block: 'center' });
                document.getElementById('noteTitle').focus();
            }
        })
        .catch(error => {
            console.error('Error loading note:', error);
            showNotification('Failed to load note', 'error');
        });
};

// Delete note from modal
window.deleteNoteFromModal = async function(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        try {
            await deleteNote(noteId);
            // Reload notes for this date
            const date = document.getElementById('noteDate').value;
            const notesResponse = await fetch(`/api/notes?date=${date}`);
            const notes = await notesResponse.json();
            displayNotesInModal(date, notes);
        } catch (error) {
            console.error('Error deleting note:', error);
            showNotification('Failed to delete note', 'error');
        }
    }
};

// Save note
async function saveNote() {
    const noteData = {
        date: document.getElementById('noteDate').value,
        title: document.getElementById('noteTitle').value,
        description: document.getElementById('noteDescription').value,
        category: document.getElementById('noteCategory').value,
        time: document.getElementById('noteTime').value || null
    };
    
    const noteId = document.getElementById('noteId').value;
    const submitBtn = document.querySelector('#noteForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
        
        if (noteId) {
            // Update existing note
            await fetch(`/api/notes/${noteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteData)
            });
            showNotification('Note updated successfully!', 'success');
        } else {
            // Create new note
            await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteData)
            });
            showNotification('Note added successfully!', 'success');
        }
        
        // Don't close modal, just refresh notes list
        const date = document.getElementById('noteDate').value;
        const notesResponse = await fetch(`/api/notes?date=${date}`);
        const notes = await notesResponse.json();
        displayNotesInModal(date, notes);
        
        // Reset form for new note
        document.getElementById('noteId').value = '';
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteDescription').value = '';
        document.getElementById('noteCategory').value = 'personal';
        document.getElementById('noteTime').value = '';
        document.getElementById('deleteNoteBtn').style.display = 'none';
        
        // Reload calendar to show note indicators
        await loadCalendar(currentYear);
    } catch (error) {
        console.error('Error saving note:', error);
        showNotification('Failed to save note. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Delete note
async function deleteNote(noteId) {
    try {
        await fetch(`/api/notes/${noteId}`, {
            method: 'DELETE'
        });
        showNotification('Note deleted successfully!', 'success');
        await loadCalendar(currentYear);
    } catch (error) {
        console.error('Error deleting note:', error);
        showNotification('Failed to delete note. Please try again.', 'error');
    }
}

// Reset note form
function resetNoteForm() {
    currentEditingNote = null;
    document.getElementById('noteForm').reset();
    document.getElementById('noteId').value = '';
}


// Clear cache data
async function clearCacheData() {
    if (confirm('Are you sure you want to clear cached data? The app will reload from Firebase on next load.')) {
        if (window.cacheManager) {
            await window.cacheManager.clearCache();
            showNotification('Cache cleared successfully!', 'success');
            // Reload calendar to fetch fresh data
            setTimeout(() => {
                loadCalendar(currentYear);
            }, 1000);
        } else {
            showNotification('Cache manager not available', 'error');
        }
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export calendar
async function exportCalendar(format) {
    try {
        showNotification(`Exporting as ${format.toUpperCase()}...`, 'info');
        const response = await fetch(`/api/export/${format}?year=${currentYear}`);
        
        if (!response.ok) throw new Error('Export failed');
        
        if (format === 'json') {
            const data = await response.json();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            downloadFile(blob, `calendar-${currentYear}.json`);
        } else if (format === 'csv') {
            const text = await response.text();
            const blob = new Blob([text], { type: 'text/csv' });
            downloadFile(blob, `calendar-${currentYear}.csv`);
        } else if (format === 'pdf') {
            const blob = await response.blob();
            downloadFile(blob, `calendar-${currentYear}.pdf`);
        }
        
        showNotification(`Calendar exported as ${format.toUpperCase()} successfully!`, 'success');
        document.getElementById('exportModal').style.display = 'none';
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Failed to export calendar. Please try again.', 'error');
    }
}

// Download file
function downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Make exportCalendar available globally
window.exportCalendar = exportCalendar;

