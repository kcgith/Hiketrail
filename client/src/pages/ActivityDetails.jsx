import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../api/axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import useLiveLocation from "../hooks/useLiveLocation";

import { useGeocoding } from "../hooks/useGeocoding";
import LocationTile from "../components/LocationTile";
import StarRating from "../components/StarRating";
import { useToast } from "../context/ToastContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const socket = io(SOCKET_URL, {
  withCredentials: true,
});

function ActivityDetails() {
  const { id: activityId } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const { user } = useAuth();

  const userId = user?._id || user?.id;

  const isCreator = activity?.createdBy?._id === userId;

  const isParticipant = activity?.participants?.some(
    p => (p._id || p.id) === userId
  );

  const [locations, setLocations] = useState({});
  const [tracking, setTracking] = useState(false);


  const { reverseGeocode } = useGeocoding();
  const [address, setAddress] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(false);


  const [rating, setRating] = useState(() => {
  const stored = localStorage.getItem(`rating-${activity?._id}`);
  return stored ? Number(stored) : 0;
  });

  const { showToast } = useToast();

  useEffect(() => {
    if (!activity?.location) return;

    const loadAddress = async () => {
      setLoadingAddress(true);
      try {
        const text = await reverseGeocode(
          activity.location.coordinates[1],
          activity.location.coordinates[0]
        );
        setAddress(text);
      } catch {
        setAddress("Unknown location");
      } finally {
        setLoadingAddress(false);
      }
    };

    loadAddress();
  }, [activity]);

  // Join socket room
  useEffect(() => {
    socket.emit("joinActivityRoom", activityId);
  }, [activityId]);

  // Listen for others' location updates
  useEffect(() => {
    socket.on("locationUpdate", (data) => {
      setLocations((prev) => ({
        ...prev,
        [data.userId]: data,
      }));
    });

    return () => socket.off("locationUpdate");
  }, []);

  // Start sending user location
  useLiveLocation(
    tracking ? socket : null,
    activityId,
    user?._id
  );

  // Fetch activity
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await api.get(`/activities/${activityId}`);
        setActivity(res.data);
      } catch (err) {
        console.error("Activity fetch error:", err);
        showToast("Activity not fetched","error")
      }
    };
    fetchActivity();
  }, [activityId]);


  const handleRating = (value) => {
  setRating(value);
  localStorage.setItem(`rating-${activity._id}`, value);
  };


  const joinActivity = async () => {
  try {
    await api.post(`/activities/${activity._id}/join`);

    // 🔁 Re-fetch updated activity
    const res = await api.get(`/activities/${activity._id}`);
    setActivity(res.data);
    showToast("Joined activity!", "success");

  } catch (err) {
    console.error(err);
    showToast("Error joining activity", "error")
  }
};

  

  const leaveActivity = async () => {
    try {
      const res = await api.post(`/activities/${activityId}/leave`);
      setActivity(res.data.activity);
      showToast("Left activity!", "success");
    } catch (err) {
      console.error(err);
      showToast("Error trying to leave", "error")
    }
  };

  const deleteActivity = async () => {
    try {
      await api.delete(`/activities/${activityId}`);
      navigate("/");
      showToast("Deleted activity!", "success");
    } catch (err) {
      console.error(err);
      showToast("Error trying to delete", "error")
    }
  };

  if (!activity) return <p>Loading...</p>;

  
return (
  <div className="p-4 pb-24 max-w-5xl mx-auto space-y-6">

    {/* ================= HEADER ================= */}
    <div className="bg-white rounded-xl border shadow-sm p-5 space-y-3">
      <h1 className="text-2xl font-bold">{activity.title}</h1>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <span>📌 {activity.type}</span>
        <span>🗓 {new Date(activity.date).toLocaleString()}</span>
      </div>

      {/* ================= PRIMARY ACTIONS ================= */}
      <div className="flex flex-wrap items-center gap-3 pt-4">

        {/* LEFT: Join / Leave / Edit */}
        <div className="flex flex-wrap gap-3">
          {!isCreator && !isParticipant && (
            <button
              onClick={joinActivity}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Join Activity
            </button>
          )}

          {isParticipant && (
            <button
              onClick={leaveActivity}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Leave Activity
            </button>
          )}

          {isCreator && (
            <>
              <button
                onClick={() => navigate(`/activities/edit/${activity._id}`)}
                className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                onClick={deleteActivity}
                className="px-5 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
              >
                Delete
              </button>
            </>
          )}
        </div>

        {/* RIGHT: Chat + Live Location */}
        <div className="flex gap-2 ml-auto">

          {/* CHAT */}
          <div className="relative group">
            <button
              disabled={!isParticipant}
              onClick={() =>
                isParticipant &&
                navigate(`/activities/${activity._id}/chat`)
              }
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition
                ${isParticipant
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}
              `}
            >
              Chat
            </button>
          </div>

          {/* LIVE LOCATION */}
          <div className="relative group">
            <button
              disabled={!user}
              onClick={() => user && setTracking(!tracking)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition
                ${user
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}
              `}
            >
              {tracking ? "Stop Live" : "Live Location"}
            </button>
          </div>

        </div>
      </div>
    </div>

    {/* ================= DESCRIPTION (FIXED POSITION) ================= */}
    <div className="bg-white rounded-xl border shadow-sm p-5">
      <h2 className="text-lg font-semibold mb-2">About this activity</h2>
      <p className="text-gray-700 leading-relaxed">
        {activity.description}
      </p>
    </div>

    {/* ================= MAP + PEOPLE ================= */}
    <div className="bg-white rounded-xl shadow-sm border p-4 space-y-4">

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-4 items-stretch">

        {/* LEFT: Location */}
        <div className="flex items-center">
          <LocationTile text={address} loading={loadingAddress} />
        </div>

        <div className="hidden md:block bg-gray-200" />

        {/* RIGHT: Map */}
        <div className="h-[220px] rounded-lg overflow-hidden">
          <MapContainer
            center={[
              activity.location.coordinates[1],
              activity.location.coordinates[0],
            ]}
            zoom={15}
            className="h-full w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[
                activity.location.coordinates[1],
                activity.location.coordinates[0],
              ]}
            >
              <Popup>{activity.title}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      {/* Host */}
      <h2 className="text-lg font-semibold">Host</h2>

      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
        <div>
          <p className="font-medium">
            {activity.createdBy?.name || activity.createdBy?.email}
          </p>
          <p className="text-xs text-gray-500">Community host</p>
        </div>

        <div className="flex items-center gap-2">
          <StarRating value={rating} onChange={handleRating} />
          {rating > 0 && <span className="text-sm">{rating}/5</span>}
        </div>
      </div>

      {/* Participants */}
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Participants ({activity.participants.length})
        </h3>

        <ul className="space-y-1 text-sm text-gray-700 max-h-40 overflow-y-auto">
          {activity.participants.map((p) => (
            <li key={p._id}>• {p.name || p.email}</li>
          ))}
        </ul>
      </div>

    </div>

    {/* ================= MOBILE STICKY ACTION BAR ================= */}
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-white border-t shadow-lg px-4 py-3 flex gap-3">
        {!isCreator && !isParticipant && (
          <button
            onClick={joinActivity}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium"
          >
            Join Activity
          </button>
        )}

        {isParticipant && (
          <>
            <button
              onClick={() => navigate(`/activities/${activity._id}/chat`)}
              className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium"
            >
              Chat
            </button>
            <button
              onClick={leaveActivity}
              className="px-4 py-3 bg-red-100 text-red-600 rounded-lg font-medium"
            >
              Leave
            </button>
          </>
        )}
      </div>
    </div>

  </div>
);}


export default ActivityDetails;
