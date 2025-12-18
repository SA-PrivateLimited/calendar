const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Note: For production, use service account key file
// For now, using database URL directly

let firebaseInitialized = false;
let firebaseInitializationFailed = false;
let firebaseInitializationAttempts = 0;
const MAX_INIT_ATTEMPTS = 3;

// Initialize Firebase Admin
function initializeFirebase() {
    if (firebaseInitialized) {
        return true;
    }

    // If already failed multiple times, don't keep trying
    if (firebaseInitializationFailed || firebaseInitializationAttempts >= MAX_INIT_ATTEMPTS) {
        return false;
    }

    firebaseInitializationAttempts++;

    try {
        // Initialize with database URL
        // In production, you should use a service account key
        admin.initializeApp({
            databaseURL: 'https://hinducalendar-f8670-default-rtdb.firebaseio.com/'
        });

        firebaseInitialized = true;
        console.log('✅ Firebase initialized successfully');
        return true;
    } catch (error) {
        console.warn(`⚠️ Firebase initialization attempt ${firebaseInitializationAttempts} failed:`, error.message);

        if (firebaseInitializationAttempts >= MAX_INIT_ATTEMPTS) {
            firebaseInitializationFailed = true;
            console.error('❌ Firebase initialization failed after maximum attempts. Using local fallback.');
        }

        return false;
    }
}

// Get database reference
function getDatabase() {
    if (!firebaseInitialized) {
        const initialized = initializeFirebase();
        if (!initialized) {
            throw new Error('Firebase not initialized');
        }
    }
    return admin.database();
}

// Save calendar data to Firebase (optimized - save as individual days)
async function saveCalendarToFirebase(year, calendarData) {
  try {
    const db = getDatabase();
    const calendarRef = db.ref(`calendar/${year}`);
    
    // Save as object with date as key for faster lookups
    const calendarObject = {};
    calendarData.forEach(day => {
      calendarObject[day.date] = day;
    });
    
    await calendarRef.set(calendarObject);
    console.log(`✅ Calendar ${year} saved to Firebase (${calendarData.length} days)`);
    return true;
  } catch (error) {
    console.error('Error saving calendar to Firebase:', error);
    throw error;
  }
}

// Get calendar data from Firebase (optimized - fetch only needed data)
async function getCalendarFromFirebase(year, startDate = null, endDate = null) {
  try {
    const db = getDatabase();
    let ref = db.ref(`calendar/${year}`);
    
    // If date range specified, use query
    if (startDate || endDate) {
      ref = ref.orderByKey();
      if (startDate) {
        ref = ref.startAt(startDate);
      }
      if (endDate) {
        ref = ref.endAt(endDate);
      }
    }
    
    const snapshot = await ref.once('value');
    const data = snapshot.val();
    
    if (data) {
      // Convert object to array, sorted by date
      const calendarArray = Object.values(data);
      return calendarArray.sort((a, b) => a.date.localeCompare(b.date));
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
    const db = getDatabase();
    const ref = db.ref(`calendar/${year}/${date}`);
    const snapshot = await ref.once('value');
    return snapshot.val();
  } catch (error) {
    console.error('Error getting day from Firebase:', error);
    return null;
  }
}

// Update single day in calendar collection
async function updateDayInCalendar(year, date, dayData) {
  try {
    const db = getDatabase();
    const ref = db.ref(`calendar/${year}/${date}`);
    await ref.update(dayData);
    console.log(`✅ Day ${date} updated in calendar collection`);
    return true;
  } catch (error) {
    console.error('Error updating day in calendar:', error);
    throw error;
  }
}

// Save notes to Firebase (optimized - save as individual notes)
async function saveNotesToFirebase(notes) {
  try {
    const db = getDatabase();
    const notesRef = db.ref('notes');
    
    // Save as object with note ID as key
    const notesObject = {};
    notes.forEach(note => {
      notesObject[note.id] = note;
    });
    
    await notesRef.set(notesObject);
    console.log(`✅ Notes saved to Firebase (${notes.length} notes)`);
    return true;
  } catch (error) {
    console.error('Error saving notes to Firebase:', error);
    throw error;
  }
}

// Get notes from Firebase (optimized - fetch with filters)
async function getNotesFromFirebase(date = null, category = null) {
  try {
    const db = getDatabase();
    let ref = db.ref('notes');
    
    // Apply filters if provided
    if (date) {
      ref = ref.orderByChild('date').equalTo(date);
    } else if (category) {
      ref = ref.orderByChild('category').equalTo(category);
    }
    
    const snapshot = await ref.once('value');
    const data = snapshot.val();
    
    if (data) {
      // Convert object to array
      const notesArray = Object.values(data);
      return notesArray.sort((a, b) => new Date(a.date) - new Date(b.date));
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
        const db = getDatabase();
        const ref = db.ref(`notes/${note.id}`);
        await ref.set(note);
        console.log(`✅ Note ${note.id} added to Firebase`);
        return true;
    } catch (error) {
        console.error('Error adding note to Firebase:', error);
        throw error;
    }
}

// Update a note in Firebase
async function updateNoteInFirebase(noteId, noteData) {
    try {
        const db = getDatabase();
        const ref = db.ref(`notes/${noteId}`);
        await ref.update(noteData);
        console.log(`✅ Note ${noteId} updated in Firebase`);
        return true;
    } catch (error) {
        console.error('Error updating note in Firebase:', error);
        throw error;
    }
}

// Delete a note from Firebase
async function deleteNoteFromFirebase(noteId) {
    try {
        const db = getDatabase();
        const ref = db.ref(`notes/${noteId}`);
        await ref.remove();
        console.log(`✅ Note ${noteId} deleted from Firebase`);
        return true;
    } catch (error) {
        console.error('Error deleting note from Firebase:', error);
        throw error;
    }
}

// Listen to calendar changes (real-time updates)
function listenToCalendarChanges(year, callback) {
  try {
    const db = getDatabase();
    const ref = db.ref(`calendar/${year}`);
    ref.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data && callback) {
        const calendarArray = Object.values(data);
        callback(calendarArray.sort((a, b) => a.date.localeCompare(b.date)));
      }
    });
    return () => ref.off('value');
  } catch (error) {
    console.error('Error listening to calendar changes:', error);
    return null;
  }
}

// Listen to notes changes (real-time updates)
function listenToNotesChanges(callback) {
  try {
    const db = getDatabase();
    const ref = db.ref('notes');
    ref.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data && callback) {
        const notes = Object.values(data);
        callback(notes.sort((a, b) => new Date(a.date) - new Date(b.date)));
      } else {
        callback([]);
      }
    });
    return () => ref.off('value');
  } catch (error) {
    console.error('Error listening to notes changes:', error);
    return null;
  }
}

module.exports = {
  initializeFirebase,
  getDatabase,
  saveCalendarToFirebase,
  getCalendarFromFirebase,
  getDayFromFirebase,
  updateDayInCalendar,
  saveNotesToFirebase,
  getNotesFromFirebase,
  addNoteToFirebase,
  updateNoteInFirebase,
  deleteNoteFromFirebase,
  listenToCalendarChanges,
  listenToNotesChanges
};

