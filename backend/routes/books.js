const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const Book = require('../models/Book');
const router = express.Router();

// Add book (admin)
router.post('/', authenticate, requireAdmin, async (req, res) => {
    const { title, author, isbn } = req.body;
    if (!title || !author || !isbn) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const existing = await Book.findOne({ isbn });
        if (existing) return res.status(400).json({ message: 'Book with this ISBN already exists' });
        const book = new Book({ title, author, isbn });
        await book.save();
        res.status(201).json({ message: 'Book added', book });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete book (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// List books with search and filtering (open to all authenticated users)
router.get('/', authenticate, async (req, res) => {
    try {
        const { title, author, isbn, available } = req.query;
        let filter = {};
        if (title) filter.title = { $regex: title, $options: 'i' };
        if (author) filter.author = { $regex: author, $options: 'i' };
        if (isbn) filter.isbn = isbn;
        if (available !== undefined) filter.available = available === 'true';
        const books = await Book.find(filter);
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
