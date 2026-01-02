import { useEffect, useState } from "react";
import api from "../api/axios";

const FALLBACK_LOCATION = {
  lat: 12.9716,
  lng: 77.5946, // Bengaluru
};

export function useNearbyActivities({ autoLocate = false } = {}) {
  const [coords, setCoords] = useState(FALLBACK_LOCATION);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
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
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/activities/nearby?lat=${coords.lat}&lng=${coords.lng}&radius=500`,
          { headers: { "Cache-Control": "no-store" } }
        );
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
    setCoords, // Home can still control location manually
  };
}
