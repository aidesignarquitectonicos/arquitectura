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
import { signOut } from "firebase/auth";
import { auth } from "../../Data/FirebaseConfig"; // Asegúrate de que este es el camino correcto a tu configuración de Firebase donde inicializas `auth`
import QRCode from "qrcode.react";
import CloseIcon from "@mui/icons-material/Close";
import { MenuOutlined } from "@mui/icons-material";
import { useSpring, animated } from "react-spring";
// import Quilted_image from "../../Components/Quiltedimage/Quilted_image";
import "./Home.css";
// import ParticleCanvas from "../../Components/HouseRender/Particles";
import { getDatabase, ref, get } from "firebase/database";
import { sample, shuffle } from "lodash";
 

const Home = () => {
    const url = "https://aidesignarquitectonicos.github.io/arquitectura/";
    const [openQr, setOpenQr] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                console.log("Cierre de sesión exitoso");
                navigate("/");
            })
            .catch((error) => {
                console.error("Error al cerrar sesión", error);
            });
    };

    const isAuthenticated = !!user;

    useEffect(() => {
        const fetchProjectVideos = async () => {
            const storedProjects = localStorage.getItem("projects");
            if (storedProjects) {
                const parsedProjects = JSON.parse(storedProjects);
                setProjects(parsedProjects);
                selectRandomVideo(parsedProjects);
            } else {
                const database = getDatabase();
                const projectRefVideo = ref(database, "Projects");
                const snapshot = await get(projectRefVideo);
                if (snapshot.exists()) {
                    const projectData = snapshot.val();
                    const updatedProjects = Object.keys(projectData).map((key) => ({
                        uuid: key,
                        ...projectData[key],
                    }));
                    setProjects(updatedProjects);
                    localStorage.setItem("projects", JSON.stringify(updatedProjects));
                    selectRandomVideo(updatedProjects);
                } else {
                    console.log("No se encontró el proyecto.");
                }
            }
        };
        fetchProjectVideos();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return unsubscribe;
    }, []);

    const selectRandomVideo = (projects) => {
        const allVideos = projects.flatMap((project) => project.videos || []);
        if (allVideos.length > 0) {
            setCurrentVideo(sample(allVideos));
        }
    };

    // Animaciones con react-spring
    const fade = useSpring({ from: { opacity: 0 }, opacity: 1, delay: 500 });
    const menuAnimation = useSpring({
        transform: menuOpen ? "translateX(0%)" : "translateX(-100%)",
    });

    return (

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
                            <IconButton onClick={() => setMenuOpen(!menuOpen)}>
                                <Avatar src={logo} />
                            </IconButton>
                        ) : (
                            <IconButton onClick={() => setMenuOpen(!menuOpen)}>
                                <MenuOutlined />
                            </IconButton>
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
                                    borderRadius: "20px",
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
                                            Proyectos
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
                                    <li
                                        style={{
                                            borderBottom: "1px solid #8887875E",
                                            padding: "20px",
                                        }}
                                    ><NavLink to="/Developer" onClick={() => setMenuOpen(false)}>
                                            Desarrollador de Software
                                        </NavLink>
                                    </li>
                                    {isAuthenticated && (
                                        <li
                                            style={{
                                                borderBottom: "1px solid #8887875E",
                                                padding: "20px",
                                            }}
                                        >
                                            <NavLink to="/Upload" onClick={() => setMenuOpen(false)}>
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
                                            <NavLink to="/SignIn" onClick={() => setMenuOpen(false)}>
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
                                            background: "transparent",
                                        }}
                                    >
                                        <CloseIcon sx={{ color: "#000" }} />
                                    </IconButton>
                                </Box>
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
                <Box
                    sx={{
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                    }}
                >
                    {currentVideo && (
                        <video
                            width="100%"
                            height="100%"
                            autoPlay
                            loop
                            muted
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "cover",
                                borderRadius: 20,
                            }}
                            src={currentVideo}
                        />
                    )}
                    <Box
                        sx={{
                            position: "absolute",
                            width: "100%",
                            padding: 5,
                            borderRadius: 10,
                            textAlign: "center",
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: "rgba(255, 2550, 255, 0.3)",
                                width: "100%",
                                borderRadius: 10,
                                padding: 7,
                            }}
                        >
                            <Typography sx={{ color: "#1A2437", fontWeight: 'bold' }} variant="h4" component="div" color="white">
                                Con AIDesign, ¡Todo es Posible!
                            </Typography>
                            <Typography
                                sx={{ marginTop: 8, color: "#251B1B", fontWeight: 'bold' }}
                                variant="h8"
                                component="div"
                            >
                                El diseñar es la forma de organizar y adaptar responsablemente un espacio en la naturaleza
                            </Typography>
                        </Box>
                    </Box>
                </Box>

            </ThemeProvider>
            <Footer />
        </animated.div>
    );
};

export default Home;
