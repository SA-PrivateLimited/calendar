const fs = require('fs');
const path = require('path');

// Notes storage file
const NOTES_FILE = path.join(__dirname, '../../data/notes.json');

// Initialize notes storage
function initNotesStorage() {
  if (!fs.existsSync(path.dirname(NOTES_FILE))) {
    fs.mkdirSync(path.dirname(NOTES_FILE), { recursive: true });
  }
  if (!fs.existsSync(NOTES_FILE)) {
    fs.writeFileSync(NOTES_FILE, JSON.stringify([]));
  }
}

// Load all notes from Firebase first, then fallback to local file
async function loadNotes() {
  // Try Firebase first
  try {
    const { getNotesFromFirebase, initializeFirebase } = require('../utils/firebase');
    initializeFirebase();
    const firebaseNotes = await getNotesFromFirebase();
    if (firebaseNotes && firebaseNotes.length >= 0) {
      console.log(`✅ Loaded ${firebaseNotes.length} notes from Firebase`);
      // Also sync to local file as backup
      initNotesStorage();
      fs.writeFileSync(NOTES_FILE, JSON.stringify(firebaseNotes, null, 2));
      return firebaseNotes;
    }
  } catch (error) {
    console.warn('Firebase not available, loading from local file:', error.message);
  }
  
  // Fallback to local file
  initNotesStorage();
  try {
    const data = fs.readFileSync(NOTES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save notes
async function saveNotes(notes) {
  initNotesStorage();
  fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
  
  // Also save to Firebase if available
  try {
    const { saveNotesToFirebase, initializeFirebase } = require('../utils/firebase');
    initializeFirebase();
    await saveNotesToFirebase(notes);
  } catch (error) {
    console.warn('Firebase not available, saving to local file only:', error.message);
  }
}

// Add a new note
async function addNote(noteData) {
  const notes = loadNotes();
  const newNote = {
    id: Date.now().toString(),
    date: noteData.date,
    title: noteData.title || '',
    description: noteData.description || '',
    category: noteData.category || 'personal',
    time: noteData.time || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  notes.push(newNote);
  await saveNotes(notes);
  
  // Also save to Firebase
  try {
    const { addNoteToFirebase, initializeFirebase } = require('../utils/firebase');
    initializeFirebase();
    await addNoteToFirebase(newNote);
  } catch (error) {
    console.warn('Firebase sync failed:', error.message);
  }
  
  // Also update the calendar collection
  await updateCalendarNote(newNote.date, newNote);
  
  return newNote;
}

// Update an existing note
async function updateNote(noteId, updateData) {
  const notes = loadNotes();
  const noteIndex = notes.findIndex(note => note.id === noteId);
  
  if (noteIndex === -1) {
    throw new Error('Note not found');
  }
  
  const oldNote = notes[noteIndex];
  notes[noteIndex] = {
    ...oldNote,
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  await saveNotes(notes);
  
  // Also update in Firebase
  try {
    const { updateNoteInFirebase, initializeFirebase } = require('../utils/firebase');
    initializeFirebase();
    await updateNoteInFirebase(noteId, notes[noteIndex]);
  } catch (error) {
    console.warn('Firebase sync failed:', error.message);
  }
  
  // Update calendar collection
  await updateCalendarNote(notes[noteIndex].date, notes[noteIndex]);
  
  return notes[noteIndex];
}

// Delete a note
async function deleteNote(noteId) {
  const notes = loadNotes();
  const noteIndex = notes.findIndex(note => note.id === noteId);
  
  if (noteIndex === -1) {
    throw new Error('Note not found');
  }
  
  const deletedNote = notes[noteIndex];
  notes.splice(noteIndex, 1);
  await saveNotes(notes);
  
  // Also delete from Firebase
  try {
    const { deleteNoteFromFirebase, initializeFirebase } = require('../utils/firebase');
    initializeFirebase();
    await deleteNoteFromFirebase(noteId);
  } catch (error) {
    console.warn('Firebase sync failed:', error.message);
  }
  
  // Remove from calendar collection
  await removeCalendarNote(deletedNote.date, noteId);
  
  return deletedNote;
}

// Get notes for a specific date or category (optimized - fetch from Firebase)
async function getNotes(date = null, category = null) {
  // Try Firebase first with filters
  try {
    const { getNotesFromFirebase, initializeFirebase } = require('../utils/firebase');
    initializeFirebase();
    const firebaseNotes = await getNotesFromFirebase(date, category);
    if (firebaseNotes) {
      return firebaseNotes;
    }
  } catch (error) {
    console.warn('Firebase not available, using local notes:', error.message);
  }
  
  // Fallback to local file
  const notes = await loadNotes();
  
  let filtered = notes;
  
  if (date) {
    filtered = filtered.filter(note => note.date === date);
  }
  
  if (category) {
    filtered = filtered.filter(note => note.category === category);
  }
  
  return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Search notes
function searchNotes(query, type = 'all') {
  const notes = loadNotes();
  const lowerQuery = query.toLowerCase();
  
  let results = notes.filter(note => {
    if (type === 'title') {
      return note.title.toLowerCase().includes(lowerQuery);
    } else if (type === 'description') {
      return note.description.toLowerCase().includes(lowerQuery);
    } else if (type === 'category') {
      return note.category.toLowerCase().includes(lowerQuery);
    } else {
      // Search all fields
      return (
        note.title.toLowerCase().includes(lowerQuery) ||
        note.description.toLowerCase().includes(lowerQuery) ||
        note.category.toLowerCase().includes(lowerQuery) ||
        note.date.includes(query)
      );
    }
  });
  
  return results;
}

// Update note in calendar collection (Firebase)
async function updateCalendarNote(date, note) {
  const year = date.split('-')[0];
  
  // Update in Firebase calendar collection first
  try {
    const { getDayFromFirebase, updateDayInCalendar, initializeFirebase } = require('../utils/firebase');
    initializeFirebase();
    
    const dayData = await getDayFromFirebase(year, date);
    if (dayData) {
      if (!dayData.notes) {
        dayData.notes = [];
      }
      const noteIndex = dayData.notes.findIndex(n => n.id === note.id);
      if (noteIndex !== -1) {
        dayData.notes[noteIndex] = note;
      } else {
        dayData.notes.push(note);
      }
      await updateDayInCalendar(year, date, { notes: dayData.notes });
    }
  } catch (error) {
    console.warn('Firebase update failed, updating local file:', error.message);
  }
  
  // Also update local file as backup
  const calendarPath = path.join(__dirname, '../../data', `calendar-${year}.json`);
  if (fs.existsSync(calendarPath)) {
    try {
      const calendar = JSON.parse(fs.readFileSync(calendarPath, 'utf8'));
      const dayIndex = calendar.findIndex(day => day.date === date);
      
      if (dayIndex !== -1) {
        const noteIndex = calendar[dayIndex].notes.findIndex(n => n.id === note.id);
        if (noteIndex !== -1) {
          calendar[dayIndex].notes[noteIndex] = note;
        } else {
          calendar[dayIndex].notes.push(note);
        }
        fs.writeFileSync(calendarPath, JSON.stringify(calendar, null, 2));
      }
    } catch (error) {
      console.error('Error updating calendar note:', error);
    }
  }
}

// Remove note from calendar collection (Firebase)
async function removeCalendarNote(date, noteId) {
  const year = date.split('-')[0];
  
  // Update in Firebase first
  try {
    const { getDayFromFirebase, updateDayInCalendar, initializeFirebase } = require('../utils/firebase');
    initializeFirebase();
    
    const dayData = await getDayFromFirebase(year, date);
    if (dayData && dayData.notes) {
      dayData.notes = dayData.notes.filter(n => n.id !== noteId);
      await updateDayInCalendar(year, date, { notes: dayData.notes });
    }
  } catch (error) {
    console.warn('Firebase update failed, updating local file:', error.message);
  }
  
  // Also update local file as backup
  const calendarPath = path.join(__dirname, '../../data', `calendar-${year}.json`);
  if (fs.existsSync(calendarPath)) {
    try {
      const calendar = JSON.parse(fs.readFileSync(calendarPath, 'utf8'));
      const dayIndex = calendar.findIndex(day => day.date === date);
      
      if (dayIndex !== -1) {
        calendar[dayIndex].notes = calendar[dayIndex].notes.filter(n => n.id !== noteId);
        fs.writeFileSync(calendarPath, JSON.stringify(calendar, null, 2));
      }
    } catch (error) {
      console.error('Error removing calendar note:', error);
    }
  }
}

module.exports = {
  addNote,
  updateNote,
  deleteNote,
  getNotes,
  searchNotes
};

