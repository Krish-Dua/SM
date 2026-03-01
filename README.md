# 🌐 CONNECTICX

<p align="center">
  <b>A modern MERN social platform with real-time chat, live notifications, and media posts/reels.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Realtime-Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
  <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

## 🏷️ Title
**CONNECTICX - Real-Time Social Media Platform**

## 📖 Overview
CONNECTICX is a full-stack social media app where users can sign up, publish posts/reels, interact via likes/comments/follows, get instant notifications, and chat in real time.

This project combines a React + Vite frontend with an Express + MongoDB backend and Socket.IO event channels for live updates.

## ✨ Features
- 🔐 Authentication with JWT stored in secure HTTP-only cookies
- 👤 User profile management (name, bio, username, avatar)
- 🖼️ Media upload support using Cloudinary (images/videos)
- 📝 Create and manage posts + reels
- ❤️ Like / unlike posts
- 💬 Comment system with fetch + delete support
- 🔔 Real-time notifications for follow, like, and comment events
- 👥 Follow / unfollow users
- 🔎 User search + profile discovery suggestions
- 🔖 Save / unsave posts
- 🧭 Home feed, explore feed, reels feed (randomized sampling)
- 💬 Real-time 1-to-1 chat (messages, unread counters, typing indicators)
- 🟢 Online user presence updates through Socket.IO rooms
- 📱 Responsive UI for desktop and mobile layouts

## 🧱 Tech Stack
### Frontend
- React 19
- Vite 6
- Tailwind CSS v4
- Zustand (state management)
- React Router v7
- Axios + Fetch
- React Toastify
- Radix UI + Vaul components
- Socket.IO Client

### Backend
- Node.js + Express 4
- MongoDB + Mongoose
- Socket.IO
- JWT + cookie-parser
- bcryptjs
- multer (in-memory uploads)
- Cloudinary
- helmet
- express-rate-limit

## 🏗️ Architecture Snapshot
- `frontend/` -> React SPA (routes/pages/components/stores)
- `backend/` -> REST APIs, auth, posts, notifications, chat, Socket.IO server
- `backend/chat-service/` -> conversation/message models + chat APIs + socket events
- Production mode serves `frontend/dist` from Express

## ⚙️ Setup
### 1. Clone and move into project
```bash
git clone <your-repo-url>
cd SM
```

### 2. Install dependencies
```bash
npm install
npm install --prefix frontend
```

### 3. Create `.env` in project root
Use values that match your services:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Run in development
Backend:
```bash
npm run dev
```

Frontend (new terminal):
```bash
npm run dev --prefix frontend
```

Frontend dev server runs on Vite and proxies `/api` + `/socket.io` to backend (`http://localhost:3000`).

### 5. Production build + run
```bash
npm run build
npm start
```

## 🔗 Live Link
- 🌍 Live App: `https://connecticx.onrender.com`

## 🧪 Core API Groups
- `/api/user/*` -> auth, profile, follow/unfollow, suggestions, save
- `/api/post/*` -> create posts/reels, feed, explore, comments, likes, saved posts
- `/api/notifications` -> list notifications
- `/api/notification/mark-all-read` -> mark notifications read
- `/api/chat/*` -> conversations, messages, read receipts

## 📌 Summary
- Demonstrates full-stack ownership (frontend, backend, DB, deployment-ready serving)
- Implements real-time product behavior (chat + notifications + online status)
- Includes security basics (JWT auth, rate limiting, helmet)
- Uses scalable patterns (modular routes/controllers/models + socket rooms)

## 👨‍💻 Author
Built with passion for social product engineering and real-time web experiences 🚀
