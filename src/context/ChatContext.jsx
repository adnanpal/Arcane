import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const ChatContext = createContext();

const SERVER_URL = "http://localhost:5000";

export const ChatProvider = ({ children }) => {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("general");
    const [joined, setJoined] = useState(false);

    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUser, setTypingUser] = useState("");

    const socketRef = useRef(null);

    // Initialize socket connection
    useEffect(() => {
        const socket = io(SERVER_URL, { transports: ["websocket"] });
        socketRef.current = socket;

        socket.on("message_history", (history) => {
            setMessages(history.map(m => ({ ...m, type: "chat" })));
        });

        socket.on("receive_message", (msg) => {
            setMessages((prev) => [...prev, { ...msg, type: "chat" }]);
        });

        socket.on("system_message", (msg) => {
            setMessages((prev) => [...prev, { ...msg, type: "system", id: Date.now() }]);
        });

        socket.on("online_users", (users) => {
            setOnlineUsers(users);
        });

        socket.on("user_typing", ({ username: who, isTyping }) => {
            setTypingUser(isTyping ? who : "");
        });

        return () => socket.disconnect();
    }, []);

    // Actions
    const joinRoom = (name, roomName) => {
        setUsername(name);
        setRoom(roomName);
        socketRef.current.emit("join", { username: name, room: roomName });
        setJoined(true);
    };

    const sendMessage = (text) => {
        if (text.trim() && socketRef.current) {
            socketRef.current.emit("send_message", { text, room });
            // Immediately stop typing indicator on send
            sendTypingStatus(false);
        }
    };

    const sendTypingStatus = (isTyping) => {
        socketRef.current.emit("typing", { room, isTyping });
    };

    const value = {
        username,
        room,
        joined,
        messages,
        onlineUsers,
        typingUser,
        joinRoom,
        sendMessage,
        sendTypingStatus,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Custom hook for easy access
// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};