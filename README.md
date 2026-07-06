# 🚀 DevCircle Backend

> A production-ready backend for **DevCircle**, a developer social networking platform built using Node.js, Express.js, MongoDB, Redis, Socket.io, and JWT Authentication.

## 🔗 Repository

**Frontend Repository:**
https://github.com/Manish-dev3490/devCircle-Web

---

## 📖 About

DevCircle Backend powers the complete developer networking platform by providing secure authentication, real-time communication, connection management, profile management, and scalable REST APIs.

The backend follows a modular architecture with separate routes, controllers, middleware, helpers, configuration files, and database models for better maintainability and scalability.

---

# 🎯 Key Highlights

* 🔐 JWT Authentication using HTTP-only Cookies
* 🚀 Stateless Authentication
* 🛡 Token Blacklisting using Redis
* ⚡ Redis-based Rate Limiting
* 💬 Real-Time Chat using Socket.io
* 🤝 Developer Connection Request System
* 👤 Profile View & Edit APIs
* 🌍 Developer Feed APIs
* ☁️ MongoDB Atlas Cloud Database
* 🚀 Production Deployment on Render

---

# ✨ Features

## 🔐 Authentication

* User Signup
* User Login
* Secure Logout
* JWT Authentication
* HTTP-only Cookie Authentication
* Protected Routes
* Persistent User Session

---

## 🛡 Security

* JWT Authentication
* HTTP-only Cookies
* Token Blacklisting
* Redis Integration
* Rate Limiting
* Protected APIs
* Password Hashing using bcrypt
* Input Validation

---

## 👤 Profile APIs

* View Profile
* Edit Profile
* Update User Information

---

## 🤝 Connection System

* Send Connection Request
* Accept Request
* Reject Request
* View Pending Requests
* View Connections

---

## 🌍 Feed APIs

* Fetch Developer Feed
* Exclude Existing Connections
* Dynamic User Discovery

---

## 💬 Real-Time Chat

* One-to-One Chat
* Socket.io Integration
* Real-Time Message Delivery

---

# 🛠 Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Redis Cloud
* Socket.io
* JWT
* bcrypt
* Cookie Parser
* CORS
* dotenv

---

# ☁️ Deployment

| Service  | Platform      |
| -------- | ------------- |
| Backend  | Render        |
| Database | MongoDB Atlas |
| Cache    | Redis Cloud   |

---

# 🏗 Architecture

```text
React Frontend
        │
        ▼
REST APIs (Axios)
        │
        ▼
Express.js Server
        │
 ┌──────┼──────────────┐
 ▼      ▼              ▼
MongoDB Redis      Socket.io
        │
        ▼
JWT Authentication
```

---

# 📁 Folder Structure

```text
src
│
├── config
├── helper
├── middlewares
├── models
├── routes
├── utils
├── validations
└── app.js
```

---

# 🔄 Authentication Flow

1. User signs up or logs in.
2. Server validates user credentials.
3. JWT token is generated.
4. Token is stored in an HTTP-only Cookie.
5. Every protected request is authenticated using the JWT.
6. On logout, the JWT is blacklisted using Redis.
7. Any blacklisted token is rejected even if it has not expired.

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/Manish-dev3490/devCircle-backend.git
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

Run in production

```bash
npm start
```

---

# 🔑 Environment Variables

Create a `.env` file and configure:

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

REDIS_URL=your_redis_connection_string

CLIENT_URL=http://localhost:5173

GEMINI_API_KEY=your_api_key
```

---

# 📌 Main API Endpoints

## Authentication

* POST `/signup`
* POST `/login`
* POST `/logout`

## Profile

* GET `/profile/view`
* PATCH `/profile/edit`

## Connections

* POST `/request/send/:status/:userId`
* POST `/request/review/:status/:requestId`
* GET `/user/connections`
* GET `/user/request/received`

## Feed

* GET `/feed`

## Chat

* GET `/chat/:targetUserId`

---

# 🚀 Future Improvements

* 🤖 AI-powered Developer Assistant
* 📹 WebRTC Video Calling
* 🔔 Push Notifications
* 📎 Media Sharing
* 🔍 Advanced Search
* 📈 Analytics Dashboard
* ♾ Infinite Scrolling
* 📱 Mobile Application Support

---

# 👨‍💻 Author

**Manish Kumar**

GitHub:
https://github.com/Manish-dev3490

LinkedIn:
https://linkedin.com/in/manish-kumar-8870b4287

---

⭐ If you found this project helpful, consider giving it a Star.
