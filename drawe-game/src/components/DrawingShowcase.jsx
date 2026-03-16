export default function DrawingShowcase({ drawing }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-52 h-40 rounded-2xl border-2 border-gray-100 overflow-hidden bg-white">
        {drawing.dataURL ? (
          <img
            src={drawing.dataURL}
            alt={`drawing by ${drawing.displayName}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-gray-300 text-sm">no drawing</p>
          </div>
        )}
      </div>
      <p className="text-sm font-semibold text-gray-600">{drawing.displayName}</p>
    </div>
  );
}
