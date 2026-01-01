import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Modal from "../ui/modal";
import { useToast } from "../context/ToastContext";
// import { useParams, useNavigate } from "react-router";


export default function Login() {
  // const {id} = useParams();
  // const navigate = useNavigate();
  const { login, authModal, setAuthModal } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(""); // clear previous error

  try {
    const res = await api.post("/auth/login", { email, password });
    const { token } = res.data;

    login(token);
    setAuthModal(null);
  } catch (err) {
    console.error("Login failed:", err);

    
    if (err.response?.status === 401) {
      setError("Invalid email or password");
      return;
    }

    // 🚨 OTHER ERRORS → toast
    showToast("Something went wrong. Please try again.", "error");
  }
};


  return (
  <Modal
    isOpen={authModal === "login"}
    onClose={() => setAuthModal(null)}
  >
    <h2 className="text-2xl font-semibold mb-4">Welcome back</h2>

    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
          <div className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}
      <input
        type="email"
        name="email"
        autoComplete="email"
        placeholder="Email"
        value={email}
        className="w-full border rounded p-2"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="Password"
        value={password}
        className="w-full border rounded p-2"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        className="w-full rounded bg-black text-white py-2"
      >
        Log in
      </button>
    </form>

    <p className="text-sm text-center mt-4">
      New here?{" "}
      <button
        onClick={() => setAuthModal("register")}
        className="text-blue-600 font-medium"
      >
        Create account
      </button>
    </p>
  </Modal>
);

}
