# Classroom Progress Tracker

A real-time classroom progress tracking system with instructor dashboard and student portal.

## Features

- 👨‍🏫 **Instructor Dashboard**
  - Create and manage sessions
  - Add custom checkpoints
  - Real-time progress monitoring
  - Interactive statistics (bar charts)
  - Private chat with students

- 👨‍🎓 **Student Portal**
  - Join sessions with code
  - View and complete checkpoints
  - Track personal progress
  - Chat with instructor

- ⚡ **Real-Time Updates**
  - Live progress statistics
  - Instant chat messaging
  - WebSocket-based communication

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.IO
- JWT Authentication
- bcrypt

### Frontend
- React (Vite)
- React Router
- Axios
- Socket.IO Client
- Chart.js
- React-Chartjs-2

## Prerequisites

- Node.js (v20.x or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/ban-niranjan/classroom-tracker.git
cd classroom-tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### 3. Instructor Dashboard Setup
```bash
cd ../frontend/instructor-dashboard
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Student Portal Setup
```bash
cd ../student-portal
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Running the Application

You need to run 3 terminals simultaneously:

### Terminal 1: Backend
```bash
cd backend
npm run dev
```
Server runs on: http://localhost:5000

### Terminal 2: Instructor Dashboard
```bash
cd frontend/instructor-dashboard
npm run dev
```
Runs on: http://localhost:5173

### Terminal 3: Student Portal
```bash
cd frontend/student-portal
npm run dev
```
Runs on: http://localhost:5174

## Usage

1. **Instructor**: Register at http://localhost:5173
2. **Create Session**: Add session name and description
3. **Add Checkpoints**: Create milestones for students
4. **Get Session Code**: Note the generated code
5. **Student**: Register at http://localhost:5174
6. **Join Session**: Enter the session code
7. **Complete Checkpoints**: Mark tasks as complete
8. **Watch Real-Time Updates**: Instructor dashboard updates instantly!

## Project Structure
```
classroom-tracker/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── instructor-dashboard/
│   │   └── src/
│   │       ├── components/
│   │       ├── pages/
│   │       └── services/
│   └── student-portal/
│       └── src/
│           ├── components/
│           ├── pages/
│           └── services/
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Sessions
- `GET /api/sessions` - Get all sessions
- `POST /api/sessions` - Create session (instructor)
- `POST /api/sessions/join` - Join session (student)
- `GET /api/sessions/:id` - Get session details

### Checkpoints
- `GET /api/sessions/:id/checkpoints` - Get checkpoints
- `POST /api/sessions/:id/checkpoints` - Add checkpoint
- `PUT /api/checkpoints/:id` - Update checkpoint
- `DELETE /api/checkpoints/:id` - Delete checkpoint

### Progress
- `POST /api/progress` - Update progress
- `GET /api/progress/session/:id` - Get session progress

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/session/:id/user/:userId` - Get chat history

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

## License

MIT


## Acknowledgments

- Built as a learning project
- Uses Chart.js for beautiful visualizations
- Real-time powered by Socket.IO