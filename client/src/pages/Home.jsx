import ActivityCard from "../components/ActivityCard";
import Layout from "../components/Layout"

export default function Home() {
  const dummyActivities = [
    {
      id: 1,
      name: "Morning Hike at Pine Trails",
      type: "Outdoor",
      location: "Pine Hills Park",
      date: "Aug 10, 2025",
      description: "A relaxing 5km hike for all levels."
    },
    {
      id: 2,
      name: "Cycling by the Riverside",
      type: "Outdoor",
      location: "Riverside Path",
      date: "Aug 12, 2025",
      description: "Group cycling for intermediate riders."
    }
  ];

  return (
    <Layout>
        <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Nearby Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dummyActivities.map(act => (
            <ActivityCard key={act.id} activity={act} />
            ))}
        </div>
        </div>
    </Layout>
    
  );
}