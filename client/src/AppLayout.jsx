import { Routes, Route, useLocation } from "react-router";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Landing from "./pages/LandingPage";
import Home from "./pages/Home";
import ActivityDetails from "./pages/ActivityDetails";
import CreateActivity from "./pages/CreateActivities";
import Chat from "./pages/Chat";
import SearchResults from "./pages/SearchResults";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

function AppLayout() {
  const location = useLocation();
  const { authModal } = useAuth();

  const isLanding = location.pathname === "/";

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <div className={isLanding ? "" : "pt-16"}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/activities/:id" element={<ActivityDetails />} />

          {/* PROTECTED ROUTES */}
          <Route element={<PrivateRoute />}>
            <Route path="/activities/create" element={<CreateActivity />} />
            <Route path="/activities/edit/:id" element={<CreateActivity />} />
            <Route path="/activities/:activityId/chat" element={<Chat />} />
          </Route>

          <Route path="/search" element={<SearchResults />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>

      {/* AUTH MODALS */}
      {authModal === "login" && <Login />}
      {authModal === "register" && <Register />}
    </>
  );
}

export default AppLayout;
