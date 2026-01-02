import ActivityCard from "./ActivityCard";

export default function ActivityCarousel({ activities }) {
  if (!activities.length) {
    return (
      <p className="text-sm text-gray-300 px-4">
        No activities nearby yet.
      </p>
    );
  }

  return (
    <div
      className="
        flex gap-5 overflow-x-auto pb-4
        scroll-smooth snap-x snap-mandatory
      "
    >
      {activities.map((activity) => (
        <div key={activity._id} className="snap-start">
          <ActivityCard activity={activity} />
        </div>
      ))}
    </div>
  );
}
