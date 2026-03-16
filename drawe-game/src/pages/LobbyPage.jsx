import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGameContext } from "../context/GameContext";
import { useAuthUser } from "../context/AuthContext";
import { useGame } from "../hooks/useGame";
import { useAuth } from "../hooks/useAuth";
import PlayerList from "../components/PlayerList";
import InviteCode from "../components/InviteCode";

export default function LobbyPage() {
  const { code } = useParams();
  const { room, players } = useGameContext();
  const { startGame } = useGame();
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const user = useAuthUser();

  const isHost = room?.hostId === user?.uid;

  useEffect(() => {
    if (!room) return;
    if (room.status === "drawing") navigate(`/draw/${code}`, { replace: true });
    if (room.status === "voting") navigate(`/vote/${code}`, { replace: true });
    if (room.status === "results") navigate(`/results/${code}`, { replace: true });
  }, [room?.status]);

  async function handleStart() {
    try {
      await startGame(code);
    } catch (e) {
      alert("Failed to start game");
      console.error(e);
    }
  }

  if (!room) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-8">
      <button
        onClick={async () => { await logOut(); navigate("/login"); }}
        className="absolute top-4 right-4 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        Sign out
      </button>

      <div className="text-center">
        <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
          DRAWE
        </h1>
        <p className="text-gray-400 mt-1 text-sm">Waiting for players...</p>
      </div>

      <InviteCode code={code} />

      <div className="w-72">
        <PlayerList players={players} currentUid={user?.uid} />
      </div>

      {isHost ? (
        <div className="flex flex-col gap-3 w-72">
          <button
            onClick={handleStart}
            disabled={players.length < 2}
            className="py-3 font-bold rounded-xl bg-pink-500 text-white hover:bg-pink-400 cursor-pointer disabled:opacity-60"
          >
            {players.length < 2 ? "Need 2+ players" : "Start Game"}
          </button>
          <button
            onClick={() => navigate(`/lobby/${code}/settings`)}
            className="py-3 text-sm font-bold rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer"
          >
            Settings
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-400">Waiting for host to start...</p>
      )}
    </div>
  );
}
