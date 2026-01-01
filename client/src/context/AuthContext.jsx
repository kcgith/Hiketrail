import { createContext, useEffect, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { setAuthHandler } from "../utils/authEvents";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authModal, setAuthModal] = useState(null); // "login" | "register" | null

  // Restore session on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (err) {
      console.error("Invalid token, clearing auth");
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    setAuthHandler(() => {
      setUser(null);
      setAuthModal("login");
    });
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    setAuthModal(null); //  close modal after login
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        authModal,
        setAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
