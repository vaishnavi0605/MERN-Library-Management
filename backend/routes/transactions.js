const express = require('express');
const { authenticate, requireStudent } = require('../middleware/authMiddleware');
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const router = express.Router();

// Issue book (student)
router.post('/issue', authenticate, requireStudent, async (req, res) => {
    const { bookId } = req.body;
    if (!bookId) return res.status(400).json({ message: 'Book ID is required' });
    try {
        const book = await Book.findById(bookId);
        if (!book || !book.available) return res.status(400).json({ message: 'Book not available' });
        // Mark book as unavailable
        book.available = false;
        await book.save();
        // Add to user's issuedBooks
        await User.findByIdAndUpdate(req.user._id, { $push: { issuedBooks: book._id } });
        // Create transaction
        const transaction = new Transaction({ user: req.user._id, book: book._id });
        await transaction.save();
        res.json({ message: 'Book issued', transaction });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Return book (student)
router.post('/return', authenticate, requireStudent, async (req, res) => {
    const { bookId } = req.body;
    if (!bookId) return res.status(400).json({ message: 'Book ID is required' });
    try {
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        // Mark book as available
        book.available = true;
        await book.save();
        // Remove from user's issuedBooks
        await User.findByIdAndUpdate(req.user._id, { $pull: { issuedBooks: book._id } });
        // Update transaction
        const transaction = await Transaction.findOneAndUpdate(
            { user: req.user._id, book: book._id, status: 'issued' },
            { status: 'returned', returnDate: new Date() },
            { new: true }
        );
        if (!transaction) return res.status(404).json({ message: 'No active issue transaction found' });
        res.json({ message: 'Book returned', transaction });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all books currently issued by the logged-in student
router.get('/issued', authenticate, requireStudent, async (req, res) => {
    try {
        // Populate issuedBooks with book details
        const user = await User.findById(req.user._id).populate('issuedBooks');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.issuedBooks);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
