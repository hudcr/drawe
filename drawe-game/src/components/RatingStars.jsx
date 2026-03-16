export default function RatingStars({ value = 0, onChange, disabled = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !disabled && onChange?.(star)}
          className={`text-2xl transition-colors ${
            disabled ? "cursor-default" : "cursor-pointer"
          } ${star <= value ? "text-pink-500" : "text-gray-200 hover:text-pink-300"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
