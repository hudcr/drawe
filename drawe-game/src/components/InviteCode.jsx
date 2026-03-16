export default function InviteCode({ code }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-xs text-gray-400 uppercase tracking-widest">Room Code</p>
      <p className="text-4xl font-black tracking-widest text-gray-800">{code}</p>
    </div>
  );
}
