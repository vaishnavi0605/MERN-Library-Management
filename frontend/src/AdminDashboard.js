import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/books', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch books');
      setBooks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, author, isbn })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add book');
      setSuccess('Book added successfully!');
      setTitle(''); setAuthor(''); setIsbn('');
      fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteBook = async (id) => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete book');
      setSuccess('Book deleted successfully!');
      fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="admin-dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      <p>Welcome, Admin! Here you can manage books.</p>
      <form className="add-book-form" onSubmit={handleAddBook}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} required />
        <input type="text" placeholder="ISBN" value={isbn} onChange={e => setIsbn(e.target.value)} required />
        <button type="submit">Add Book</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <ul className="admin-book-list">
        {books.map(book => (
          <li key={book._id} className="admin-book-item">
            <div className="admin-book-info-actions">
              <span><strong>{book.title}</strong> by {book.author} (ISBN: {book.isbn})</span>
              <button className="delete-book-btn" onClick={() => handleDeleteBook(book._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
