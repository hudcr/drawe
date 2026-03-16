import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGameContext } from "../context/GameContext";
import { useAuthUser } from "../context/AuthContext";
import { useGame } from "../hooks/useGame";
import DrawingShowcase from "../components/DrawingShowcase";
import RatingStars from "../components/RatingStars";
import { useAuth } from "../hooks/useAuth";

export default function VotingPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const user = useAuthUser();
  const { room, drawings } = useGameContext();
  const { submitVotes } = useGame();
  const { logOut } = useAuth();

  const [submitted, setSubmitted] = useState(false);
  const [ratings, setRatings] = useState({});

  const otherDrawings = drawings.filter((d) => d.uid !== user?.uid);
  const allRated = otherDrawings.length > 0 && otherDrawings.every((d) => ratings[d.uid] > 0);

  useEffect(() => {
    if (!room) return;
    if (room.status === "drawing") navigate(`/draw/${code}`, { replace: true });
    if (room.status === "results") navigate(`/results/${code}`, { replace: true });
    if (room.status === "lobby") navigate(`/lobby/${code}`, { replace: true });
  }, [room?.status]);

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);
    try {
      await submitVotes(code, ratings);
    } catch (err) {
      console.error("vote submit failed:", err);
      setSubmitted(false);
    }
  };

  if (!room) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-8 px-4 py-10">
      <button
        onClick={async () => { await logOut(); navigate("/login"); }}
        className="absolute top-4 right-4 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        Sign out
      </button>

      <div className="text-center">
        <p className="text-xs text-gray-400 uppercase tracking-widest">The prompt was</p>
        <p className="text-2xl font-black text-gray-800 mt-1">{room.prompt}</p>
        <p className="text-gray-400 text-sm mt-1">Rate everyone's drawings</p>
      </div>

      <div className="flex flex-wrap gap-8 justify-center">
        {otherDrawings.map((d) => (
          <div key={d.uid} className="flex flex-col items-center gap-2">
            <DrawingShowcase drawing={d} />
            <RatingStars
              value={ratings[d.uid] ?? 0}
              onChange={(stars) => setRatings((r) => ({ ...r, [d.uid]: stars }))}
              disabled={submitted}
            />
          </div>
        ))}
        {otherDrawings.length === 0 && (
          <p className="text-gray-400 text-sm">Waiting for drawings...</p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitted || !allRated}
        className="py-3 px-8 font-bold rounded-xl bg-pink-500 text-white hover:bg-pink-400 cursor-pointer disabled:opacity-60"
      >
        {submitted ? "Votes submitted!" : "Submit Votes"}
      </button>
    </div>
  );
}
