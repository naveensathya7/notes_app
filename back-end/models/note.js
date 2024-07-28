const mongoose=require('mongoose')
const noteSchema = new mongoose.Schema({
    notes_text: String,
    dateCreated: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('notes', noteSchema);