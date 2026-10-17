const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, match: /^[6-9]\d{9}$/ },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Member', memberSchema);
