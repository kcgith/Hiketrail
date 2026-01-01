import { useState } from "react";

export default function LocationTile({ text, loading }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      onClick={handleCopy}
      className="cursor-pointer select-none w-full rounded-lg border bg-gray-50 p-4 hover:bg-gray-100 transition"
    >
      <p className="text-xs text-gray-500 mb-1">Location</p>

      {loading ? (
        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
      ) : (
        <p className="font-medium text-gray-800">
          {text || "Unknown location"}
        </p>
      )}

      <p className="mt-1 text-xs text-gray-400">
        {copied ? "Copied!" : "Click to copy"}
      </p>
    </div>
  );
}
