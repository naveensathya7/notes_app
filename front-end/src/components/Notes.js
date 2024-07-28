import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import './Notes.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/notes');
      console.log("Response",response.data)
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const addNote = async () => {
    if (newNote.trim()) {
      try {
        console.log("API")
        const response = await axios.post('http://localhost:5000/api/notes', {
          notes_text: newNote
        });
        setNotes([...notes, { _id: response.data._id, notes_text: newNote }]);
        setNewNote('');
      } catch (error) {
        console.error('Error adding note:', error);
      }
    }
  };

  const deleteNote = async (noteId) => {
    try {
      console.log(noteId)
      await axios.delete(`http://localhost:5000/api/notes/${noteId}`);
      fetchNotes()
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };
  console.log("NOtes:",notes)
  return (
    <div className='notes-bg d-flex flex-column align-items-center w-100 '>
      <h2 className='mt-2'>Notes</h2>
      <div className='notes-input'>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="todo-user-input mb-2"
          placeholder="What needs to be done?"
          required
        />
        <Button variant="primary" onClick={addNote}>Save Note</Button>
      </div>
      {notes.length>0?(<div className="notes-list w-75 mt-5">
        {notes.map(note => (
          <div key={note._id} className='d-flex flex-row justify-content-between align-items-center mb-2 item-container'>
            
            <p className='mb-0 fw-600'>{note.notes_text}</p>
            <Button className='bg-transparent border-0'  onClick={() => deleteNote(note._id)}><MdDelete style={{color:'red'}}/></Button>
          </div>
        ))}
      </div>):(<div className='mt-5'>
        <h3>No notes to display</h3>
      </div>)}
      
    </div>
  );
};

export default Notes;
