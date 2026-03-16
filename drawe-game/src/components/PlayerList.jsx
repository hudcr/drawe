export default function PlayerList({ players, currentUid }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {players.map((p) => (
        <div
          key={p.uid}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-sm font-semibold text-gray-700 flex-1">{p.displayName}</span>
          {p.uid === currentUid && <span className="text-xs text-pink-400 font-bold">you</span>}
          {p.score > 0 && <span className="text-xs font-bold text-gray-400">{p.score}pts</span>}
        </div>
      ))}
    </div>
  );
}
