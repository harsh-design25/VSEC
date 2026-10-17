# Library Management System (MERN)

React (Vite) + Node/Express + MongoDB (Mongoose).

## Features
- Books: add / edit / delete / search
- Members: add / edit / delete
- Issue & return books (14-day loan, max 3 books per member, Rs.5/day fine when late)
- Validation on BOTH client (React) and server (express-validator + Mongoose schema)

## Run
Prerequisite: Node.js 18+ and MongoDB running locally (or a MongoDB Atlas URI).

Terminal 1 - backend:
    cd backend
    npm install
    cp .env.example .env        # edit MONGO_URI if needed
    npm run dev

Terminal 2 - frontend:
    cd frontend
    npm install
    npm run dev

Open http://localhost:5173

## Validation rules
- Title 2-150 chars; Author letters/spaces only; ISBN 10 or 13 digits (unique)
- Category 2-50 chars; Copies whole number 1-1000
- Member name letters only; valid email (unique); 10-digit Indian mobile (starts 6-9)
- Cannot issue if no copies left, member has 3 books, or already has that book
- Cannot delete a book/member that has unreturned issues
- Cannot reduce total copies below the number currently issued

## API
GET/POST /api/books, PUT/DELETE /api/books/:id
GET/POST /api/members, PUT/DELETE /api/members/:id
GET /api/transactions, POST /api/transactions/issue, POST /api/transactions/return/:id
