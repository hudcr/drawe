import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoom } from "../hooks/useRoom";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const [mode, setMode] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { createRoom, joinRoom } = useRoom();
  const { logOut } = useAuth();
  const nav = useNavigate();

  async function handleHost() {
    setError("");
    setLoading(true);
    try {
      const roomCode = await createRoom({ rounds: 3, drawTime: 60 });
      nav(`/lobby/${roomCode}`);
    } catch {
      setError("Failed to create room.");
      setLoading(false);
    }
  }

  async function handleJoin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await joinRoom(code);
      nav(`/lobby/${code.toUpperCase()}`);
    } catch (err) {
      setError(err.message || "Room not found.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
      <button
        onClick={async () => { await logOut(); nav("/login"); }}
        className="absolute top-4 right-4 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        Sign out
      </button>

      <div className="text-center">
        <h1 className="text-7xl font-black tracking-tighter bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
          DRAWE
        </h1>
        <p className="text-gray-400 mt-2">Draw. Guess. Win.</p>
      </div>

      <div className="flex flex-col gap-4 w-64">
        <button
          onClick={handleHost}
          disabled={loading}
          className="py-4 text-lg font-bold rounded-xl bg-pink-500 text-white hover:bg-pink-400 cursor-pointer disabled:opacity-60"
        >
          Host Room
        </button>

        {mode === "join" ? (
          <form onSubmit={handleJoin} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Room code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={5}
              autoFocus
              className="px-4 py-3 rounded-xl border-2 border-cyan-400 text-center text-lg font-bold tracking-widest focus:outline-none text-cyan-600 uppercase"
            />
            <button
              type="submit"
              disabled={loading || code.length < 5}
              className="py-3 font-bold rounded-xl border-2 border-cyan-400 text-cyan-500 hover:bg-cyan-50 cursor-pointer disabled:opacity-60"
            >
              Join
            </button>
          </form>
        ) : (
          <button
            onClick={() => setMode("join")}
            className="py-4 text-lg font-bold rounded-xl border-2 border-cyan-400 text-cyan-500 hover:bg-cyan-50 cursor-pointer"
          >
            Join Room
          </button>
        )}

        {error && <p className="text-pink-500 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
}
