// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center bottom-0 w-full ">
      <p>© {new Date().getFullYear()} HikeTrack. All rights reserved.</p>
    </footer>
  );
}
