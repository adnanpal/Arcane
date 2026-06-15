# 🔮 Arcane — Real-Time Chat Platform

Arcane is a modern, full-stack real-time chat application designed to bridge the gap between direct, private messaging and open, public rooms. Inspired by the best parts of Discord and WhatsApp, Arcane introduces a thoughtful **Connection Request** gating system. This ensures your private chat spaces remain intentional and secure, while also offering a public lounge for casual conversation.

Built with **React 19**, **Node.js**, **Express**, **Socket.io**, and **MongoDB**, Arcane features a sleek, high-fidelity responsive user interface styled with **Tailwind CSS v4** and customized with smooth CSS micro-animations.

---

## 🌟 Key Features

* **🔐 Secure Authentication**: Full user signup and login flow secured with JSON Web Tokens (JWT) and `bcrypt` password hashing.
* **🤝 Connection Request System**:
  * Private chats are gated. You can search for other registered users and send connection requests.
  * Real-time tracking of sent requests, pending incoming requests, and active connections.
  * Senders can cancel pending requests, and recipients can accept or reject them.
* **💬 Real-Time Messaging**: 
  * Instant direct messages between connected users.
  * Global public chat room accessible to everyone.
  * Automatic synchronization of 100-message chat history upon joining a room.
* **✨ Dynamic UI Enhancements**:
  * **Typing Indicators**: Visual feedback when a user is typing a message.
  * **Online Status**: Real-time listing of active users in the currently active chat room.
  * **System Messages**: System alerts when users join or leave a chat room.
* **🎨 Premium Aesthetics**: Modern layout using the **Sora** typeface, glassmorphic styling, custom slide/fade animations, and fully responsive design.

---

## 🛠️ Technology Stack

### Frontend
* **Core**: React 19, Vite (as build tool and dev server)
* **Routing**: React Router DOM (v7)
* **Styling**: Tailwind CSS (v4) with custom interactive utilities
* **Real-time**: Socket.io Client (v4)
* **State Management**: React Context API (`ChatContext`)
* **HTTP Client**: Axios

### Backend
* **Runtime & Framework**: Node.js, Express (v5)
* **Database**: MongoDB & Mongoose ODM
* **Real-time**: Socket.io Server (v4)
* **Security**: JSON Web Tokens (JWT), Bcrypt, CORS middleware
* **Environment**: Dotenv

---

## 📁 Directory Structure

```text
chatapp/
├── public/                 # Static assets (favicons, SVGs)
├── server/                 # Deprecated or fallback server templates (if any)
└── src/
    ├── api/                # API client helper configurations (auth, etc.)
    ├── assets/             # Images and design assets
    ├── components/         # Reusable React components
    │   ├── Avatar.jsx            # User avatar representations
    │   ├── ChatLoadingScreen.jsx # Loading screen with shimmer animations
    │   ├── IconButton.jsx        # Premium styled action buttons
    │   ├── Icons.jsx             # SVG icons pack
    │   ├── Login.jsx             # User Login card
    │   ├── MessageBubble.jsx     # Message styling (sent, received, system)
    │   ├── NavLink.jsx           # SideBar navigation links
    │   ├── OnlineUserRow.jsx     # Online roster rows
    │   ├── ProtectedRoute.jsx    # Auth route gatekeeper
    │   ├── PublicRoute.jsx       # Non-auth route gatekeeper
    │   ├── SideBar.jsx           # Unified sidebar layout
    │   ├── Signup.jsx            # User registration card
    │   └── TypingIndicator.jsx   # Dynamic blinking typing dots
    ├── context/            # Chat state provider
    │   └── ChatContext.jsx       # Handles socket instances, active messages, online users
    ├── server/             # Express server and socket controller
    │   ├── middlewares/          # Express authentication middleware
    │   ├── models/               # MongoDB models (User, Request, Message)
    │   ├── routes/               # API endpoints (Auth, User, Request)
    │   └── index.js              # Server entry point
    ├── views/              # Main view screens
    │   ├── ChatRoom.jsx          # Unified conversation view interface
    │   ├── JoinScreen.jsx        # Fallback/lobby routing screen
    │   └── RequestsPage.jsx      # Friendship connection request control panel
    ├── App.css             # Main styling rules
    ├── App.jsx             # App routing and global style configs
    ├── index.css           # Tailwind directives and core configurations
    └── main.jsx            # React client mount point
```

---

## ⚙️ Getting Started

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **MongoDB** (Local instance or Atlas cloud database URI)

### 1. Installation
Clone the repository and install the dependencies from the `chatapp` directory:
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root of the `chatapp` folder:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/chatapp
JWT_SECRET=your_super_secure_jwt_secret_key
```

### 3. Run the Server (Backend)
Start the Express server on port `5000` (or your configured `PORT`):
```bash
npm run server
```

### 4. Run the Client (Frontend)
In a separate terminal, launch the Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔗 Backend API Reference

### Authentication Routes (`/api/auth`)
* `POST /api/auth/signup` — Register a new account.
* `POST /api/auth/login` — Log in to an account (returns JWT).

### User Routes (`/api/user`)
* `GET /api/user/search?q=query` — Search for users by username (gated, excludes self).
* `GET /api/user/connections` — Fetch current user's accepted connections list.

### Request Routes (`/api/request`)
* `POST /api/request/send` — Send connection request to another user.
* `POST /api/request/respond` — Accept or reject an incoming request (`action: "accepted" | "rejected"`).
* `POST /api/request/cancel` — Cancel a pending outgoing request.
* `GET /api/request/me` — Fetch all incoming pending and sent outgoing requests.

### Message Routes (`/messages`)
* `GET /messages/:room` — Retrieve up to the latest 100 messages for a given room.
* `DELETE /messages/:room` — Clear chat history for a given room.

---

## ⚡ Real-Time Socket Events

Arcane relies on WebSockets via `socket.io` for instantaneous interactions:

| Event Name | Sent By | Description | Payload |
| :--- | :--- | :--- | :--- |
| `join` | Client | Emitted when joining a chat room | `{ username, room }` |
| `message_history` | Server | Sends the last 100 messages of a room to the client | `Array of Message Objects` |
| `send_message` | Client | Emitted when sending a message | `{ text, room }` |
| `receive_message` | Server | Broadcasts a new message to all users in the room | `{ _id, username, text, room, timestamp }` |
| `typing` | Client | Emitted when a user starts/stops typing | `{ room, isTyping }` |
| `user_typing` | Server | Broadcasts typing status to other users in the room | `{ username, isTyping }` |
| `online_users` | Server | Broadcasts a list of online users in the room | `Array of Usernames` |
| `system_message` | Server | Broadcasts system join/leave notices | `{ text, timestamp }` |

---

## 📝 License
This project is licensed under the MIT License. Feel free to use and adapt it!
