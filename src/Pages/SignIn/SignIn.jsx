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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Data/FirebaseConfig";
import { ArrowBack } from "@mui/icons-material";
function SignIn() {
    //Constante para navegar
    const navegationrender = useNavigate();

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
        navegationrender(-1);
    };

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    background: "#f4f4f4",
                    color: "#000",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar>
                    <IconButton onClick={handleBack} aria-label="Regresar">
                        <ArrowBack fontSize="32px" />
                    </IconButton>
                    <Typography>Gallery</Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm" sx={{
                overflowY: 'auto',
                padding: '20px',
                marginTop: 8,
                marginBottom: 4
            }}>
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
                        sx={{ "& > :not(style)": { m: 1, width: "100%" } }}
                    >
                        <Grid
                            container
                            spacing={2}
                            direction="column"
                            alignItems="center"
                            justify="center"
                        >
                            <Grid item xs={12}>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    name="email"
                                    value={credentials.email}
                                    onChange={handleInputChange}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Password"
                                    variant="outlined"
                                    type="password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleInputChange}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    onClick={handleSignIn}
                                    variant="contained"
                                    sx={{ mt: 2 }}
                                >
                                    Sign In
                                </Button>
                                {loginError && (
                                    <Box sx={{ color: "red", mt: 2 }}>{loginError}</Box>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
}

export default SignIn;
