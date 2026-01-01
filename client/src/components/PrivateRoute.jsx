
import { Outlet, Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";



const  PrivateRoute = () => {
    
    const { user, setAuthModal } = useAuth();
    const location = useLocation();

   useEffect(() => {
    if (!user) {
      setAuthModal("login");
    }
  }, [user, setAuthModal]);

  if (!user) {
    return <Navigate to="/home" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
export default PrivateRoute;