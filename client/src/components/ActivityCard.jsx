import { getRandomImage } from "../constants/activityImages";
import { useNavigate } from "react-router";

export default function ActivityCard({ activity }) {
  const navigate = useNavigate();
  const image = getRandomImage();

  return (
    <div
      onClick={() => navigate(`/activities/${activity._id}`)}
      className="min-w-[280px] max-w-[280px]
                 bg-white rounded-2xl shadow-md
                 overflow-hidden cursor-pointer
                 hover:scale-[1.02] transition"
    >
      {/* IMAGE */}
      <div className="h-40 w-full overflow-hidden">
        <img
          src={image}
          alt={activity.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">
          {activity.title}
        </h3>

        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {activity.description}
        </p>

        <div className="mt-3 text-sm text-gray-500">
          📍 {activity.location?.name || "Nearby"}
        </div>

        <div className="mt-1 text-sm text-gray-500">
          👥 {activity.participants?.length || 0} joined
        </div>
      </div>
    </div>
  );
}
