export default function Toast({ message, type }) {
  const colors = {
    success: "bg-green-700",
    error: "bg-red-700",
    info: "bg-gray-800",
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`px-5 py-3 rounded-lg text-white shadow-lg transition-all
        ${colors[type]}`}
      >
        {message}
      </div>
    </div>
  );
}
