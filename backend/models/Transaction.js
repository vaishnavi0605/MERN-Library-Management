const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    issueDate: { type: Date, default: Date.now },
    returnDate: { type: Date },
    status: { type: String, enum: ['issued', 'returned'], default: 'issued' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
