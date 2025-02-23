import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Container,
    Snackbar,
    Alert,
    Card,
    Box,
    Link,
    Avatar,
} from "@mui/material";
import { ArrowBack, LinkedIn, Share } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
import logo from "../../Assets/Anth.png";
import { Facebook, Instagram, WhatsApp } from "@mui/icons-material";
import ParticleBackground from "./ParticleBackground";


const pastelColors = {
    lightBlue: "#A7C7E7",  // Azul suave
    lightPink: "#F2D1D1",  // Rosa suave
    lightGreen: "#D1E7D1", // Verde suave
    beige: "#F1F0F0",      // Beige claro
};

const Developer = () => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");

    const [personalInfo, setPersonalInfo] = useState({
        name: "Anthony Cordova",
        profession: "Software Developer",
        description: "Desarrollador web y móvil con amplia experiencia en la creación de aplicaciones innovadoras y funcionales. Su enfoque en el diseño limpio y la eficiencia de código garantiza soluciones tecnológicas de alta calidad.",
        socialLinks: {
            linkedin: "https://www.linkedin.com/in/anthony-c-a12928111/",
            facebook: "https://www.facebook.com/profile.php?id=100095502885829&mibextid=ZbWKwL",
            instagram: "https://www.instagram.com/thony_cm_18?igsh=cnZibmJ0bmN3ajVm",
            whatsapp: "https://wa.me/qr/FNSLSZHWS3CFM1",
        }
    });

    const { opacity } = useSpring({
        from: { opacity: 0 },
        opacity: 1,
        delay: 500,
    });


    const iconAnimation = useSpring({
        from: { transform: 'scale(0)' },
        to: { transform: 'scale(1)' },
        config: { tension: 200, friction: 15 },
        delay: 1000,
    });

    const cardAnimation = useSpring({
        opacity: 1,
        from: { opacity: 0 },
        transform: 'translateY(20px)',
        to: { opacity: 1, transform: 'translateY(0)' },
        delay: 1500,
    });

    const titleAnimation = useSpring({
        opacity: 1,
        from: { opacity: 0, transform: 'translateY(-20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        delay: 2000,
    });

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleShare = () => {
        const shareData = {
            title: `${personalInfo.name} - ${personalInfo.profession}`,
            text: `Descubre más sobre ${personalInfo.name}
Profesión: ${personalInfo.profession}
Descripción: ${personalInfo.description}
Imagen: https://aidesignarquitectonicos.github.io/arquitectura/static/media/Anth.87f9a465889eeaa9e533.png`,
            url: window.location.href, // URL actual de la página
        };
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log("Compartido exitosamente"))
                .catch((error) => console.error("Error al compartir", error));
        } else {
            alert("Tu navegador no soporta la funcionalidad de compartir.");
        }
    };

    const handleBack = () => {
        window.location.href = 'https://aidesignarquitectonicos.github.io/arquitectura/';
    };

    return (
        <animated.div style={{ opacity }}>

            <AppBar
                position="fixed"
                sx={{
                    background: "#f4f4f4",
                    color: "#000000FF",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    borderBottomLeftRadius: "20px",
                    borderBottomRightRadius: "20px",
                    textAlign: "center",

                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <IconButton
                        onClick={handleBack}
                        aria-label="Regresar" sx={{ color: "#000000FF" }}>
                        <ArrowBack fontSize="32px" />
                    </IconButton>
                    <Typography sx={{
                        fontFamily: "'Poppins', sans-serif",
                        color: '#000',
                        fontWeight: "bold",
                        fontSize: "1.3rem",
                    }}>Software Developer</Typography>
                    <IconButton
                        onClick={handleShare}
                        aria-label="Compartir"
                        sx={{ color: "#000000FF" }}>
                        <Share fontSize="32px" sx={{ color: 'green' }} />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    position: "relative",
                    zIndex: 0,
                    background: "#f4f4f4",
                }}
            >
                <ParticleBackground />
            </Box>
            <Container sx={{ mt: -80, position: "relative", zIndex: 1 }}>
                {/* Card animada */}
                <animated.div style={cardAnimation}>
                    <Card
                        raised
                        elevation={5}
                        sx={{
                            marginTop: 5,
                            zIndex: (theme) => theme.zIndex.drawer + 1,
                            background: "#f4f4f4", // Fondo con opacidad suave
                            mx: "auto",
                            borderRadius: "20px",
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 3,
                            boxShadow: 5, // Añadir sombra para mayor contraste
                        }}
                    >
                        <Avatar
                            src={logo}
                            sx={{ width: 100, height: 100, mb: 2 }}
                        />
                        <animated.div style={titleAnimation}>
                            <Typography variant="h5" sx={{ fontFamily: "'Poppins', sans-serif", color: '#000' }}>
                                {personalInfo.name}
                            </Typography>
                        </animated.div>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ fontFamily: "'Poppins', sans-serif", color: "grey" }}>
                            {personalInfo.profession}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, textAlign: 'center', fontFamily: "'Poppins', sans-serif", color: "grey" }}>
                            {personalInfo.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <animated.div style={iconAnimation}>
                                <IconButton component={Link}
                                    href={personalInfo.socialLinks.linkedin}
                                    target="_blank"
                                    sx={{ color: '#2548D3FF' }}>
                                    <LinkedIn />
                                </IconButton>
                            </animated.div>
                            <animated.div style={iconAnimation}>
                                <IconButton component={Link}
                                    href={personalInfo.socialLinks.facebook}
                                    target="_blank"
                                    sx={{ color: '#3b5998' }}>
                                    <Facebook />
                                </IconButton>
                            </animated.div>
                            <animated.div style={iconAnimation}>
                                <IconButton
                                    component={Link}
                                    href={personalInfo.socialLinks.instagram}
                                    target="_blank"
                                    sx={{ color: '#E4405F' }}>
                                    <Instagram />
                                </IconButton>
                            </animated.div>
                            <animated.div style={iconAnimation}>
                                <IconButton component={Link}
                                    href={personalInfo.socialLinks.whatsapp}
                                    target="_blank"
                                    sx={{ color: '#25D366' }}>
                                    <WhatsApp />
                                </IconButton>
                            </animated.div>
                        </Box>
                    </Card>
                </animated.div>
            </Container>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{
                        width: "100%",
                        backgroundColor: pastelColors.lightPink, // Color pastel para el alerta
                        color: "#000",
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </animated.div>
    );
};

export default Developer;
