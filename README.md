# MERN Library Management System

A full-stack Library Management System built with the MERN stack (MongoDB, Express, React, Node.js). Supports student and admin logins, book management, issuing/returning books, and role-based dashboards.

## Features

- **Authentication:** JWT-based login and registration for students and admins
- **Role-based Access:**
  - Admins: Add/delete books
  - Students: Issue/return books
- **Book Management:**
  - Add, delete, search, and filter books
- **Dashboards:**
  - **Admin Dashboard:** Manage books
  - **Student Dashboard:** Search, issue, return books, and view issued books
- **Modern UI:** Responsive, clean React frontend

## Folder Structure

```
MERN Library Management System/
├── backend/
│   ├── models/           # Mongoose models (User, Book, Transaction)
│   ├── routes/           # Express routes (auth, books, transactions)
│   ├── middleware/       # Auth middleware
│   ├── .env              # Environment variables
│   └── server.js         # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── AdminDashboard.js
│   │   ├── StudentDashboard.js
│   │   ├── *.css
│   └── package.json
└── README.md
```

## Setup & Execution

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### 1. Clone the repository
```sh
git clone <repo-url>
cd "MERN Library Management System"
```

### 2. Backend Setup
```sh
cd backend
npm install
```

Create a `.env` file in `backend/`:
```
MONGODB_URI=mongodb://localhost:27017/librarydb
PORT=4000
JWT_SECRET=your_jwt_secret
```

Start the backend server:
```sh
npm start
```

### 3. Frontend Setup
```sh
cd ../frontend
npm install
```

Start the React app:
```sh
npm start
```

The React app runs on [http://localhost:3000](http://localhost:3000) and proxies API requests to the backend.

## Usage

- **Register:** Click "Register" on the login page to create a new student or admin account.
- **Login:** Use your credentials to log in. Redirects to the appropriate dashboard based on your role.
- **Admin Dashboard:**
  - Add new books
  - Delete books
- **Student Dashboard:**
  - Search and filter books
  - Issue or return books
  - View list of books you have issued (right panel)
- **Logout:** Available on both dashboards

## API Endpoints (Main)
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `GET /api/books` — List/search books
- `POST /api/books` — Add book (admin)
- `DELETE /api/books/:id` — Delete book (admin)
- `POST /api/transactions/issue` — Issue book (student)
- `POST /api/transactions/return` — Return book (student)
- `GET /api/transactions/issued` — List books issued by logged-in student

## Notes
- All protected routes require a valid JWT token in the `Authorization` header.
- Admin and student roles are enforced via middleware.
- The UI is responsive and works on desktop and mobile.

## Screenshots
_Add screenshots of the login, admin dashboard, and student dashboard here._

---

**Developed with ❤️ using the MERN stack.**
