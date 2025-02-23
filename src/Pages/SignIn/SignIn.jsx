import React, { useState } from "react";
import {
    AppBar,
    TextField,
    IconButton,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    Snackbar, Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Data/FirebaseConfig";
import { ArrowBack, Login } from "@mui/icons-material";
import { useSpring, animated } from "@react-spring/web";
import { EmailOutlined, LockOutlined } from "@mui/icons-material";
import ParticleBackground from "../Developer/ParticleBackground";

function SignIn() {
    //Constante para navegar
    const navegationrender = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [loginError, setLoginError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSignIn = () => {
        if (!credentials.email || !credentials.password) {
            setLoginError("Por favor, introduce tu correo electrónico y contraseña.");
            return;
        }

        signInWithEmailAndPassword(auth, credentials.email, credentials.password)
            .then((userCredential) => {
                // Inicio de sesión exitoso
                setLoginError("");
                setOpenSnackbar(true); // Mostrar Snackbar
                navegationrender("/");
            })
            .catch((error) => {
                const errorCode = error.code;
                let errorMessage = "Error al intentar iniciar sesión.";

                // Puedes personalizar el mensaje de error basado en errorCode
                if (errorCode === "auth/wrong-password") {
                    errorMessage = "Contraseña incorrecta.";
                } else if (errorCode === "auth/user-not-found") {
                    errorMessage = "Usuario no encontrado.";
                } else if (errorCode === "auth/invalid-email") {
                    errorMessage = "Formato de correo electrónico inválido.";
                }

                setLoginError(errorMessage);
            });
    };

    const handleBack = () => {
        navegationrender("/");
    };

    const fadeIn = useSpring({
        to: { opacity: 1, transform: "translateY(0)" },
        from: { opacity: 0, transform: "translateY(20px)" },
        delay: 200,
    });

    return (
        <>
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
                    <IconButton onClick={handleBack} aria-label="Regresar">
                        <ArrowBack sx={{ color: 'black' }} fontSize="32px" />
                    </IconButton>
                    <Typography sx={{
                        fontFamily: "'Poppins', sans-serif",
                        color: '#000',
                        fontWeight: "bold",
                        fontSize: "1.3rem",
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                    }}>Iniciar Sesión</Typography>
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
            <Container
                sx={{ mt: -80, position: "relative", zIndex: 1, }}
                maxWidth="50%"

            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        sx={{ "& > :not(style)": { m: 1, width: "300px" } }}
                    >
                        <animated.div style={fadeIn}>
                            <Card

                                raised
                                sx={{
                                    background: "#f4f4f4",
                                    borderRadius: 6,
                                    width: "100%",
                                    display: "flex",
                                }}
                            >
                                <CardContent sx={{ width: "100%" }}>
                                    <Grid
                                        container
                                        spacing={2}
                                        direction="column"
                                        sx={{ width: "100%" }}
                                    >
                                        <Grid item xs={12}>
                                            <Typography sx={{
                                                fontFamily: "'Poppins', sans-serif",
                                                color: '#000',
                                                fontWeight: "bold",
                                                fontSize: "1.3rem",
                                                display: "flex",
                                                width: "100%",
                                            }}>Correo Electrónico:</Typography>
                                            <TextField
                                                variant="standard"
                                                name="email"
                                                value={credentials.email}
                                                onChange={handleInputChange}
                                                margin="normal"
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: <EmailOutlined sx={{ color: "black", mr: 1 }} />,
                                                    disableUnderline: false,
                                                }}
                                                sx={{
                                                    "& .MuiInput-underline:before": { borderBottomColor: "black" }, // Borde normal
                                                    "& .MuiInput-underline:hover:before": { borderBottomColor: "black" }, // Hover
                                                    "& .MuiInput-underline:after": { borderBottomColor: "black", borderWidth: 2 }, // Focus
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sx={{ width: "100%" }}>
                                            <Typography sx={{
                                                fontFamily: "'Poppins', sans-serif",
                                                color: '#000',
                                                fontWeight: "bold",
                                                fontSize: "1.3rem",

                                                display: "flex",

                                                width: "100%",
                                            }}>Contraseña:</Typography>
                                            <TextField
                                                variant="standard"
                                                type="password"
                                                name="password"
                                                value={credentials.password}
                                                onChange={handleInputChange}
                                                margin="normal"
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: <LockOutlined sx={{ color: "black", mr: 1 }} />,
                                                    disableUnderline: false,
                                                }}
                                                sx={{
                                                    "& .MuiInput-underline:before": { borderBottomColor: "black" },
                                                    "& .MuiInput-underline:hover:before": { borderBottomColor: "black" },
                                                    "& .MuiInput-underline:after": { borderBottomColor: "black", borderWidth: 2 },
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                            <Button
                                                onClick={handleSignIn}
                                                variant="contained"
                                                sx={{ mt: 2, background: "black", justifyContent: "space-between" }}
                                            >
                                                Iniciar Sesión  <Login />
                                            </Button>

                                            {loginError && (
                                                <Box sx={{ color: "red", mt: 2 }}>
                                                    {loginError}
                                                </Box>
                                            )}
                                            {/* Snackbar para mostrar "Bienvenido" */}
                                            <Snackbar
                                                open={openSnackbar}
                                                autoHideDuration={3000}
                                                onClose={() => setOpenSnackbar(false)}
                                                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                                            >
                                                <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
                                                    ¡Bienvenido!
                                                </Alert>
                                            </Snackbar>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </animated.div>
                    </Box>
                </Box>
            </Container>
        </>
    );
}

export default SignIn;
