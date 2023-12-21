import React from "react"
import { JSONContent } from "@tiptap/react"
import styles from "./Notes.module.css"
import { v4 as uuidv4 } from 'uuid';
import { Note, UserData } from "./types";
import Editor from "./Editor";
import storage from './storage';
import debounce from './debounce'
import { AES, enc } from 'crypto-js';


const STORAGE_KEY = "notes";

const saveNote = debounce((note: Note, {username, passphrase}) => {
  const noteIds = storage.get<string[]>(`${username}:${STORAGE_KEY}`, []);
  const noteIdsWithoutNote = noteIds.filter((id) => id !== note.id);
  storage.set(`${username}:${STORAGE_KEY}`, [...noteIdsWithoutNote, note.id]);

  const encryptedNote = AES.encrypt(JSON.stringify(note), passphrase).toString();

  storage.set(`${username}:${STORAGE_KEY}:${note.id}`, encryptedNote);
}, 200);

const loadNotes = ({username, passphrase}: UserData) => {
  const noteIds = storage.get<string[]>(`${username}:${STORAGE_KEY}`, []);
  const notes: Record<string, Note> = {};
  noteIds.forEach((noteId) => {
    const encryptedNote = storage.get<string>(`${username}:${STORAGE_KEY}:${noteId}`);
    const decryptedNote = encryptedNote ? JSON.parse(AES.decrypt(encryptedNote, passphrase).toString(enc.Utf8)) : null;
    notes[decryptedNote.id] = {
      ...decryptedNote,
      updatedAt: new Date(decryptedNote.updatedAt),
    }
  });
  return notes;
}

interface Props {
  userData: UserData;
}

function App({userData}: Props) {
  const [notes, setNotes] = React.useState<Record<string, Note>>(()=> loadNotes(userData));
  const [activeNoteId, setActiveNoteId] = React.useState<string | null>(null);

  const activeNote = activeNoteId ? notes[activeNoteId] : null;

  const handleNoteContentChange = (id: string, content: JSONContent, title = "New note") => {
    const updatedNote: Note = {
      ...notes[id],
      content,
      title,
      updatedAt: new Date(),
    };
    setNotes((notes) => ({
      ...notes, [id]: updatedNote,
    }));
    saveNote(updatedNote, userData);
  }

  const createNewNote = () => {
    const newNote: Note = {
      id: uuidv4(),
      title: "New Note",
      content: `<h1>New Note</h1>`,
      updatedAt: new Date(),
    }
    setNotes((notes) => {
      return {...notes, [newNote.id]: newNote}
    });
    setActiveNoteId(newNote.id);
    saveNote(newNote, userData);
  }

  const handleDeleteNote = (id: string) => {
    setNotes((notes) => {
      const { [id]: _, ...remainingNotes } = notes;
      return remainingNotes;
    });
    if(activeNoteId === id) setActiveNoteId(null);
    storage.remove(`${userData.username}:${STORAGE_KEY}:${id}`);
  }

  const notesList = Object.values(notes).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  const handleNoteChange = (id: string) => {
    setActiveNoteId(id);
  }

  return(
    <div className= {styles.pageContainer}>
      <div className={styles.sidebar}>
        <button className={styles.sidebarButton} onClick={createNewNote}>
          create note
        </button>
        <div className={styles.sidebarList}>
          {notesList.map((note) => (
            <div className={note.id === activeNoteId ? styles.sidebarListItemActive : styles.sidebarListItem} key={note.id} role="button" tabIndex={0} onClick={() => handleNoteChange(note.id)}>
              {note.title}
              <button className={styles.sidebarDelete} onClick={() => handleDeleteNote(note.id)}>x</button>
            </div>
          ))}
        </div>
      </div>
      {activeNote ? (<Editor note={activeNote} onChange={(content, title) => handleNoteContentChange(activeNote.id, content, title) } />) : (<h1 className={styles.defaultPage}>Select a note or make a new one</h1>)}
    </div>
  )
}

export default App
