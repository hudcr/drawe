export default function Timer({ seconds }) {
  const isLow = seconds <= 10;
  return (
    <span className={`text-lg font-black tabular-nums ${isLow ? "text-pink-500 animate-pulse" : "text-cyan-500"}`}>
      {seconds}s
    </span>
  );
}
