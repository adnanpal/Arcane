import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JoinScreen from "./views/JoinScreen";
import ChatRoom from "./views/ChatRoom";
import { ChatProvider } from "./context/ChatContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Loading from "./components/ChatLoadingScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <ChatProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          <Route path="/loading" element={<Loading />} />

          {/* 🔐 Protected Route */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatRoom />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<JoinScreen />} />
        </Routes>

        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');
        body { font-family: 'Sora', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .typing-dot { animation: blink 1.2s infinite ease-in-out; }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
      </Router>
    </ChatProvider>
  );
}

export default App;
