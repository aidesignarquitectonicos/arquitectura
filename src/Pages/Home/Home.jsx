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
    Grid,
    Container,
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
import {
    PhotoLibrary
} from "@mui/icons-material";
import { useSpring, animated } from "react-spring";
// import Quilted_image from "../../Components/Quiltedimage/Quilted_image";
import "./Home.css";
// import ParticleCanvas from "../../Components/HouseRender/Particles";
import { getDatabase, ref, get } from "firebase/database";
import { sample } from "lodash";


const Home = () => {
    const url = "https://aidesignarquitectonicos.github.io/arquitectura/";
    const [openQr, setOpenQr] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [randomProjects, setRandomProjects] = useState([]);

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
                selectRandomProjects(parsedProjects);
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
                    selectRandomProjects(updatedProjects);
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

    const selectRandomProjects = (projects) => {
        if (projects.length > 0) {
            const shuffledProjects = projects.sort(() => 0.5 - Math.random());
            const selectedProjects = shuffledProjects.slice(0, 3);
            console.log("Proyectos seleccionados:", selectedProjects); // Debug
            setRandomProjects(selectedProjects); // Selecciona 3 proyectos aleatorios
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
                <Box
                    sx={{
                        width: "100vw",
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        padding: { xs: 2, sm: 4, md: 6 },
                    }}
                >
                    {/* Título de la sección */}
                    <Typography sx={{
                        color: "#1A2437", fontWeight: 'bold', marginBottom: 4,
                        textAlign: "center",
                    }} variant="h4" component="div" color="white">
                        Proyectos Destacados
                    </Typography>

                    {/* Grid de proyectos aleatorios */}
                    <Container maxWidth="lg">
                        <Grid container spacing={4} justifyContent="center">
                            {randomProjects.length > 0 ? (
                                randomProjects.map((project, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={project.uuid || index}>
                                        <Card
                                            sx={{
                                                height: 280,
                                                display: "flex",
                                                flexDirection: "column",
                                                background: "#f0f0f0",
                                                borderRadius: "20px",
                                                boxShadow: "8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff",
                                                border: "none",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                overflow: "hidden",
                                                "&:hover": {
                                                    boxShadow: "4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff",
                                                    transform: "translateY(-2px)",
                                                },
                                                "&:active": {
                                                    boxShadow: "inset 4px 4px 8px #d1d1d1, inset -4px -4px 8px #ffffff",
                                                    transform: "translateY(0px)",
                                                },
                                            }}
                                            onClick={() => navigate(`/project/${project.uuid}`)}
                                        >
                                            {/* Imagen del proyecto */}
                                            <Box
                                                sx={{
                                                    height: 180,
                                                    overflow: "hidden",
                                                    position: "relative",
                                                    borderRadius: "20px 20px 0 0",
                                                }}
                                            >
                                                {project.images && project.images.length > 0 ? (
                                                    <img
                                                        src={typeof project.images[0] === 'string' ? project.images[0] : (project.images[0].url || project.images[0])}
                                                        alt={project.field1 || "Proyecto"}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                        onError={(e) => {
                                                            console.log("Error cargando imagen:", project.images[0]);
                                                            console.log("Tipo de imagen:", typeof project.images[0]);
                                                            console.log("Proyecto completo:", project);
                                                        }}
                                                    />
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            width: "100%",
                                                            height: "100%",
                                                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            flexDirection: "column",
                                                        }}
                                                    >
                                                        <PhotoLibrary
                                                            sx={{
                                                                fontSize: 60,
                                                                color: "white",
                                                                opacity: 0.7,
                                                                marginBottom: 1,
                                                            }}
                                                        />
                                                        <Typography variant="caption" color="white" sx={{ opacity: 0.7 }}>
                                                            {project.images ? `${project.images.length} imágenes` : "Sin imágenes"}
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {/* Overlay con gradiente */}
                                                <Box
                                                    sx={{
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.3) 100%)",
                                                    }}
                                                />
                                            </Box>

                                            {/* Contenido del proyecto */}
                                            <CardContent sx={{ padding: 2, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                    color="#333"
                                                    sx={{
                                                        textAlign: "center",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        marginBottom: 1,
                                                    }}
                                                >
                                                    {project.field1 || "Proyecto Sin Nombre"}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="#666"
                                                    sx={{
                                                        textAlign: "center",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {project.role || "Arquitectura"}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                // Placeholder mientras cargan los proyectos
                                [1, 2, 3].map((placeholder) => (
                                    <Grid item xs={12} sm={6} md={4} key={placeholder}>
                                        <Card
                                            sx={{
                                                height: 280,
                                                display: "flex",
                                                flexDirection: "column",
                                                background: "#f0f0f0",
                                                borderRadius: "20px",
                                                boxShadow: "8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff",
                                                border: "none",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    height: 180,
                                                    background: "linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <PhotoLibrary
                                                    sx={{
                                                        fontSize: 60,
                                                        color: "#ccc",
                                                    }}
                                                />
                                            </Box>
                                            <CardContent sx={{ padding: 2, textAlign: "center" }}>
                                                <Typography variant="h6" color="#ccc">
                                                    Cargando proyecto...
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            )}
                        </Grid>

                        {/* Botón para ver todos los proyectos */}
                        <Box sx={{ textAlign: "center", marginTop: 4 }}>
                            <Card
                                sx={{
                                    display: "inline-block",
                                    background: "#f0f0f0",
                                    borderRadius: "20px",
                                    boxShadow: "8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff",
                                    border: "none",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        boxShadow: "4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff",
                                        transform: "translateY(-2px)",
                                    },
                                    "&:active": {
                                        boxShadow: "inset 4px 4px 8px #d1d1d1, inset -4px -4px 8px #ffffff",
                                        transform: "translateY(0px)",
                                    },
                                }}
                                onClick={() => navigate("/Gallery")}
                            >
                                <CardContent sx={{ padding: "16px 32px" }}>
                                    <Typography
                                        variant="body1"
                                        fontWeight="bold"
                                        sx={{
                                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            backgroundClip: "text",
                                        }}
                                    >
                                        Ver Todos los Proyectos
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Container>

                </Box>
                <Box
                    sx={{
                        width: "100%",
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        padding: { xs: 3, sm: 4, md: 6 },
                        borderRadius: "20px",
                    }}
                >
                    {/* Título de la sección */}
                    <Typography
                        sx={{
                            color: "#1A2437",
                            fontWeight: 'bold',
                            marginBottom: 2,
                            textAlign: "center",
                        }}
                        variant="h4"
                        component="h2"
                    >
                        Testimonios
                    </Typography>

                    <Typography
                        sx={{
                            color: "#666",
                            marginBottom: 4,
                            textAlign: "center",
                            fontSize: "1.1rem",
                            maxWidth: "600px"
                        }}
                        variant="subtitle1"
                        component="p"
                    >
                        La experiencia de nuestros clientes habla por sí sola
                    </Typography>

                    {/* Grid de testimonios */}
                    <Container maxWidth="lg" sx={{ mb: 4 }}>
                        <Grid container spacing={3} justifyContent="center">
                            {/* Testimonio 1 */}
                            <Grid item xs={12} md={4}>
                                <Card
                                    sx={{
                                        height: { xs: 'auto', md: 350 },
                                        minHeight: 300,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        textAlign: "left",
                                        background: "transparent",
                                        padding: "25px",
                                        borderRadius: "15px",
                                        border: "1px solid #667eea",
                                        boxShadow: "none",
                                        gap: "2.25em",
                                        position: "relative",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-5px)",
                                            boxShadow: "0 10px 30px rgba(102, 126, 234, 0.15)",
                                            borderColor: "#764ba2",
                                        },
                                    }}
                                >
                                    <Box sx={{ width: "100%", textAlign: "left" }}>
                                        <Typography
                                            sx={{
                                                color: "#667eea",
                                                opacity: 0.6,
                                                fontSize: "3rem",
                                                lineHeight: 1,
                                                fontFamily: 'serif',
                                                marginBottom: "1rem"
                                            }}
                                        >
                                            "
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: "#242424",
                                                fontStyle: "italic",
                                                lineHeight: 1.6,
                                                fontSize: "1rem",
                                                marginBottom: "2rem"
                                            }}
                                        >
                                            "El equipo de AIDesign transformó completamente nuestra visión en realidad. Su atención al detalle y creatividad superaron nuestras expectativas."
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%" }}>
                                        <Avatar
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                fontSize: "1.2rem",
                                                fontWeight: "bold",
                                                color: "white"
                                            }}
                                        >
                                            MG
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold" color="#242424" sx={{ fontSize: "1rem", marginBottom: "0.25rem" }}>
                                                María González
                                            </Typography>
                                            <Typography variant="body2" color="#666" sx={{ fontSize: "0.9rem" }}>
                                                Propietaria de Casa Moderna
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>

                            {/* Testimonio 2 */}
                            <Grid item xs={12} md={4}>
                                <Card
                                    sx={{
                                        height: { xs: 'auto', md: 350 },
                                        minHeight: 300,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        textAlign: "left",
                                        background: "transparent",
                                        padding: "25px",
                                        borderRadius: "15px",
                                        border: "1px solid #667eea",
                                        boxShadow: "none",
                                        gap: "2.25em",
                                        position: "relative",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-5px)",
                                            boxShadow: "0 10px 30px rgba(102, 126, 234, 0.15)",
                                            borderColor: "#764ba2",
                                        },
                                    }}
                                >
                                    <Box sx={{ width: "100%", textAlign: "left" }}>
                                        <Typography
                                            sx={{
                                                color: "#667eea",
                                                opacity: 0.6,
                                                fontSize: "3rem",
                                                lineHeight: 1,
                                                fontFamily: 'serif',
                                                marginBottom: "1rem"
                                            }}
                                        >
                                            "
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: "#242424",
                                                fontStyle: "italic",
                                                lineHeight: 1.6,
                                                fontSize: "1rem",
                                                marginBottom: "2rem"
                                            }}
                                        >
                                            "Profesionalismo excepcional y diseños innovadores. Cada espacio refleja funcionalidad y belleza en perfecta armonía."
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%" }}>
                                        <Avatar
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                fontSize: "1.2rem",
                                                fontWeight: "bold",
                                                color: "white"
                                            }}
                                        >
                                            CM
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold" color="#242424" sx={{ fontSize: "1rem", marginBottom: "0.25rem" }}>
                                                Carlos Mendoza
                                            </Typography>
                                            <Typography variant="body2" color="#666" sx={{ fontSize: "0.9rem" }}>
                                                Director de Oficinas Corporativas
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>

                            {/* Testimonio 3 */}
                            <Grid item xs={12} md={4}>
                                <Card
                                    sx={{
                                        height: { xs: 'auto', md: 350 },
                                        minHeight: 300,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        textAlign: "left",
                                        background: "transparent",
                                        padding: "25px",
                                        borderRadius: "15px",
                                        border: "1px solid #667eea",
                                        boxShadow: "none",
                                        gap: "2.25em",
                                        position: "relative",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-5px)",
                                            boxShadow: "0 10px 30px rgba(102, 126, 234, 0.15)",
                                            borderColor: "#764ba2",
                                        },
                                    }}
                                >
                                    <Box sx={{ width: "100%", textAlign: "left" }}>
                                        <Typography
                                            sx={{
                                                color: "#667eea",
                                                opacity: 0.6,
                                                fontSize: "3rem",
                                                lineHeight: 1,
                                                fontFamily: 'serif',
                                                marginBottom: "1rem"
                                            }}
                                        >
                                            "
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: "#242424",
                                                fontStyle: "italic",
                                                lineHeight: 1.6,
                                                fontSize: "1rem",
                                                marginBottom: "2rem"
                                            }}
                                        >
                                            "La tecnología AI aplicada al diseño arquitectónico es impresionante. Obtuvimos resultados que jamás habríamos imaginado."
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%" }}>
                                        <Avatar
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                fontSize: "1.2rem",
                                                fontWeight: "bold",
                                                color: "white"
                                            }}
                                        >
                                            AR
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold" color="#242424" sx={{ fontSize: "1rem", marginBottom: "0.25rem" }}>
                                                Ana Rodríguez
                                            </Typography>
                                            <Typography variant="body2" color="#666" sx={{ fontSize: "0.9rem" }}>
                                                Arquitecta e Inversionista
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>

                    {/* Estadísticas */}
                    <Container maxWidth="lg">
                        <Box
                            sx={{
                                mt: 4,
                                p: 3,
                                background: "rgba(255, 255, 255, 0.3)",
                                borderRadius: "15px",
                                backdropFilter: "blur(10px)",
                                marginBottom: 8,
                            }}
                        >
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                color="#1A2437"
                                textAlign="center"
                                sx={{ mb: 3 }}
                            >
                                Nuestros Números
                            </Typography>
                            <Grid container spacing={3} justifyContent="center">
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: "center" }}>
                                        <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                            sx={{
                                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                backgroundClip: "text",
                                                fontSize: { xs: "2rem", md: "2.5rem" }
                                            }}
                                        >
                                            25+
                                        </Typography>
                                        <Typography variant="body1" color="#666" sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                                            Proyectos Completados
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: "center" }}>
                                        <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                            sx={{
                                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                backgroundClip: "text",
                                                fontSize: { xs: "2rem", md: "2.5rem" }
                                            }}
                                        >
                                            100%
                                        </Typography>
                                        <Typography variant="body1" color="#666" sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                                            Clientes Satisfechos
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: "center" }}>
                                        <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                            sx={{
                                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                backgroundClip: "text",
                                                fontSize: { xs: "2rem", md: "2.5rem" }
                                            }}
                                        >
                                            5★
                                        </Typography>
                                        <Typography variant="body1" color="#666" sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                                            Calificación Promedio
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: "center" }}>
                                        <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                            sx={{
                                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                backgroundClip: "text",
                                                fontSize: { xs: "2rem", md: "2.5rem" }
                                            }}
                                        >
                                            3+
                                        </Typography>
                                        <Typography variant="body1" color="#666" sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                                            Años de Experiencia
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Container>
                </Box>
            </ThemeProvider>
            <Footer />
        </animated.div>
    );
};

export default Home;
