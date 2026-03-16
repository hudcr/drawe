import { useRef, useCallback } from "react";

export function useCanvas() {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef(null);
  const history = useRef([]);
  const color = useRef("#000000");
  const brushSize = useRef(4);

  function getPos(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top) * scaleY,
    };
  }

  function saveSnapshot() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    history.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    // don't let the history get too big, eats memory fast
    if (history.current.length > 30) history.current.shift();
  }

  const startDraw = useCallback((e) => {
    e.preventDefault();
    saveSnapshot();
    isDrawing.current = true;
    lastPos.current = getPos(e);
  }, []);

  const draw = useCallback((e) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = color.current;
    ctx.lineWidth = brushSize.current;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  }, []);

  const endDraw = useCallback(() => {
    isDrawing.current = false;
    lastPos.current = null;
  }, []);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveSnapshot();
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const undo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || history.current.length === 0) return;
    canvas.getContext("2d").putImageData(history.current.pop(), 0, 0);
  }, []);

  const setColor = useCallback((c) => { color.current = c; }, []);

  // jpeg at 0.7 quality keeps the data url small enough for firestore
  const getDataURL = () =>
    canvasRef.current?.toDataURL("image/jpeg", 0.7) ?? null;

  return { canvasRef, startDraw, draw, endDraw, clear, undo, setColor, getDataURL };
}
