# Collaborative Code IDE

A real-time collaborative coding platform where multiple users can join coding rooms, write code together, chat, and execute programs seamlessly.

Inspired by:
- VS Code
- Google Docs
- Replit

---

## Features

- Real-time collaborative code editing
- Multi-user room system
- Live synchronization using WebSockets
- Code editor with syntax highlighting
- Multiple programming language support
- Code execution support
- Real-time chat system
- User presence indicators
- Dark/Light theme support
- Secure room-based collaboration

---

# Tech Stack

## Frontend
- React.js
- Monaco Editor
- Tailwind CSS
- Socket.IO Client

## Backend
- Node.js
- Express.js
- Socket.IO

## Database
- MongoDB

## Code Execution
- Judge0 API

## Collaboration Engine
- Yjs

---

# Project Structure

Collaborative-IDE/
│
├── client/                 # Frontend React Application
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                 # Backend Node.js Server
│   ├── controllers/
│   ├── routes/
│   ├── sockets/
│   ├── models/
│   └── package.json
│
├── README.md
└── .gitignore

---

# Installation

## Clone the Repository

```bash
git clone https://github.com/your-username/collaborative-ide.git
cd collaborative-ide
