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
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import logo from "../../Assets/Anth.png";
import fondo_anth from "../../Assets/Video/found.mp4";
import { Facebook, Instagram, WhatsApp } from "@mui/icons-material";
import CardCover from '@mui/joy/CardCover';

const Developer = () => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");
    const navigate = useNavigate();

    const [personalInfo, setPersonalInfo] = useState({
        name: "Anthony Cordova",
        profession: "Software Developer",
        description: "Desarrollador web y móvil con amplia experiencia en la creación de aplicaciones innovadoras y funcionales. Su enfoque en el diseño limpio y la eficiencia de código garantiza soluciones tecnológicas de alta calidad.",
        socialLinks: {
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

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <animated.div style={{ opacity }}>
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
                <Toolbar>
                    <IconButton onClick={() => navigate("/")} aria-label="Regresar">
                        <ArrowBack fontSize="32px" />
                    </IconButton>
                    <Typography>Software Developer</Typography>
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
                }}
            >
                <CardCover sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: 'center',
                }}>
                    <video
                        width="100%"
                        height="100%"
                        autoPlay
                        loop
                        muted
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            zIndex: -1,
                        }}
                    >
                        <source
                            src={fondo_anth}
                            type="video/mp4"
                        />
                    </video>
                </CardCover>
            </Box>
            <Container sx={{ mt: -80, position: "relative", zIndex: 1 }}>
                <Card
                    raised
                    sx={{
                        marginTop: 5,
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        background: "rgba(255, 255, 255, 0.9)",
                        mx: "auto",
                        borderTopLeftRadius: "20px",
                        borderTopRightRadius: "20px",
                        borderBottomLeftRadius: "20px",
                        borderBottomRightRadius: "20px",
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', p: 3
                    }}
                >
                    <Avatar
                        src={logo}
                        sx={{ width: 100, height: 100, mb: 2 }}
                    />
                    <Typography variant="h5">{personalInfo.name}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">{personalInfo.profession}</Typography>
                    <Typography variant="body1" sx={{ mt: 1, textAlign: 'center' }}>{personalInfo.description}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <IconButton component={Link}
                            href={personalInfo.socialLinks.facebook}
                            target="_blank"
                            sx={{ color: '#3b5998' }}>
                            <Facebook />
                        </IconButton>
                        <IconButton
                            component={Link}
                            href={personalInfo.socialLinks.instagram}
                            target="_blank"
                            sx={{ color: '#E4405F' }}>
                            <Instagram />
                        </IconButton>
                        <IconButton component={Link}
                            href={personalInfo.socialLinks.whatsapp}
                            target="_blank"
                            sx={{ color: '#25D366' }}>
                            <WhatsApp />
                        </IconButton>
                    </Box>
                </Card>
            </Container>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </animated.div>
    );
};

export default Developer;
