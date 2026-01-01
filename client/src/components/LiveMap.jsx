import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LiveMap({ locations }) {
  const firstUser = Object.values(locations)[0];

  if (!firstUser) return <p>No live locations yet...</p>;

  return (
    <MapContainer
      center={[firstUser.latitude, firstUser.longitude]}
      zoom={14}
      style={{ height: "200px", width: "50%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {Object.entries(locations).map(([uid, loc]) => (
        <Marker
          key={uid}
          position={[loc.latitude, loc.longitude]}
          icon={defaultIcon}
        >
          <Popup>
            User: {uid} <br /> Last updated: {new Date(loc.updatedAt).toLocaleTimeString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
