// src/pages/SearchResults.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "../api/axios";
import { ACTIVITIES } from "../api/routes";
import { useToast } from "../context/ToastContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const query = useQuery();
  const q = query.get("q") || "";
  const lat = query.get("lat");
  const lng = query.get("lng");
  const radius = query.get("radius");
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const url = ACTIVITIES.SEARCH(q, lat, lng, radius);
        const res = await axios.get(url);
        setResults(res.data);
      } catch (err) {
        console.error("Search fetch error:", err);
        showToast("Could not search", "error")
      } finally {
        setLoading(false);
      }
    };

    if (q || (lat && lng)) {
      fetch();
    } else {
      setResults([]);
    }
  }, [q, lat, lng, radius]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-3">Search results for “{q}”</h1>

      {loading && <p>Loading…</p>}

      {!loading && results.length === 0 && <p>No results found.</p>}

      <ul className="space-y-3">
        {results.map((a) => (
          <li key={a._id} className="p-3 border rounded hover:shadow cursor-pointer" onClick={() => navigate(`/activity/${a._id}`)}>
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold">{a.title}</h2>
                <p className="text-sm text-gray-600">{a.type} • {a.description?.slice(0, 120)}</p>
              </div>
              <div className="text-sm text-gray-500">
                {a.location?.coordinates ? `${a.location.coordinates[1].toFixed(2)}, ${a.location.coordinates[0].toFixed(2)}` : ""}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
