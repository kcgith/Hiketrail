import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router";
import L from "leaflet";

import LocationTile from "../components/LocationTile";
import ActivityCard from "../components/ActivityCard";
import { useGeocoding } from "../hooks/useGeocoding";
import { useNearbyActivities } from "../hooks/useNearbyActivities";
import { useToast } from "../context/ToastContext";

const userIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function Home() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { reverseGeocode, forwardGeocode } = useGeocoding();

  const {
    activities,
    coords,
    setCoords,
    locationError,
  } = useNearbyActivities({ autoLocate: true });

  const [address, setAddress] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [exploreMode, setExploreMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!coords) return;

    const loadAddress = async () => {
      setLoadingAddress(true);
      try {
        const text = await reverseGeocode(coords.lat, coords.lng);
        setAddress(text);
      } catch {
        setAddress("Unknown location");
      } finally {
        setLoadingAddress(false);
      }
    };

    loadAddress();
  }, [coords]);

  const handleLocationSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      const result = await forwardGeocode(searchQuery);
      if (!result) return;

      setCoords({ lat: result.lat, lng: result.lng });
      setAddress(result.displayName);
      setExploreMode(false);
    } catch {
      showToast("Failed to find location", "error");
    } finally {
      setSearching(false);
    }
  };

  if (!coords) return <p className="p-4">Loading location…</p>;

  return (
    <div className="p-4 space-y-4">
      {locationError && (
        <p className="text-sm text-gray-500">
          No nearby activities — showing Bengaluru
        </p>
      )}

      <h1 className="text-xl font-bold">
        {locationError ? "Activities in Bengaluru" : "Nearby Activities"}
      </h1>

      {/* ================= LOCATION + MAP ================= */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_0.4fr] gap-4">

          <div className="space-y-3">
            <LocationTile text={address} loading={loadingAddress} />

            <div className="flex gap-3">
              <button
                onClick={() => setExploreMode(v => !v)}
                className="text-sm text-blue-600 hover:underline"
              >
                {exploreMode ? "Cancel" : "Change location"}
              </button>
            </div>

            {exploreMode && (
              <div className="flex gap-2">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                  placeholder="Search city"
                />
                <button
                  onClick={handleLocationSearch}
                  disabled={searching}
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  {searching ? "…" : "Go"}
                </button>
              </div>
            )}
          </div>

          <div className="hidden md:block bg-gray-200 w-px" />

          <div className="h-[160px] rounded-lg overflow-hidden">
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={13}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[coords.lat, coords.lng]} icon={userIcon}>
                <Popup>You are here</Popup>
              </Marker>

              {activities.map((a) => (
                <Marker
                  key={a._id}
                  position={[
                    a.location.coordinates[1],
                    a.location.coordinates[0],
                  ]}
                />
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* ================= ACTIVITY CAROUSEL ================= */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">
          Explore nearby
        </h2>

        {activities.length === 0 ? (
          <p className="text-sm text-gray-500">
            No activities nearby yet.
          </p>
        ) : (
          <div
            className="
              flex gap-6 overflow-x-auto
              scroll-smooth snap-x snap-mandatory
              pb-4
            "
          >
            {activities.map((activity) => (
              <div key={activity._id} className="snap-start">
                <ActivityCard activity={activity} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
