import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    AppBar,
    Toolbar,
    IconButton,
    CardActionArea,
    CardMedia,
    Container,
    TextField,
    Input,
    Snackbar,
    Alert,
} from "@mui/material";
import { onValue } from "firebase/database";
import {
    getStorage,
    ref as storageRef,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { getDatabase, ref as databaseRef, set } from "firebase/database";
import {
    ArrowBack,
    Edit,
    Save,
    Star,
    StarBorderOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import RenderImage from "../../Components/Render/RenderImage";
import { database } from "../../Data/FirebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AboutPage = () => {
    // Arreglo de colores por los que se ciclará
    const colors = [
        "#FAD2E1", // Rosado pastel
        "#C5E0DC", // Verde agua pastel
        "#F9E2AE", // Amarillo pastel
        "#E2E2FA", // Lavanda pastel
        "#AED9E0", // Celeste pastel
        "#F9D8D6", // Salmón pastel
        "#F6EAC2", // Beige pastel
        "#D8A7B1", // Rosa viejo pastel
        "#B5EAD7", // Menta pastel
    ];

    // Estado para controlar el índice del color actual
    const [colorIndex, setColorIndex] = useState(0);

    //controlador de alert
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");

    const handleSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
    };

    //navegation
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Este estado debe basarse en tu lógica de autenticación
    const [isEditing, setIsEditing] = useState(false);
    const [starActive] = useState(false);

    // Animaciones con react-spring
    const fade = useSpring({ from: { opacity: 0 }, opacity: 1, delay: 500 });
    const slide = useSpring({
        from: { transform: "translateY(-100px)" },
        transform: "translateY(0)",
        delay: 800,
    });

    const [personalInfo, setPersonalInfo] = useState({
        name: "",
        profession: "",
        description: "",
        image: "",
    });

    useEffect(() => {
        const personalInfoRef = databaseRef(database, "Admin"); // Asegúrate de que la ruta sea correcta
        onValue(personalInfoRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setPersonalInfo(data);
            }
        });

        // Escuchar cambios en el estado de autenticación
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true); // Usuario está logueado
            } else {
                setIsLoggedIn(false); // Usuario no está logueado
            }
        });
    }, []);

    const handleInputChange = (event, field) => {
        // Utiliza el nombre del campo para determinar qué parte del estado actualizar
        setPersonalInfo((prevState) => ({
            ...prevState,
            [field]: event.target.value,
        }));
    };

    //Archivos A SUBIR
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const storage = getStorage();
        const fileRef = storageRef(storage, `images/UserAdmin/${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Opcional: Manejo del progreso de la carga
            },
            (error) => {
                // Opcional: Manejo de errores de carga
                handleSnackbar("Error al subir archivo: " + error.message, "error");
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    handleSnackbar("Archivo disponible en: " + downloadURL, "success");
                    // Actualizar el estado y posteriormente la base de datos
                    setPersonalInfo((prevState) => ({
                        ...prevState,
                        image: downloadURL,
                    }));
                });
            }
        );
    };

    //Subida de datos
    const saveInfo = () => {
        const db = getDatabase();
        const infoRef = databaseRef(db, "Admin");
        set(infoRef, personalInfo)
            .then(() => {
                handleSnackbar("Datos guardados correctamente", "success");
                setIsEditing(false); // Desactiva el modo de edición después de guardar
            })
            .catch((error) => {
                handleSnackbar("Error al guardar los datos" + error.message, "success");
            });
    };

    //Funcion de edición
    const toggleEdit = () => {
        if (isLoggedIn) {
            setIsEditing(!isEditing); // Alterna el estado de edición si el usuario está logueado
        } else {
            // Actualiza el color del ícono si el usuario no está logueado
            setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
        }
    };

    return (
        <>
            <animated.div style={fade}>
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
                        <IconButton
                            onClick={() => {
                                navigate(-1);
                            }}
                            aria-label="Regresar"
                        >
                            <ArrowBack fontSize="32px" />
                        </IconButton>
                        <Typography>{`Acerca del  ${" "} ${personalInfo.name}`}</Typography>
                    </Toolbar>
                </AppBar>

                <Container>
                    <Box
                        maxWidth="sm"
                        sx={{
                            overflowY: "auto",
                            padding: "10px",
                            marginTop: 8,
                            marginBottom: 4,
                            maxWidth: "100%",
                            flexGrow: 1,
                        }}
                    >
                        <Grid
                            container
                            spacing={2}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Grid item xs={12} sm={6} md={4}>
                                <animated.div style={slide}>
                                    <Card
                                        sx={{
                                            zIndex: (theme) => theme.zIndex.drawer + 1,
                                            background: "#f4f4f4",
                                            mx: "auto",
                                            borderTopLeftRadius: "20px",
                                            borderTopRightRadius: "20px",
                                            borderBottomLeftRadius: "20px",
                                            borderBottomRightRadius: "20px",
                                        }}
                                    >
                                        <CardContent>
                                            {isEditing ? (
                                                <IconButton onClick={saveInfo} aria-label="Guardar">
                                                    <Save sx={{ color: "rgb(102,21,202);" }} />
                                                </IconButton>
                                            ) : isLoggedIn ? (
                                                <IconButton onClick={toggleEdit} aria-label="Editar">
                                                    <Edit sx={{ color: "rgb(25,201,202);" }} />
                                                </IconButton>
                                            ) : (
                                                <IconButton onClick={toggleEdit}>
                                                    {starActive ? (
                                                        <Star style={{ color: colors[colorIndex] }} />
                                                    ) : (
                                                        <StarBorderOutlined
                                                            style={{ color: colors[colorIndex] }}
                                                        />
                                                    )}
                                                </IconButton>
                                            )}

                                            {isEditing ? (
                                                <TextField
                                                    type="text"
                                                    value={personalInfo.name}
                                                    onChange={(e) => handleInputChange(e, "name")}
                                                />
                                            ) : (
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {personalInfo.name}
                                                </Typography>
                                            )}
                                            {isEditing ? (
                                                <TextField
                                                    type="text"
                                                    value={personalInfo.profession}
                                                    onChange={(e) => handleInputChange(e, "profession")}
                                                />
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    {personalInfo.profession}
                                                </Typography>
                                            )}

                                            <CardActionArea>
                                                {isEditing ? (
                                                    <Box sx={{ padding: "5px" }}>
                                                        <Input type="file" onChange={handleFileChange} />
                                                    </Box>
                                                ) : (
                                                    <CardActionArea>
                                                        <CardMedia
                                                            component="img"
                                                            image={personalInfo.image}
                                                            alt="Imagen de perfil"
                                                        />
                                                    </CardActionArea>
                                                )}
                                            </CardActionArea>
                                            {isEditing ? (
                                                <Box sx={{ padding: "5px" }}>
                                                    <TextField
                                                        type="text"
                                                        value={personalInfo.description}
                                                        onChange={(e) =>
                                                            handleInputChange(e, "description")
                                                        }
                                                    />
                                                </Box>
                                            ) : (
                                                <Typography variant="body1" marginTop={2}>
                                                    {personalInfo.description}
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </animated.div>
                            </Grid>
                            {/* Agregar más contenido aquí si es necesario */}
                        </Grid>
                    </Box>
                    <RenderImage />
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
        </>
    );
};

export default AboutPage;
