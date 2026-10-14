const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
	title: { type: String, required: true, trim: true },
	comments: [{ type: String, trim: true }],
	commentcount: { type: Number, default: 0 }
});

module.exports = mongoose.model('libraryModel', librarySchema);