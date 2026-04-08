import React from "react";
import Home from "./Pages/Home/Home";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./Pages/SignIn/SignIn";
import Gallery from "./Pages/Gallery/Gallery";
import Upload from "./Pages/Upload/Upload";
import AboutPage from "./Pages/About/AboutPage";
import ProjectDetails from "./Pages/ProjectDetails/ProjectDetails";
import Developer from "./Pages/Developer/Developer";
import { AuthProvider } from "./Data/AuthContext";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<AboutPage />} />
          <Route path="/Gallery" element={<Gallery />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/project/:uuid" element={<ProjectDetails />} />
          {/* Rutas protegidas — requieren autenticación */}
          <Route path="/Upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
          <Route path="/Developer" element={<PrivateRoute><Developer /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
