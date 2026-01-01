export default function StarRating({ value = 0, onChange, size = "text-xl" }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange?.(star)}
          className={`${size} transition cursor-pointer ${
            star <= value ? "text-yellow-400" : "text-gray-300"
          } hover:scale-110`}
          aria-label={`Rate ${star}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
