/* global process */
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "../routes/auth.js"
import userRoutes from "../routes/user.js"; 
import dotenv from "dotenv";
import requestRoutes from "../routes/request.js";

dotenv.config();


// ─── CONFIG ──────────────────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],

  },

});

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/request", requestRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo db Connected"))
  .catch(() => console.error("MongoDB not connetion error"));

//---schema

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  text: { type: String, required: true },
  room: { type: String, required: true, default: "public" },
  timestamp: { type: Date, default: Date.now },

});

const Message = mongoose.model("Message", messageSchema);

//--endpoints

app.get("/messages/:room", async (req, res) => {
  try {
    const message = await Message.find({ room: req.params.room })
      .sort({ timestamp: 1 })
      .limit(100)
    res.json(message);
  } catch {
    res.status(500).json({ error: "Failed to fetch messages" })
  }
});

//--delete
app.delete("/messages/:room", async (req, res) => {
  try {
    await Message.deleteMany({ room: req.params.room });
    res.json({ message: "Messages Cleared" });


  } catch {
    res.status(500).json({ error: "Failed to delete messages" });
  }
});

//socket logic

const onlineUsers = {};

io.on("connection", (socket) => {
  console.log(`New Connection:${socket.id}`);

  socket.on("join", async ({ username, room }) => {
    socket.join(room);
    onlineUsers[socket.id] = { username, room };

    console.log(`👤 ${username} joined room: ${room}`);

    //message history for new user

    try {

      const messages = await Message.find({ room })
        .sort({ timestamp: 1 })
        .limit(100);

      const history = messages.map(m => ({
        _id: m._id,
        username: m.sender,
        text: m.text,
        room: m.room,
        timestamp: m.timestamp
      }));

      socket.emit("message_history", history);


    } catch (err) {
      console.error("Error fetching history", err);
    }

    //notify to other
    socket.to(room).emit("system_message", {
      text: `${username}  joined the chat`,
      timestamp: new Date(),
    });

    broadcastUserList(room);
  });

  //handle incoming messages
  socket.on("send_message", async ({ text, room }) => {
    const user = onlineUsers[socket.id];
    if (!user) return;

    try {
      const message = await Message.create({
        sender: user.username,
        text,
        room,
        timestamp: new Date(),
      });

      //emit to everyone in room
      io.to(room).emit("receive_message", {
        _id: message._id,
        username: message.sender,
        text: message.text,
        room: message.room,
        timestamp: message.timestamp,
      });
      console.log(`💬 [${room}] ${user.username}: ${text}`);
    } catch (err) {
      console.error("Error saving message:", err);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  //handle typing
  socket.on("typing", ({ room, isTyping }) => {
    const user = onlineUsers[socket.id];
    if (!user) return;
    socket.to(room).emit("user_typing", { username: user.username, isTyping });
  });

  socket.on("disconnect", () => {
    const user = onlineUsers[socket.id];
    if (user) {
      const { username, room } = user;
      console.log(`🔴 ${username} disconnected`);

      socket.to(room).emit("system_message", {
        text: `${username} left the chat`,
        timestamp: new Date(),
      });

      delete onlineUsers[socket.id];
      broadcastUserList(room);
    }
  });
});

//broadcast user list
function broadcastUserList(room) {
  const users = Object.values(onlineUsers)
    .filter((u) => u.room === room)
    .map((u) => u.username);
  io.to(room).emit("online_users", users);
}

//start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`,mongoose.connection.name);
});
