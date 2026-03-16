import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { AuthProvider, useAuthUser } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import LobbyPage from "./pages/LobbyPage";
import GameSettingsPage from "./pages/GameSettingsPage";
import DrawPage from "./pages/DrawPage";
import VotingPage from "./pages/VotingPage";
import WinningPage from "./pages/WinningPage";

function ProtectedRoute({ children }) {
  const user = useAuthUser();
  if (user === undefined) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function GameRoute({ children }) {
  const { code } = useParams();
  return <GameProvider roomCode={code}>{children}</GameProvider>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/"
            element={<ProtectedRoute><HomePage /></ProtectedRoute>}
          />
          <Route
            path="/lobby/:code"
            element={<ProtectedRoute><GameRoute><LobbyPage /></GameRoute></ProtectedRoute>}
          />
          <Route
            path="/lobby/:code/settings"
            element={<ProtectedRoute><GameRoute><GameSettingsPage /></GameRoute></ProtectedRoute>}
          />
          <Route
            path="/draw/:code"
            element={<ProtectedRoute><GameRoute><DrawPage /></GameRoute></ProtectedRoute>}
          />
          <Route
            path="/vote/:code"
            element={<ProtectedRoute><GameRoute><VotingPage /></GameRoute></ProtectedRoute>}
          />
          <Route
            path="/results/:code"
            element={<ProtectedRoute><GameRoute><WinningPage /></GameRoute></ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
