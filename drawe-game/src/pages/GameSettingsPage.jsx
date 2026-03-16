import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useGameContext } from "../context/GameContext";
import { useAuthUser } from "../context/AuthContext";
import { ROUND_OPTIONS, DRAW_TIME_OPTIONS } from "../utils/constants";

// only the host should be able to get here but we check anyway
export default function GameSettingsPage() {
  const { code } = useParams();
  const { room } = useGameContext();
  const user = useAuthUser();
  const navigate = useNavigate();

  const [rounds, setRounds] = useState(room?.settings?.rounds ?? 3);
  const [drawTime, setDrawTime] = useState(room?.settings?.drawTime ?? 60);
  const [saving, setSaving] = useState(false);

  if (room && room.hostId !== user?.uid) {
    navigate(`/lobby/${code}`);
    return null;
  }

  async function handleSave() {
    setSaving(true);
    await updateDoc(doc(db, "rooms", code), { settings: { rounds, drawTime } });
    navigate(`/lobby/${code}`);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-8">
      <div className="text-center">
        <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
          DRAWE
        </h1>
        <p className="text-gray-400 mt-1 text-sm">Game Settings</p>
      </div>

      <div className="flex flex-col gap-5 w-72">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rounds</label>
          <div className="flex gap-2">
            {ROUND_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setRounds(n)}
                className={`flex-1 py-2 rounded-xl border-2 font-bold text-sm cursor-pointer transition-colors ${
                  rounds === n
                    ? "border-pink-500 bg-pink-500 text-white"
                    : "border-pink-500 text-pink-500 hover:bg-pink-50"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Draw Time (seconds)
          </label>
          <div className="flex gap-2">
            {DRAW_TIME_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setDrawTime(n)}
                className={`flex-1 py-2 rounded-xl border-2 font-bold text-sm cursor-pointer transition-colors ${
                  drawTime === n
                    ? "border-cyan-400 bg-cyan-400 text-white"
                    : "border-cyan-400 text-cyan-500 hover:bg-cyan-50"
                }`}
              >
                {n}s
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="py-3 px-10 font-bold rounded-xl bg-pink-500 text-white hover:bg-pink-400 cursor-pointer disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save & Back to Lobby"}
      </button>
    </div>
  );
}
