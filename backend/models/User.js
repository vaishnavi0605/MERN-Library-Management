const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], required: true },
    issuedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
