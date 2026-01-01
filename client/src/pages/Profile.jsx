import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";
// import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import { useToast } from "../context/ToastContext";

function Profile() {
  const [user, setUser] = useState(null);
  const [createdActivities, setCreatedActivities] = useState([]);
  const [joinedActivities, setJoinedActivities] = useState([]);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        
        const res = await api.get("/users/profile" ); 
        setUser(res.data.user);
        // console.log(res.data);
        setCreatedActivities(res.data.user.createdActivities);
        setJoinedActivities(res.data.user.joinedActivities);

        // // Get created activities
        // const created = await api.get(`/users/${res.data.user._id}/created-activities`);
        // setCreatedActivities(created.data);

        // // Get joined activities
        // const joined = await api.get(`/users/${res.data.user._id}/joined-activities`);
        // setJoinedActivities(joined.data);

      } catch (err) {
        console.error(err);
        showToast("Not able to fetch User", "error")
      }
    };

    fetchUser();
  }, []);

  if (!user) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="p-4 space-y-6">
      {/* User Info */}
      <div className="bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-600">{user.email}</p>
        <StarRating value={Math.floor(Math.random() * 2) + 4} />
      </div>

      {/* Created Activities */}
      <div>
        <h2 className="text-xl font-semibold mb-2">My Created Activities</h2>
        {createdActivities.length === 0 ? (
          <p className="text-gray-500">You haven't created any activities yet.</p>
        ) : (
          <ul className="space-y-2">
            {createdActivities.map((a) => (
              <li
                key={a._id}
                onClick={() => navigate(`/activities/${a._id}`)}
                className="p-3 bg-white rounded shadow cursor-pointer hover:bg-gray-100"
              >
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-gray-500">{a.type}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Joined Activities */}
      <div>
        <h2 className="text-xl font-semibold mb-2">My Joined Activities</h2>
        {joinedActivities.length === 0 ? (
          <p className="text-gray-500">You haven't joined any activities yet.</p>
        ) : (
          <ul className="space-y-2">
            {joinedActivities.map((a) => (
              <li
                key={a._id}
                onClick={() => navigate(`/activities/${a._id}`)}
                className="p-3 bg-white rounded shadow cursor-pointer hover:bg-gray-100"
              >
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-gray-500">{a.type}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Profile;
