import { BrowserRouter as Router, Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";


export default function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}
