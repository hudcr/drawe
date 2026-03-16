import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGameContext } from "../context/GameContext";
import { useGame } from "../hooks/useGame";
import { useCanvas } from "../hooks/useCanvas";
import Canvas from "../components/Canvas";
import Timer from "../components/Timer";
import { COLORS } from "../utils/constants";

export default function DrawPage() {
  const { code } = useParams();
  const { room } = useGameContext();
  const { submitDrawing } = useGame();
  const { canvasRef, startDraw, draw, endDraw, clear, undo, setColor, getDataURL } = useCanvas();
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(60);
  const [activeColor, setActiveColor] = useState("#000000");
  const [submitted, setSubmitted] = useState(false);
  const submittedRef = useRef(false);
  const intervalRef = useRef(null);

  // redirect if room status changed (e.g. everyone submitted)
  useEffect(() => {
    if (!room) return;
    if (room.status === "voting") navigate(`/vote/${code}`, { replace: true });
    if (room.status === "results") navigate(`/results/${code}`, { replace: true });
    if (room.status === "lobby") navigate(`/lobby/${code}`, { replace: true });
  }, [room?.status]);

  const handleSubmit = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitted(true);
    clearInterval(intervalRef.current);
    try {
      await submitDrawing(code, getDataURL());
    } catch (e) {
      console.error(e);
    }
  }, [code, submitDrawing, getDataURL]);

  // countdown timer synced to server start time
  useEffect(() => {
    if (!room?.roundStartedAt) return;
    const drawTime = room.settings?.drawTime ?? 60;
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - room.roundStartedAt.toDate()) / 1000
      );
      const remaining = Math.max(0, drawTime - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        handleSubmit();
      }
    }, 500);

    return () => clearInterval(intervalRef.current);
  }, [room?.roundStartedAt]);

  function pickColor(c) {
    setActiveColor(c);
    setColor(c);
  }

  if (!room) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-5 px-4 py-8">
      <div className="flex items-center gap-4 w-full max-w-[600px]">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Draw:</p>
        <p className="text-xl font-black text-gray-800 flex-1">{room.prompt}</p>
        <Timer seconds={timeLeft} />
      </div>

      <Canvas canvasRef={canvasRef} startDraw={startDraw} draw={draw} endDraw={endDraw} />

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => pickColor(c)}
              style={{ backgroundColor: c }}
              className={`w-7 h-7 rounded-full border-2 cursor-pointer hover:scale-110 transition-transform ${
                activeColor === c ? "border-pink-500 scale-110" : "border-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="w-px h-6 bg-gray-200" />
        <button onClick={undo} className="px-3 py-2 text-sm font-bold rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer">
          Undo
        </button>
        <button onClick={clear} className="px-3 py-2 text-sm font-bold rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer">
          Clear
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitted}
          className="px-4 py-2 font-bold text-sm rounded-xl bg-pink-500 text-white hover:bg-pink-400 cursor-pointer disabled:opacity-60"
        >
          {submitted ? "Submitted!" : "Submit"}
        </button>
      </div>
    </div>
  );
}
