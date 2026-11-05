# Classroom Progress Tracker

A real-time classroom progress tracking system featuring an instructor dashboard, student portal, real-time checkpoint monitoring, and direct messaging powered by WebSockets.

---

## Architecture Overview

- **Backend**: Node.js, Express 5, MongoDB Atlas (Mongoose), Socket.IO, JWT, bcrypt.
- **Frontend**: Single-Page App built with React 19, Vite, React Router 7, Chart.js, Socket.IO Client.
- **Unified Deployment**: Express serves the React production build (`frontend/app/dist`) as static files alongside `/api` routes and WebSocket handlers on a single port.

---

## Prerequisites

- **Node.js**: v20.x or higher
- **MongoDB Atlas**: Free Tier (M0) cluster or local MongoDB instance
- **npm**: v10+

---

## Environment Variables

Copy `.env.example` to `backend/.env` (or configure in your deployment dashboard):

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173,http://localhost:5000
```

> **Note:** Never commit real credentials or production secrets to Git.

---

## Local Development

### 1. Install Dependencies
From the repository root:
```bash
npm run build
```
*(Or install individually: `cd backend && npm install`, `cd ../frontend/app && npm install`)*

### 2. Run Locally

**Option A: Full Production Mode (Single Service)**
```bash
# Build frontend and start Express serving both API & UI on port 5000
npm run build
npm start
```
Visit: [http://localhost:5000](http://localhost:5000)

**Option B: Active Development Mode (Hot Reloading)**
1. **Terminal 1 - Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```
   Runs on `http://localhost:5000`.

2. **Terminal 2 - Frontend Vite Dev Server**:
   ```bash
   cd frontend/app
   npm run dev
   ```
   Runs on `http://localhost:5173` (proxies `/api` and `/socket.io` to `http://localhost:5000`).

---

## Deploy to Render (Free Web Service)

Render supports WebSockets and Node.js web services on its free tier.

### Method 1: Blueprint Deployment via `render.yaml`
1. Push your repository to GitHub.
2. In the Render Dashboard, click **New +** > **Blueprint**.
3. Connect your repository (`render.yaml` will be auto-detected).
4. Provide the required environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `CLIENT_URL`: Optional (defaults to same-origin).

### Method 2: Manual Web Service Setup
1. In Render Dashboard, click **New +** > **Web Service**.
2. Connect your Git repository.
3. Configure the service settings:
   - **Name**: `classroom-tracker`
   - **Environment**: `Node`
   - **Region**: Choose the closest region to your MongoDB Atlas cluster (e.g. `Oregon (US West)` or `Frankfurt (EU Central)`).
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
   - **Health Check Path**: `/api/health`
4. Add Environment Variables in the **Environment** tab:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` *(or leave default, Render sets PORT automatically)*
   - `MONGODB_URI`: `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority`
   - `JWT_SECRET`: *(Click 'Generate' or enter a secure 32+ character random string)*
   - `CLIENT_URL`: `https://your-service-name.onrender.com`

---

## API Endpoints

### System
- `GET /api/health` - Lightweight health check (for cold-start and uptime monitoring)

### Authentication
- `POST /api/auth/register` - Register a new account (`instructor` or `student`)
- `POST /api/auth/login` - Authenticate and return JWT token and role
- `GET /api/auth/me` - Get profile for currently authenticated user

### Sessions
- `GET /api/sessions` - List sessions
- `POST /api/sessions` - Create a session (Instructor)
- `GET /api/sessions/:id` - Fetch session details
- `POST /api/sessions/join` - Join session with 6-character code (Student)

### Checkpoints & Progress
- `GET /api/sessions/:sessionId/checkpoints` - List checkpoints for session
- `POST /api/sessions/:sessionId/checkpoints` - Add checkpoint (Instructor)
- `POST /api/progress` - Update checkpoint completion status (Student)
- `GET /api/progress/session/:sessionId` - Get session-wide progress statistics (Instructor)
- `GET /api/progress/session/:sessionId/my-progress` - Get student's personal progress

### Real-Time Chat & Sockets
- `POST /api/messages` - Send a message
- `GET /api/messages/session/:sessionId/user/:userId` - Fetch message history
- **Socket.IO Events**: `join_session`, `join_user`, `progress_updated`, `new_message`

---

## Project Structure

```
classroom-tracker/
├── package.json               # Root scripts (build, start)
├── render.yaml                # Render Blueprint deployment definition
├── .env.example               # Root environment variable template
├── backend/
│   ├── config/                # Mongoose database connection
│   ├── controllers/           # Auth, session, progress, checkpoint, message controllers
│   ├── middleware/            # JWT authentication & authorization
│   ├── models/                # User, Session, Checkpoint, Enrollment, Progress, Message
│   ├── routes/                # Express API routes
│   ├── server.js              # Express app + Socket.IO + static SPA handler + /api/health
│   └── package.json
└── frontend/
    └── app/                   # Unified React + Vite Single-Page Application
        ├── index.html
        ├── vite.config.js     # Dev server proxy configuration
        ├── package.json
        └── src/
            ├── components/    # Reusable UI (ChatBox, ProgressCharts, StudentList, etc.)
            ├── pages/         # Login, Instructor views, Student views
            └── services/      # Axios API, Socket.IO, Auth, and Session services
```

---

## License

MIT
