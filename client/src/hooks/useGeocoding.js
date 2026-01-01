import { useState } from "react";

export function useGeocoding() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const forwardGeocode = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      if (!data.length) throw new Error("No results");
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    return data.display_name;
  };

  return { forwardGeocode, reverseGeocode, loading, error };
}
