import React, { useState, useEffect } from 'react';
import './App.css';
import Preview from './components/Preview';
import Message from './components/Message';
import NotesList from './components/NotesSection/NotesList';
import Note from './components/NotesSection/Note';
import Container from './components/NotesSection/Container';
import NoteForm from './components/NotesSection/NoteForm';
import Alert from './components/Alert';

function App() {

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('notes')) {
      setNotes(JSON.parse(localStorage.getItem('notes')));
    } else {
      localStorage.setItem('notes', JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    if (validationErrors.length !== 0) {
     setTimeout(() => {
      setValidationErrors([]);
     }, 3000);
    } 
  }, [validationErrors]);

  const saveTolocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const validate = () =>{
    const validationErrors = [];
    let passed = true;
    if(!title){
      validationErrors.push("ادخل عنوان");
      passed = false;
    }

    if(!content){
      validationErrors.push("ادخل نص");
      passed = false;
    }

    setValidationErrors(validationErrors);
    return passed;
  }

  const changeTitleHandler = (event) => {
    setTitle(event.target.value);
  }

  const changeContentHandler = (event) => {
    setContent(event.target.value);
  }

  const selectNoteHandler = noteId => {
    setSelectedNote(noteId);
    setCreating(false);
    setEditing(false);
  }

  const saveNoteHandler = () => {
    if(!validate()) return;

    const note = {
      id: new Date(),
      title: title,
      content: content
    }

    const updateNotes = [...notes, note];

    saveTolocalStorage('notes',updateNotes);
    setNotes(updateNotes);
    setCreating(false);
    setSelectedNote(note.id);
    setTitle('');
    setContent('');
  }

  const updateNoteHandlar = () => {
    if(!validate()) return;
    const updateNotes = [...notes];
    const noteIndex = notes.findIndex(note => note.id === selectedNote);
    updateNotes[noteIndex] = {
      id: selectedNote,
      title: title,
      content: content
    };

    saveTolocalStorage('notes',updateNotes);
    setNotes(updateNotes);
    setEditing(false);
    setTitle('');
    setContent('');
  }

  const editNoteHandlar = () => {
    const note = notes.find(note => note.id === selectedNote);
    setEditing(true);
    setTitle(note.title);
    setContent(note.content);
  }

  const addNoteHandler = () => {
    setCreating(true);
    setEditing(false);
    setTitle('');
    setContent('');
  }

  const deleteNoteHandlar = () => {
    const updateNotes = [...notes];
    const noteIndex = updateNotes.findIndex(note => note.id === selectedNote);
    notes.splice(noteIndex, 1);

    saveTolocalStorage('notes',notes);
    setNotes(notes);
    setSelectedNote(null);
  }



  const getAddNote = () => {
    return (
      <NoteForm
        formTitle="إضافة ملاحظة جديدة"
        title={title}
        content={content}
        titleChanged={changeTitleHandler}
        contentChanged={changeContentHandler}
        submitClicked={saveNoteHandler}
        submitText="حفظ" />
    );
  };

  const getPreview = () => {
    if (notes.length === 0) {
      return <Message title='لا يوجد ملاحظات' />
    }

    if (!selectedNote) {
      return <Message title='الرجاء الختيار ملاحظة' />
    }

    const note = notes.find(note => {
      return note.id === selectedNote;
    })

    let noteDisplay = (
      <div>
        <h2>{note.title}</h2>
        <p> {note.content}</p>
      </div>
    )

    if (editing) {
      noteDisplay = (
        <NoteForm
          formTitle="تعديل ملاحظة"
          title={title}
          content={content}
          titleChanged={changeTitleHandler}
          contentChanged={changeContentHandler}
          submitClicked={updateNoteHandlar}
          submitText="تعديل" />
      )
    }


    return (
      <div>
        {!editing &&
          <div className="note-operations">
            <a href="#" onClick={editNoteHandlar}>
              <i className="fa fa-pencil-alt" />
            </a>
            <a href="#" onClick={deleteNoteHandlar}>
              <i className="fa fa-trash" />
            </a>
          </div>
        }
        {noteDisplay}
      </div>
    );
  };



  return (
    <div className="App">
      <Container>
        <NotesList>
          {notes.map(note =>
            <Note
              key={note.id}
              title={note.title}
              noteClicked={() => selectNoteHandler(note.id)}
              active={selectedNote === note.id}
            />
          )}
        </NotesList>
        <button className="add-btn" onClick={addNoteHandler}>+</button>
      </Container>
      <Preview>
        {creating ? getAddNote() : getPreview()}
      </Preview>
      {validationErrors.length !== 0 && <Alert validationMessages={validationErrors}/>}
    </div>
  );
}

export default App;
