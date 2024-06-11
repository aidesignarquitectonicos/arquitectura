/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ThemeProvider } from "@emotion/react";
import {
    AppBar,
    Avatar,
    Box,
    Card,
    CardActionArea,
    CardContent,
    CssBaseline,
    Dialog,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";
import theme from "../../Themes/theme";
import logo from "../../Assets/icono.png";
import Footer from "../../Pages/Footer/Footer";
import { useNavigate, NavLink } from "react-router-dom";
//import Content from "../../Components/Content/Content";
import { signOut } from "firebase/auth";
import { auth } from "../../Data/FirebaseConfig"; // Asegúrate de que este es el camino correcto a tu configuración de Firebase donde inicializas `auth`
import QRCode from "qrcode.react";
import CloseIcon from "@mui/icons-material/Close";
import { MenuOutlined } from "@mui/icons-material";
import { useSpring, animated } from "react-spring";
import Quilted_image from "../../Components/Quiltedimage/Quilted_image";
import "./Home.css";

const Home = () => {
    //Constante URL
    const url = "https://aidesignarquitectonicos.github.io/arquitectura/";
    const [openQr, setOpenQr] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    //Constante para navegar
    const [user, setUser] = useState(null);
    const navegationrender = useNavigate();

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                // El cierre de sesión fue exitoso
                console.log("Cierre de sesión exitoso");
                navegationrender("/");
            })
            .catch((error) => {
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
    //<Framer_motion_component />

    // Animaciones con react-spring
    const fade = useSpring({ from: { opacity: 0 }, opacity: 1, delay: 500 });

    const menuAnimation = useSpring({
        transform: menuOpen ? "translateX(0%)" : "translateX(-100%)",
    });

    return (
        <>
            <animated.div style={fade}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <AppBar
                        position="fixed"
                        sx={{
                            background: "#f4f4f4",
                            color: "#000",
                            zIndex: (theme) => theme.zIndex.drawer + 1,
                            borderBottomLeftRadius: "20px",
                            borderBottomRightRadius: "20px",
                        }}
                    >
                        <Toolbar sx={{ justifyContent: "space-between" }}>
                            <Typography variant="h6">AIDesign</Typography>
                            {isAuthenticated ? (
                                <>
                                    <IconButton onClick={() => setMenuOpen(!menuOpen)}>
                                        <Avatar src={logo} />
                                    </IconButton>
                                </>
                            ) : (
                                <>
                                    <IconButton onClick={() => setMenuOpen(!menuOpen)}>
                                        <MenuOutlined />
                                    </IconButton>
                                </>
                            )}
                            <animated.div
                                style={{
                                    ...menuAnimation,
                                    position: "fixed",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "rgba(0, 0, 5, 0.8)",
                                    zIndex: theme.zIndex.drawer + 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    padding: "20px",
                                }}
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                <nav
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textAlign: "center",
                                        width: "auto",
                                        borderTopLeftRadius: "20px",
                                        borderTopRightRadius: "20px",
                                        borderBottomLeftRadius: "20px",
                                        borderBottomRightRadius: "20px",
                                    }}
                                >
                                    <ul
                                        className={menuOpen ? "open" : ""}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            padding: "20px",
                                            listStyleType: "none",
                                            margin: 0,
                                        }}
                                    >
                                        {isAuthenticated && (
                                            <li
                                                style={{
                                                    borderBottom: "1px solid #8887875E",
                                                    padding: "20px",
                                                }}
                                            >
                                                <span>{user.email || "Usuario"}</span>
                                            </li>
                                        )}
                                        <li
                                            style={{
                                                borderBottom: "1px solid #8887875E",
                                                padding: "20px",
                                            }}
                                        >
                                            <NavLink to="/Gallery" onClick={() => setMenuOpen(false)}>
                                                Galeria
                                            </NavLink>
                                        </li>
                                        <li
                                            style={{
                                                borderBottom: "1px solid #8887875E",
                                                padding: "20px",
                                            }}
                                        >
                                            <NavLink to="/About" onClick={() => setMenuOpen(false)}>
                                                Acerca de
                                            </NavLink>
                                        </li>
                                        <li
                                            style={{
                                                borderBottom: "1px solid #8887875E",
                                                padding: "20px",
                                            }}
                                        >
                                            <NavLink
                                                onClick={() => {
                                                    setOpenQr(true);
                                                    setMenuOpen(false);
                                                }}
                                            >
                                                Codigo Qr
                                            </NavLink>
                                        </li>
                                        {isAuthenticated && (
                                            <li
                                                style={{
                                                    borderBottom: "1px solid #8887875E",
                                                    padding: "20px",
                                                }}
                                            >
                                                <NavLink
                                                    to="/Upload"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    Upload
                                                </NavLink>
                                            </li>
                                        )}
                                        {isAuthenticated ? (
                                            <li
                                                style={{
                                                    borderBottom: "1px solid #8887875E",
                                                    padding: "20px",
                                                }}
                                            >
                                                <span onClick={handleSignOut}>Cerrar sesión</span>
                                            </li>
                                        ) : (
                                            <li
                                                style={{
                                                    borderBottom: "1px solid #8887875E",
                                                    padding: "20px",
                                                }}
                                            >
                                                <NavLink
                                                    to="/SignIn"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    Sign In
                                                </NavLink>
                                            </li>
                                        )}
                                    </ul>
                                </nav>
                            </animated.div>
                            <Dialog
                                open={openQr}
                                onClose={() => setOpenQr(false)}
                                aria-labelledby="qr-code-dialog-title"
                                fullWidth={true}
                                maxWidth="sm"
                                sx={{
                                    background: "rgba(255,255,255, 0.5)",
                                    borderBottomLeftRadius: "20px",
                                    borderBottomRightRadius: "20px",
                                }}
                            >
                                <Box
                                    sx={{
                                        background: "#f4f4f4",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        paddingBottom: "20px",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: "100%",
                                            background: "transparent",
                                            display: "flex",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <IconButton
                                            onClick={() => setOpenQr(false)}
                                            sx={{
                                                background: "rgba(0,5,0, 0.5)",
                                            }}
                                        >
                                            <CloseIcon sx={{ color: "#000" }} />
                                        </IconButton>
                                    </Box>
                                    <Typography variant="" component="div">
                                        Comparte con tu circulo social
                                    </Typography>
                                    <Card>
                                        <CardActionArea>
                                            <CardContent>
                                                <QRCode
                                                    value={url}
                                                    size={Math.min(window.innerWidth * 0.6, 156)}
                                                    level={"L"}
                                                />
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Box>
                            </Dialog>
                        </Toolbar>
                    </AppBar>
                    <Box sx={{ marginTop: 8, marginBottom: 4, width: "100%" }}>
                        <Quilted_image />
                    </Box>
                </ThemeProvider>
                <Footer />
            </animated.div>
        </>
    );
};

export default Home;
