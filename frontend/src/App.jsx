import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Elections from "./pages/Elections";
import Candidates from "./pages/Candidates";
import Vote from "./pages/Vote";
import Results from "./pages/Results";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/elections" element={<Elections />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/results" element={<Results />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      <Footer />

   </BrowserRouter>
  );
}

export default App;