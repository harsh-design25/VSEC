const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 2, maxlength: 150 },
    author: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    isbn: { type: String, required: true, unique: true, match: /^(\d{10}|\d{13})$/ },
    category: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    totalCopies: { type: Number, required: true, min: 1, max: 1000 },
    availableCopies: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
