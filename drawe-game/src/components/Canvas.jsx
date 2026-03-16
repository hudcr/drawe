import { useEffect } from "react";

export default function Canvas({ canvasRef, startDraw, draw, endDraw }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // fill white so the exported jpeg isn't black
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      className="border-2 border-gray-100 rounded-2xl cursor-crosshair touch-none bg-white"
      style={{ maxWidth: "100%", height: "auto" }}
      onMouseDown={startDraw}
      onMouseMove={draw}
      onMouseUp={endDraw}
      onMouseLeave={endDraw}
      onTouchStart={startDraw}
      onTouchMove={draw}
      onTouchEnd={endDraw}
    />
  );
}
