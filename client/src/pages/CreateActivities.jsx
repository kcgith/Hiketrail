import { useState,useEffect } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useGeocoding } from "../hooks/useGeocoding";
import { useToast } from "../context/ToastContext";


function LocationPicker({ setCoords, onPick }) {
  useMapEvents({
    click(e) {
      const coords = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      };
      setCoords(coords);
      onPick?.(coords);
    },
  });
  return null;
}

function MapUpdater({ coords }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], 14);
    }
  }, [coords, map]);
  return null;
}


function CreateActivity() {
  const { id } = useParams(); // activityId
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { forwardGeocode } = useGeocoding();
  const [addressInput, setAddressInput] = useState("");
  const {reverseGeocode} = useGeocoding();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    date: "",
  });

  const handleMapPick = async ({ lat, lng }) => {
  try {
    const text = await reverseGeocode(lat, lng);
    setAddressInput(text);
  } catch {
    setAddressInput("");
  }
  };

  useEffect(() => {
      if (!isEdit) return;

      const fetchActivity = async () => {
        try {
          const res = await api.get(`/activities/${id}`);

          const activity = res.data;

          setForm({
            title: activity.title,
            description: activity.description,
            type: activity.type,
            date: activity.date?.slice(0, 16),
          });

          setCoords({
            lat: activity.location.coordinates[1],
            lng: activity.location.coordinates[0],
          });

        } catch (err) {
          console.error(err);
          showToast("Failed to load activity", "error");
        }
      };

      fetchActivity();
    }, [id, isEdit]);

  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitActivity = async () => {
  if (!coords) {
    alert("Please pick a location on the map");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      ...form,
      location: {
        type: "Point",
        coordinates: [coords.lng, coords.lat],
      },
    };

    if (isEdit) {
      await api.put(`/activities/${id}`, payload);
      showToast("Activity Updated!", "success");
    } else {
      await api.post("/activities/create", payload);
      showToast("Activity Created!", "success");
    }

    navigate("/");

  } catch (err) {
    console.error(err);
    showToast("Something went wrong", "error");
  } finally {
    setLoading(false);
  }
};

  const handleAddressSearch = async () => {
  if (!addressInput.trim()) return;

  try {
    const { lat, lng } = await forwardGeocode(addressInput);
    setCoords({ lat, lng });
  } catch {
    alert("Location not found");
  }
};

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">
          {isEdit ? "Edit Activity" : "Create Activity"}
      </h1>

      <input
        name="title"
        value={form.title}
        placeholder="Title"
        className="border p-2 w-full"
        onChange={handleChange}
      />

      <textarea
        name="description"
        value={form.description}
        placeholder="Description"
        className="border p-2 w-full"
        onChange={handleChange}
      />

      <input
        name="type"
        value={form.type} 
        placeholder="Type (hike, camp, run...)"
        className="border p-2 w-full"
        onChange={handleChange}
      />

      <input
        type="datetime-local"
        name="date"
        value={form.date}
        className="border p-2 w-full"
        onChange={handleChange}
      />

      <input
        value={addressInput}
        placeholder="Search address or place"
        className="border p-2 w-full"
        onChange={(e) => setAddressInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAddressSearch()}
      />
      <button
        type="button"
        onClick={handleAddressSearch}
        className="mt-2 px-4 py-2 bg-gray-800 text-white rounded w-full"
      >
        Find on map
      </button>

      <MapContainer
        center={[12.97, 77.59]}
        zoom={12}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationPicker setCoords={setCoords} onPick={handleMapPick} />
        <MapUpdater coords={coords} />

        {coords && (
          <Marker position={[coords.lat, coords.lng]} />
        )}
      </MapContainer>

      <button
        onClick={submitActivity}
        className="px-4 py-2 bg-blue-600 text-white rounded w-full"
        disabled={loading}
      >
        {loading
          ? isEdit ? "Updating..." : "Creating..."
          : isEdit ? "Update Activity" : "Create Activity"}
      </button>
    </div>
  );
}

export default CreateActivity;
