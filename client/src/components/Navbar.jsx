import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="bg-green-700 text-white px-6 py-3 ">
        <div className="flex justify-between items-center">
        
            <Link to="/" className="text-lg font-bold">HikeTrack</Link>
            <div className="flex justify-between items-center space-x-4">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            </div>
        </div>
      
    </nav>
  );
}