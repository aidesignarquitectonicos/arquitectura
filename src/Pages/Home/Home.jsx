import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ThemeProvider } from "@emotion/react";
import {
    AppBar,
    Avatar,
    Box,
    CssBaseline,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from "@mui/material";
import theme from "../../Themes/theme";
import logo from "../../Assets/icono.png";
import Footer from "../../Pages/Footer/Footer";
import { useNavigate } from "react-router-dom";
import Content from "../../Components/Content/Content";
import { signOut } from "firebase/auth";
import { auth } from "../../Data/FirebaseConfig"; // Asegúrate de que este es el camino correcto a tu configuración de Firebase donde inicializas `auth`

const Home = () => {

    // Estado para controlar la apertura del menú
    const [anchorEl, setAnchorEl] = useState(null);
    //Constante para navegar
    const [user, setUser] = useState(null);
    const navegationrender = useNavigate();

    // Maneja el clic en el avatar para abrir el menú
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Cierra el menú
    const handleClose = () => {
        setAnchorEl(null);

    };

    const handleGallery = () => {
        navegationrender("/Gallery");
    }

    const handleUpload = () => {
        navegationrender("/Upload");
    }

    const handleSignIn = () => {
        navegationrender("/SignIn");
    }

    const handleSignOut = () => {
        signOut(auth).then(() => {
            // El cierre de sesión fue exitoso
            console.log("Cierre de sesión exitoso");
            navegationrender("/");
        }).catch((error) => {
            // Ocurrió un error al cerrar sesión
            console.error("Error al cerrar sesión", error);
        });
    };

    const isAuthenticated = !!user;

    // Escuchar cambios en el estado de autenticación
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return unsubscribe; // Limpiar suscripción
    }, []);

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ background: "#f4f4f4", color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar sx={{ justifyContent: "space-between" }}>
                        <Typography variant="h6">AIDesign</Typography>
                        <IconButton onClick={handleClick}>
                            <Avatar src={logo} />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                        >
                            <MenuItem onClick={handleGallery}>Gallery</MenuItem>
                            {isAuthenticated && <MenuItem onClick={handleUpload}>Upload</MenuItem>}
                            {isAuthenticated ? (
                                <>
                                    <MenuItem onClick={handleClose}>{user.displayName || "Usuario"}</MenuItem>
                                    <MenuItem onClick={handleSignOut}>Cerrar sesión</MenuItem>
                                </>
                            ) : (
                                <MenuItem onClick={handleSignIn}>Sign In</MenuItem>
                            )}
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Box sx={{ marginTop: 8, marginBottom: 4 }}>
                    <Content />
                </Box>
            </ThemeProvider>
            <Footer />
        </>
    )
}

export default Home;