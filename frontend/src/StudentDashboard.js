import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

function StudentDashboard() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [issuedBooks, setIssuedBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    fetchIssuedBooks();
  }, []);

  const fetchBooks = async (query = '') => {
    setError('');
    setActionMsg('');
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:4000/api/books';
      if (query) url += `?title=${encodeURIComponent(query)}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch books');
      setBooks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch issued books for the logged-in student
  const fetchIssuedBooks = async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/transactions/issued', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch issued books');
      setIssuedBooks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(search);
  };

  const handleIssue = async (bookId) => {
    setActionMsg('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/transactions/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Issue failed');
      setActionMsg('Book issued successfully!');
      fetchBooks(search);
      fetchIssuedBooks(); // Refresh issued books
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReturn = async (bookId) => {
    setActionMsg('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/transactions/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Return failed');
      setActionMsg('Book returned successfully!');
      fetchBooks(search);
      fetchIssuedBooks(); // Refresh issued books
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-main-layout">
      <div className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Student Dashboard</h2>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        <p>Welcome, Student! Here you can search, issue, and return books.</p>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search books by title"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {actionMsg && <p className="success-message">{actionMsg}</p>}
        <ul className="book-list">
          {books.map(book => (
            <li key={book._id} className="book-item">
              <span className="book-info">
                <strong>{book.title}</strong> by {book.author} (ISBN: {book.isbn})
                {book.available ? ' - Available' : ' - Not Available'}
              </span>
              <span className="book-actions">
                {book.available ? (
                  <button onClick={() => handleIssue(book._id)} className="issue-button">Issue</button>
                ) : (
                  <button onClick={() => handleReturn(book._id)} className="return-button">Return</button>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="issued-books-panel">
        <h3>Books You've Issued</h3>
        {issuedBooks.length === 0 ? (
          <p className="no-issued-books">No books issued yet.</p>
        ) : (
          <ul className="issued-books-list">
            {issuedBooks.map(book => (
              <li key={book._id} className="issued-book-item">
                <strong>{book.title}</strong> by {book.author} (ISBN: {book.isbn})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
