export default function ActivityCard({ activity }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-bold">{activity.name}</h3>
      <p className="text-sm text-gray-500">{activity.type}</p>
      <p className="mt-2">{activity.description}</p>
      <p className="text-sm mt-1">📍 {activity.location}</p>
      <p className="text-sm">🗓 {activity.date}</p>
      <button type="button" className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer" >
        Join
      </button>
    </div>
  );
}