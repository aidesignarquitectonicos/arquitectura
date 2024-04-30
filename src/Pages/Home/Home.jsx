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
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from "@mui/material";
import theme from "../../Themes/theme";
import logo from "../../Assets/icono.png";
import Footer from "../../Pages/Footer/Footer";
import { useNavigate } from "react-router-dom";
//import Content from "../../Components/Content/Content";
import GalleryView from '../../Components/View/GalleryView';
import { signOut } from "firebase/auth";
import { auth } from "../../Data/FirebaseConfig"; // Asegúrate de que este es el camino correcto a tu configuración de Firebase donde inicializas `auth`
import QRCode from 'qrcode.react';
import CloseIcon from '@mui/icons-material/Close';
import { MenuOutlined } from "@mui/icons-material";

const Home = () => {

    //Constante URL
    const url = "https://aidesignarquitectonicos.github.io/arquitectura/";
    const [open, setOpen] = useState(false);

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
        setOpen(false);
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

    const handleQr = () => {
        setOpen(true);
    }

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
                        {isAuthenticated ? (
                            <>
                                <IconButton onClick={handleClick}>
                                    <Avatar src={logo} />
                                </IconButton>
                            </>) : (
                            <>
                                <IconButton onClick={handleClick}>
                                    <MenuOutlined />
                                </IconButton>
                            </>
                        )}

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
                            {isAuthenticated && <MenuItem onClick={handleClose}>{user.email || "Usuario"}</MenuItem>}
                            <MenuItem onClick={handleGallery}>Galeria</MenuItem>
                            <MenuItem onClick={() => {
                                navegationrender("/About");
                            }}>Acerca de</MenuItem>
                            <MenuItem onClick={handleQr}>Codigo Qr</MenuItem>
                            <Dialog

                                open={open}
                                onClose={handleClose}
                                aria-labelledby="qr-code-dialog-title"
                                fullWidth={true}
                                maxWidth="sm"

                            >
                                <div style={{
                                    background: "#f4f4f4",
                                    display: 'flex', justifyContent: 'flex-end',
                                }}>
                                    <IconButton onClick={handleClose}>
                                        <CloseIcon sx={{ color: '#000' }} />
                                    </IconButton>
                                </div>
                                <div style={{
                                    background: "#f4f4f4",
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', paddingBottom: '20px'
                                }}>
                                    <Typography variant="" component="div">
                                        Comparte con tu circulo social
                                    </Typography>
                                    <Card>
                                        <CardActionArea>
                                            <CardContent>
                                                <QRCode value={url} size={Math.min(window.innerWidth * 0.6, 156)} level={"L"} />
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </div>
                            </Dialog>
                            {isAuthenticated && <MenuItem onClick={handleUpload}>Upload</MenuItem>}
                            {isAuthenticated ? (
                                <>
                                    <MenuItem onClick={handleSignOut}>Cerrar sesión</MenuItem>
                                </>
                            ) : (
                                <MenuItem onClick={handleSignIn}>Sign In</MenuItem>
                            )}
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Box sx={{ marginTop: 8, marginBottom: 4 }}>
                    <GalleryView />
                </Box>
            </ThemeProvider>
            <Footer />
        </>
    )
}

export default Home;