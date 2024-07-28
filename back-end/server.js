const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const cors=require('cors')
const Note=require('./models/note')
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

require('dotenv').config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Define a Mongoose schema and model


// Get all notes
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new note
app.post('/api/notes', async (req, res) => {
  const { notes_text } = req.body;
  try {
    const newNote = new Note({
      notes_text,
      dateCreated: new Date()
    });

    await newNote.save();
    res.json({ message: 'Note created', note: newNote });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a note
app.delete('/api/notes/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const isValidId = mongoose.Types.ObjectId.isValid(id);
      if (!isValidId) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
  
      const deletedNote = await Note.findByIdAndDelete(id);
      if (!deletedNote) {
        return res.status(404).json({ message: 'Note not found' });
      }
  
      res.json({ message: 'Note deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
