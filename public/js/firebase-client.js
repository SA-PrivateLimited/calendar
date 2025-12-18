// Firebase Client SDK for frontend
// Initialize Firebase in the browser

// Firebase configuration
const firebaseConfig = {
    databaseURL: 'https://hinducalendar-f8670-default-rtdb.firebaseio.com/'
};

// Initialize Firebase (using REST API since we don't have full SDK in browser)
let firebaseInitialized = false;

// Firebase REST API base URL
const FIREBASE_BASE_URL = 'https://hinducalendar-f8670-default-rtdb.firebaseio.com';

// Initialize Firebase connection
function initializeFirebase() {
    if (firebaseInitialized) {
        return true;
    }
    
    try {
        firebaseInitialized = true;
        console.log('✅ Firebase client initialized');
        return true;
    } catch (error) {
        console.error('Error initializing Firebase client:', error);
        return false;
    }
}

// Helper function to make Firebase REST API calls
async function firebaseRequest(path, method = 'GET', data = null) {
    const url = `${FIREBASE_BASE_URL}${path}.json`;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Firebase request failed: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Firebase request error:', error);
        throw error;
    }
}

// Get calendar data from Firebase (optimized - from calendar collection)
async function getCalendarFromFirebase(year, startDate = null, endDate = null) {
    try {
        let path = `/calendar/${year}`;
        if (startDate || endDate) {
            // Use query parameters for date range
            const params = [];
            if (startDate) params.push(`startAt="${startDate}"`);
            if (endDate) params.push(`endAt="${endDate}"`);
            path += `?orderBy="$key"&${params.join('&')}`;
        }
        
        const data = await firebaseRequest(path);
        if (data) {
            // Convert object to array, sorted by date
            if (typeof data === 'object' && !Array.isArray(data)) {
                const calendarArray = Object.values(data);
                return calendarArray.sort((a, b) => a.date.localeCompare(b.date));
            }
            return data;
        }
        return null;
    } catch (error) {
        console.error('Error getting calendar from Firebase:', error);
        return null;
    }
}

// Get single day from Firebase
async function getDayFromFirebase(year, date) {
    try {
        const data = await firebaseRequest(`/calendar/${year}/${date}`);
        return data;
    } catch (error) {
        console.error('Error getting day from Firebase:', error);
        return null;
    }
}

// Save calendar data to Firebase (optimized - save as object with date keys)
async function saveCalendarToFirebase(year, calendarData) {
    try {
        // Convert array to object with date as key
        const calendarObject = {};
        calendarData.forEach(day => {
            calendarObject[day.date] = day;
        });
        
        await firebaseRequest(`/calendar/${year}`, 'PUT', calendarObject);
        console.log(`✅ Calendar ${year} saved to Firebase calendar collection`);
        return true;
    } catch (error) {
        console.error('Error saving calendar to Firebase:', error);
        return false;
    }
}

// Get notes from Firebase (optimized - from notes collection with filters)
async function getNotesFromFirebase(date = null, category = null) {
    try {
        let path = '/notes';
        
        // Apply filters using Firebase queries
        if (date) {
            path += `?orderBy="date"&equalTo="${date}"`;
        } else if (category) {
            path += `?orderBy="category"&equalTo="${category}"`;
        }
        
        const data = await firebaseRequest(path);
        if (data) {
            // Convert object to array
            if (typeof data === 'object' && !Array.isArray(data)) {
                const notesArray = Object.values(data);
                return notesArray.sort((a, b) => new Date(a.date) - new Date(b.date));
            }
            return data || [];
        }
        return [];
    } catch (error) {
        console.error('Error getting notes from Firebase:', error);
        return [];
    }
}

// Add a note to Firebase
async function addNoteToFirebase(note) {
    try {
        await firebaseRequest(`/notes/${note.id}`, 'PUT', note);
        console.log(`✅ Note ${note.id} added to Firebase`);
        return true;
    } catch (error) {
        console.error('Error adding note to Firebase:', error);
        return false;
    }
}

// Update a note in Firebase
async function updateNoteInFirebase(noteId, noteData) {
    try {
        await firebaseRequest(`/notes/${noteId}`, 'PATCH', noteData);
        console.log(`✅ Note ${noteId} updated in Firebase`);
        return true;
    } catch (error) {
        console.error('Error updating note in Firebase:', error);
        return false;
    }
}

// Delete a note from Firebase
async function deleteNoteFromFirebase(noteId) {
    try {
        await firebaseRequest(`/notes/${noteId}`, 'DELETE');
        console.log(`✅ Note ${noteId} deleted from Firebase`);
        return true;
    } catch (error) {
        console.error('Error deleting note from Firebase:', error);
        return false;
    }
}

// Initialize on load
if (typeof window !== 'undefined') {
    initializeFirebase();
}

// Export functions for use in app.js
if (typeof window !== 'undefined') {
    window.firebaseClient = {
        getCalendarFromFirebase,
        getDayFromFirebase,
        saveCalendarToFirebase,
        getNotesFromFirebase,
        addNoteToFirebase,
        updateNoteInFirebase,
        deleteNoteFromFirebase,
        initializeFirebase
    };
}

