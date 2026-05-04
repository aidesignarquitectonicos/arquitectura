import React from "react";
import Home from "./Presentation/Pages/Home/Home";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./Presentation/Pages/SignIn/SignIn";
import Gallery from "./Presentation/Pages/Gallery/Gallery";
import Upload from "./Presentation/Pages/Upload/Upload";
import AboutPage from "./Presentation/Pages/About/AboutPage";
import ProjectDetails from "./Presentation/Pages/ProjectDetails/ProjectDetails";
import Developer from "./Presentation/Pages/Developer/Developer";
import PrivacyPolicy from "./Presentation/Pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "./Presentation/Pages/TermsOfService/TermsOfService";
import { AuthProvider } from "./Presentation/Data/AuthContext";
import PrivateRoute from "./Presentation/Components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<AboutPage />} />
          <Route path="/Gallery" element={<Gallery />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/TermsOfService" element={<TermsOfService />} />
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
