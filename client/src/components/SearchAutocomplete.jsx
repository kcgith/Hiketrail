
import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import { ACTIVITIES } from "../api/routes";
import { useNavigate } from "react-router";

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

export default function SearchAutocomplete({ initial = "" }) {
  const [query, setQuery] = useState(initial);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();

  // Debounced fetch
  const fetchSuggestions = debounce(async (text) => {
    if (!text.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    try {
      const res = await axios.get(ACTIVITIES.AUTOCOMPLETE(text, 6));
      setSuggestions(res.data || []);
      setOpen((res.data || []).length > 0);
    } catch (err) {
      console.error("Autocomplete err:", err);
    }
  }, 250);

  useEffect(() => {
    fetchSuggestions(query);
  }, [query]);

  // click outside to close
  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search trails..."
        className="w-64 border px-3 py-2 rounded-lg focus:outline-none"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            navigate(`/search?q=${encodeURIComponent(query)}`);
            setOpen(false);
          }
        }}
      />

      {open && (
        <div className="absolute z-50 mt-1 w-64 bg-white border rounded shadow">
          {suggestions.map((s) => (
            <div
              key={s._id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setOpen(false);
                navigate(`/activities/${s._id}`);
              }}
            >
              <div className="font-medium">{s.title}</div>
              <div className="text-xs text-gray-500">{s.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
