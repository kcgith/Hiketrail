import { useEffect, useState } from "react";
import api from "../api/axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router";
import L from "leaflet";
import LocationTile from "../components/LocationTile";
import { useGeocoding } from "../hooks/useGeocoding";
import ActivityCard from "../components/ActivityCard";
import { useToast } from "../context/ToastContext";

const userIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const FALLBACK_LOCATION = {
  lat: 12.9716,
  lng: 77.5946
};
function Home() {
  const navigate = useNavigate();
  const [coords, setCoords] = useState(null);
  const [activities, setActivities] = useState([]);
  const [locationError, setLocationError] = useState(false);
  const [address, setAddress] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(false);
  const { reverseGeocode, forwardGeocode } = useGeocoding();
  const [exploreMode, setExploreMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const { showToast } = useToast();


  useEffect(() => {
  setCoords(FALLBACK_LOCATION);
  setLocationError(true);
  }, []);

  // 2. Fetch activities near user
  useEffect(() => {
    if (!coords) return;
    // console.log("Coords being used for fetch:", coords);
    const fetchActivities = async () => {
    try {
          const res = await api.get(
            `/activities/nearby?lat=${coords.lat}&lng=${coords.lng}&radius=500`,
            {
              headers: {
                "Cache-Control": "no-store"
              }
            }
          );
        if (res.data.length === 0 && !locationError) {
        setLocationError(true);
        setCoords(FALLBACK_LOCATION);
        return; // ⛔ stop this cycle, next run will use fallback coords
      }
        setActivities(res.data);
        
        // console.log("Newest activities:", res.data);
        // console.log(res.data)
      } catch (err) {
        console.error(err);
        showToast("Not able to fetch activities", "error")
      }
    };
    fetchActivities();
  }, [coords]);

  

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

  if (!coords) return <p className="p-4">Getting your location…</p>;

  const handleLocationSearch = async () => {
  if (!searchQuery.trim()) return;

  try {
    setSearching(true);

    const result = await forwardGeocode(searchQuery);

    if (!result) {
      alert("Location not found");
      return;
    }

    setCoords({
      lat: result.lat,
      lng: result.lng,
    });

    setAddress(result.displayName);
    setLocationError(false);
    setExploreMode(false);

  } catch (err) {
    console.error(err);
    showToast("Failed to find location", "error");
  } finally {
    setSearching(false);
  }
};

  const requestUserLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      setLocationError(false);
    },
    () => {
      alert("Unable to access your location");
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
  };


  return (
    
    <div className="p-4 space-y-4">
      {locationError && (
        <p className="text-sm text-gray-500">
          No activities near your location — showing activities near Bengaluru:
        </p>
      )}

      <h1 className="text-xl font-bold">
        {locationError ? "Activities in Bengaluru" : "Nearby Activities"}
      </h1>
    
      
      {/* Location + Map */}
<div className="bg-white rounded-xl shadow-sm border p-4">
  <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_0.4fr] gap-4 items-start">

    {/* LEFT: Location controls (stacked) */}
    <div className="space-y-3">

      <LocationTile
        text={address}
        loading={loadingAddress}
      />

      <div className="flex flex-wrap gap-3">
        <button
          onClick={requestUserLocation}
          className="
            text-sm font-medium text-green-600
            hover:text-green-700 hover:underline
            transition cursor-pointer
          "
        >
          Use my location
        </button>

        <button
          onClick={() => setExploreMode((v) => !v)}
          className="
            text-sm font-medium text-blue-600
            hover:text-blue-700 hover:underline
            transition cursor-pointer
          "
        >
          {exploreMode ? "Cancel" : "Change location"}
        </button>
      </div>

      {exploreMode && (
        <div className="flex gap-2 pt-1">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city or place"
            className="flex-1 border rounded px-3 py-2"
          />

          <button
            onClick={handleLocationSearch}
            disabled={searching}
            className="px-4 py-2 bg-black text-white rounded"
          >
            {searching ? "..." : "Go"}
          </button>
        </div>
      )}
    </div>

    {/* Divider */}
    <div className="hidden md:block bg-gray-200 w-px self-stretch" />

    {/* RIGHT: Map (small) */}
    <div className="h-[150px] md:h-[170px] rounded-lg overflow-hidden">
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


      {/* Activity Carousel */}
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">
          Explore nearby
        </h2>

        {activities.length === 0 ? (
          <div className="text-sm text-gray-500 px-2">
            No activities nearby yet.
            <br />
            Be the first one to create something here.
          </div>
        ) : (
          <div
            className="
              flex gap-6 overflow-x-auto pb-4
              scroll-smooth
              snap-x snap-mandatory
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
  )}

export default Home;
