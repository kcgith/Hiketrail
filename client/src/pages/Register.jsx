import React, { useState } from "react";

import { useAuth } from "../context/AuthContext";
import  api from "../api/axios";
import Modal from "../ui/modal";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const { login, authModal, setAuthModal } = useAuth();; // we only need login() from context
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Call backend directly
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      const token = res.data.token; // backend sends token

      // Save to AuthContext
      login(token);
      setAuthModal(null); 

      showToast("New Account created!", "success");
    } catch (err) {
      console.error("Register failed:", err.message);
      if (err.response?.status === 401) {
      setError("Invalid credentials");
      return;
    }
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  return (
  <Modal
    isOpen={authModal === "register"}
    onClose={() => setAuthModal(null)}
  >
    <h2 className="text-2xl font-semibold mb-4">Create new account</h2>

    <form onSubmit={handleSubmit} className="space-y-4">

      {error && (
        <div className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder="Name"
        value={name}
        className="w-full border rounded p-2"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        className="w-full border rounded p-2"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        className="w-full border rounded p-2"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        className="w-full rounded bg-black text-white py-2"
      >
        Create account
      </button>
    </form>

    <p className="text-sm text-center mt-4">
      Already have an account?{" "}
      <button
        onClick={() => setAuthModal("login")}
        className="text-blue-600 font-medium"
      >
        Login
      </button>
    </p>
  </Modal>
);

}
