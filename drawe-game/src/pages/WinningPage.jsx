import { useNavigate, useParams } from "react-router-dom";
import { useGameContext } from "../context/GameContext";
import { useAuthUser } from "../context/AuthContext";
import { useRoom } from "../hooks/useRoom";
import { useAuth } from "../hooks/useAuth";

const medals = ["🥇", "🥈", "🥉"];

export default function WinningPage() {
  const { code } = useParams();
  const { room, players } = useGameContext();
  const user = useAuthUser();
  const { createRoom } = useRoom();
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  async function handlePlayAgain() {
    try {
      const newCode = await createRoom(room?.settings);
      navigate(`/lobby/${newCode}`);
    } catch (e) {
      // not much we can do here, just log it
      console.error(e);
    }
  }

  if (!room || players.length === 0) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-8">
      <button
        onClick={async () => { await logOut(); navigate("/login"); }}
        className="absolute top-4 right-4 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        Sign out
      </button>

      <div className="text-center">
        <p className="text-4xl mb-1">🏆</p>
        <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
          {winner?.displayName} wins!
        </h1>
        <p className="text-gray-400 mt-2 text-sm">Final Scores</p>
      </div>

      <div className="flex flex-col gap-2 w-72">
        {sorted.map((p, i) => (
          <div
            key={p.uid}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
              p.uid === user?.uid
                ? "border-2 border-cyan-400 bg-cyan-50"
                : "border border-gray-100 bg-gray-50"
            }`}
          >
            <span className="text-lg w-6 text-center">{medals[i] ?? i + 1}</span>
            <span className="font-semibold text-gray-700 flex-1">{p.displayName}</span>
            <span className="font-black text-gray-800 tabular-nums">{p.score}pts</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 w-72">
        <button
          onClick={handlePlayAgain}
          className="py-3 font-bold rounded-xl bg-pink-500 text-white hover:bg-pink-400 cursor-pointer"
        >
          Play Again
        </button>
        <button
          onClick={() => navigate("/")}
          className="py-3 font-bold rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
