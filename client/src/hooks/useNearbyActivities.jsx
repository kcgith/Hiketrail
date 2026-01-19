import { useEffect, useState } from "react";
import api from "../api/axios";

const FALLBACK_LOCATION = {
  lat: 12.9716,
  lng: 77.5946, // Bengaluru
};

// 🔹 simple in-memory cache
let cachedResult = null;
let cachedCoordsKey = null;

export function useNearbyActivities({ autoLocate = false } = {}) {
  const [coords, setCoords] = useState(FALLBACK_LOCATION);
  const [activities, setActivities] = useState(cachedResult || []);
  const [loading, setLoading] = useState(!cachedResult);
  const [locationError, setLocationError] = useState(false);

  // Optional: auto-detect user location (Home only)
  useEffect(() => {
    if (!autoLocate || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationError(false);
      },
      () => {
        setLocationError(true);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [autoLocate]);

  // Fetch activities
  useEffect(() => {
    const coordsKey = `${coords.lat},${coords.lng}`;

    // ✅ Use cache if available
    if (cachedCoordsKey === coordsKey && cachedResult) {
      setActivities(cachedResult);
      setLoading(false);
      return;
    }

    const fetchActivities = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/activities/nearby?lat=${coords.lat}&lng=${coords.lng}&radius=500`,
          { headers: { "Cache-Control": "no-store" } }
        );

        cachedResult = res.data;
        cachedCoordsKey = coordsKey;

        setActivities(res.data);
      } catch (err) {
        console.error("Failed to fetch activities", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [coords]);

  return {
    activities,
    loading,
    coords,
    locationError,
    setCoords,
  };
}
