import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Data/AuthContext";
import { CircularProgress, Box } from "@mui/material";

function PrivateRoute({ children }) {
    const { currentUser } = useAuth();
    const location = useLocation();

    // Mientras Firebase verifica el estado de autenticación
    if (currentUser === undefined) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress sx={{ color: "black" }} />
            </Box>
        );
    }

    // Si no hay usuario autenticado, redirige al login guardando la ruta original
    if (!currentUser) {
        return <Navigate to="/SignIn" state={{ from: location }} replace />;
    }

    return children;
}

export default PrivateRoute;
