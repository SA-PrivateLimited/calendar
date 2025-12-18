// Cache Manager for Calendar and Notes
// Uses IndexedDB for efficient storage and localStorage for metadata

const CACHE_VERSION = 1;
const CACHE_NAME = 'hinducalendar_cache';
const CALENDAR_STORE = 'calendar';
const NOTES_STORE = 'notes';
const CACHE_META_KEY = 'hinducalendar_cache_meta';

let db = null;

// Initialize IndexedDB
function initCache() {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
            return;
        }

        const request = indexedDB.open(CACHE_NAME, CACHE_VERSION);

        request.onerror = () => {
            console.error('IndexedDB error:', request.error);
            reject(request.error);
        };

        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = event.target.result;

            // Create calendar store
            if (!database.objectStoreNames.contains(CALENDAR_STORE)) {
                const calendarStore = database.createObjectStore(CALENDAR_STORE, { keyPath: 'key' });
                calendarStore.createIndex('year', 'year', { unique: false });
                calendarStore.createIndex('date', 'date', { unique: false });
            }

            // Create notes store
            if (!database.objectStoreNames.contains(NOTES_STORE)) {
                const notesStore = database.createObjectStore(NOTES_STORE, { keyPath: 'id' });
                notesStore.createIndex('date', 'date', { unique: false });
                notesStore.createIndex('category', 'category', { unique: false });
            }
        };
    });
}

// Get cache metadata
function getCacheMeta() {
    try {
        const meta = localStorage.getItem(CACHE_META_KEY);
        return meta ? JSON.parse(meta) : null;
    } catch (error) {
        console.error('Error getting cache meta:', error);
        return null;
    }
}

// Set cache metadata
function setCacheMeta(meta) {
    try {
        localStorage.setItem(CACHE_META_KEY, JSON.stringify(meta));
    } catch (error) {
        console.error('Error setting cache meta:', error);
    }
}

// Cache calendar data (optimized batch operation)
async function cacheCalendar(year, calendarData) {
    try {
        const database = await initCache();
        const transaction = database.transaction([CALENDAR_STORE], 'readwrite');
        const store = transaction.objectStore(CALENDAR_STORE);

        // Clear old data for this year (batch delete)
        return new Promise((resolve, reject) => {
            const clearRequest = store.index('year').openKeyCursor(IDBKeyRange.only(year));
            const keysToDelete = [];
            
            clearRequest.onsuccess = (event) => {
                const cursor = event.target.cursor;
                if (cursor) {
                    keysToDelete.push(cursor.primaryKey);
                    cursor.continue();
                } else {
                    // Delete all keys
                    Promise.all(keysToDelete.map(key => {
                        return new Promise((res) => {
                            const deleteReq = store.delete(key);
                            deleteReq.onsuccess = () => res();
                            deleteReq.onerror = () => res();
                        });
                    })).then(() => {
                        // Add new calendar data (batch insert)
                        const putPromises = calendarData.map(day => {
                            return new Promise((res, rej) => {
                                const putReq = store.put({
                                    key: `${year}_${day.date}`,
                                    year: year,
                                    date: day.date,
                                    data: day
                                });
                                putReq.onsuccess = () => res();
                                putReq.onerror = () => rej(putReq.error);
                            });
                        });

                        Promise.all(putPromises).then(() => {
                            // Update cache metadata
                            const meta = getCacheMeta() || {};
                            meta[`calendar_${year}`] = {
                                lastUpdated: new Date().toISOString(),
                                count: calendarData.length
                            };
                            setCacheMeta(meta);

                            console.log(`✅ Cached calendar ${year} (${calendarData.length} days)`);
                            resolve(true);
                        }).catch(reject);
                    });
                }
            };
            
            clearRequest.onerror = () => {
                // If no data exists, just add new data
                const putPromises = calendarData.map(day => {
                    return new Promise((res, rej) => {
                        const putReq = store.put({
                            key: `${year}_${day.date}`,
                            year: year,
                            date: day.date,
                            data: day
                        });
                        putReq.onsuccess = () => res();
                        putReq.onerror = () => rej(putReq.error);
                    });
                });

                Promise.all(putPromises).then(() => {
                    const meta = getCacheMeta() || {};
                    meta[`calendar_${year}`] = {
                        lastUpdated: new Date().toISOString(),
                        count: calendarData.length
                    };
                    setCacheMeta(meta);
                    resolve(true);
                }).catch(reject);
            };
        });
    } catch (error) {
        console.error('Error caching calendar:', error);
        return false;
    }
}

// Get cached calendar
async function getCachedCalendar(year) {
    try {
        const database = await initCache();
        const transaction = database.transaction([CALENDAR_STORE], 'readonly');
        const store = transaction.objectStore(CALENDAR_STORE);
        const index = store.index('year');
        const request = index.getAll(IDBKeyRange.only(year));

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                const cachedData = request.result.map(item => item.data);
                if (cachedData.length > 0) {
                    // Sort by date
                    cachedData.sort((a, b) => a.date.localeCompare(b.date));
                    console.log(`✅ Loaded ${cachedData.length} days from cache for year ${year}`);
                    resolve(cachedData);
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Error getting cached calendar:', error);
        return null;
    }
}

// Cache notes
async function cacheNotes(notes) {
    try {
        const database = await initCache();
        const transaction = database.transaction([NOTES_STORE], 'readwrite');
        const store = transaction.objectStore(NOTES_STORE);

        // Clear all notes first
        await new Promise((resolve, reject) => {
            const clearRequest = store.clear();
            clearRequest.onsuccess = () => resolve();
            clearRequest.onerror = () => reject(clearRequest.error);
        });

        // Add new notes
        notes.forEach(note => {
            store.put(note);
        });

        // Update cache metadata
        const meta = getCacheMeta() || {};
        meta.notes = {
            lastUpdated: new Date().toISOString(),
            count: notes.length
        };
        setCacheMeta(meta);

        console.log(`✅ Cached ${notes.length} notes`);
        return true;
    } catch (error) {
        console.error('Error caching notes:', error);
        return false;
    }
}

// Get cached notes
async function getCachedNotes(date = null, category = null) {
    try {
        const database = await initCache();
        const transaction = database.transaction([NOTES_STORE], 'readonly');
        const store = transaction.objectStore(NOTES_STORE);

        return new Promise((resolve, reject) => {
            let request;
            
            if (date) {
                const index = store.index('date');
                request = index.getAll(IDBKeyRange.only(date));
            } else if (category) {
                const index = store.index('category');
                request = index.getAll(IDBKeyRange.only(category));
            } else {
                request = store.getAll();
            }

            request.onsuccess = () => {
                let notes = request.result;
                
                // Apply filters if needed
                if (date && !request.source.index) {
                    notes = notes.filter(note => note.date === date);
                }
                if (category && !request.source.index) {
                    notes = notes.filter(note => note.category === category);
                }

                // Sort by date
                notes.sort((a, b) => new Date(a.date) - new Date(b.date));

                if (notes.length > 0) {
                    console.log(`✅ Loaded ${notes.length} notes from cache`);
                    resolve(notes);
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('Error getting cached notes:', error);
        return null;
    }
}

// Clear cache
async function clearCache() {
    try {
        const database = await initCache();
        
        // Clear calendar store
        const calendarTransaction = database.transaction([CALENDAR_STORE], 'readwrite');
        await new Promise((resolve, reject) => {
            const clearRequest = calendarTransaction.objectStore(CALENDAR_STORE).clear();
            clearRequest.onsuccess = () => resolve();
            clearRequest.onerror = () => reject(clearRequest.error);
        });

        // Clear notes store
        const notesTransaction = database.transaction([NOTES_STORE], 'readwrite');
        await new Promise((resolve, reject) => {
            const clearRequest = notesTransaction.objectStore(NOTES_STORE).clear();
            clearRequest.onsuccess = () => resolve();
            clearRequest.onerror = () => reject(clearRequest.error);
        });

        // Clear metadata
        localStorage.removeItem(CACHE_META_KEY);

        console.log('✅ Cache cleared');
        return true;
    } catch (error) {
        console.error('Error clearing cache:', error);
        return false;
    }
}

// Check if cache is valid (not too old)
function isCacheValid(storeType, key, maxAgeHours = 24) {
    const meta = getCacheMeta();
    if (!meta) return false;

    const cacheKey = storeType === 'calendar' ? `calendar_${key}` : 'notes';
    const cacheInfo = meta[cacheKey];
    
    if (!cacheInfo || !cacheInfo.lastUpdated) return false;

    const lastUpdated = new Date(cacheInfo.lastUpdated);
    const now = new Date();
    const ageHours = (now - lastUpdated) / (1000 * 60 * 60);

    return ageHours < maxAgeHours;
}

// Preload cache for better performance (warm cache)
async function preloadCache(year) {
    try {
        // Check if cache exists and is valid
        if (isCacheValid('calendar', year, 24)) {
            console.log('✅ Cache already warm');
            return true;
        }

        // Preload calendar
        console.log('🔥 Warming cache...');
        const response = await fetch(`/api/calendar/${year}`);
        if (response.ok) {
            const calendarData = await response.json();
            await cacheCalendar(year, calendarData);
            
            // Preload notes
            const notesResponse = await fetch('/api/notes');
            if (notesResponse.ok) {
                const notes = await notesResponse.json();
                await cacheNotes(notes);
            }
            
            console.log('✅ Cache warmed successfully');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Cache preload error:', error);
        return false;
    }
}

// Get cache size info
function getCacheInfo() {
    const meta = getCacheMeta();
    return meta || {};
}

// Export functions
if (typeof window !== 'undefined') {
    window.cacheManager = {
        initCache,
        cacheCalendar,
        getCachedCalendar,
        cacheNotes,
        getCachedNotes,
        clearCache,
        isCacheValid,
        getCacheInfo,
        preloadCache
    };
}

