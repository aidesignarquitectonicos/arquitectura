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

// Módulo Maquinaria
import CatalogoMaquinaria from "./Maquinaria/pages/CatalogoMaquinaria";
import DetalleMaquina from "./Maquinaria/pages/DetalleMaquina";
import AdminMaquinaria from "./Maquinaria/pages/AdminMaquinaria";
import CheckoutPage from "./Maquinaria/pages/CheckoutPage";
import ConfirmacionOrden from "./Maquinaria/pages/ConfirmacionOrden";
import HistorialOrdenes from "./Maquinaria/pages/HistorialOrdenes";
import { MaquinariaProvider } from "./Maquinaria/context/MaquinariaContext";
import { CotizacionProvider } from "./Maquinaria/context/CotizacionContext";
import { CheckoutProvider } from "./Maquinaria/context/CheckoutContext";

function App() {
  return (
    <AuthProvider>
      <MaquinariaProvider>
        <CotizacionProvider>
          <CheckoutProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/About" element={<AboutPage />} />
              <Route path="/Gallery" element={<Gallery />} />
              <Route path="/SignIn" element={<SignIn />} />
              <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
              <Route path="/TermsOfService" element={<TermsOfService />} />
              <Route path="/project/:uuid" element={<ProjectDetails />} />
              {/* Módulo Maquinaria */}
              <Route path="/maquinaria" element={<CatalogoMaquinaria />} />
              <Route path="/maquinaria/:id" element={<DetalleMaquina />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/ordenes/:id" element={<ConfirmacionOrden />} />
              {/* Rutas protegidas — requieren autenticación */}
              <Route path="/Upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
              <Route path="/Developer" element={<PrivateRoute><Developer /></PrivateRoute>} />
              <Route path="/admin/maquinaria" element={<PrivateRoute><AdminMaquinaria /></PrivateRoute>} />
              <Route path="/ordenes" element={<PrivateRoute><HistorialOrdenes /></PrivateRoute>} />
            </Routes>
          </Router>
          </CheckoutProvider>
        </CotizacionProvider>
      </MaquinariaProvider>
    </AuthProvider>
  );
}


export default App;
