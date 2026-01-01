// import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative z-10 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
            <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" />
            </svg>
        </button>

        {children}
      </div>
    </div>
  );
}
