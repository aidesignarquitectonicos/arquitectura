import React, { useState, useEffect } from "react";
import {
    Button,
    Box,
    Grid,
    Typography,
    Container,
    Alert,
    AppBar,
    Toolbar,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    CircularProgress,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { storage, database } from "../../Data/FirebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
    set,
    ref as dbRef,
    onValue,
    get,
    getDatabase,
} from "firebase/database";
import { Add, Delete, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";

const blue = {
    100: "#DAECFF",
    200: "#b6daff",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E5",
    900: "#003A75",
};

const grey = {
    50: "#F3F6F9",
    100: "#E5EAF2",
    200: "#DAE2ED",
    300: "#C7D0DD",
    400: "#B0B8C4",
    500: "#9DA8B7",
    600: "#6B7A90",
    700: "#434D5B",
    800: "#303740",
    900: "#1C2025",
};

function Upload() {
    const navigate = useNavigate();

    // Role
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [open, setOpen] = useState(false);
    const [newRole, setNewRole] = useState("");
    const [rolesDisponibles, setRolesDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [alertInfo, setAlertInfo] = useState({
        showAlert: false,
        type: "success", // Puede ser 'error', 'warning', 'info', 'success'
        message: "",
    });

    const [fields, setFields] = useState({
        field1: "",
        field2: "",
        field3: "",
    });

    const [role, setRole] = useState("");
    const [imageFiles, setImageFiles] = useState([]);
    const [videoFiles, setVideoFiles] = useState([]);

    const [previewImages, setPreviewImages] = useState([]);
    const [previewVideos, setPreviewVideos] = useState([]);

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setFields((prevFields) => ({
            ...prevFields,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                if (!database || database._instanceStarted === false) {
                    console.error("La base de datos no se ha inicializado correctamente");
                    return;
                }

                console.log("Intentando obtener datos de la base de datos...");
                const rolesRef = ref(database, "Role");
                const snapshot = await get(rolesRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const rolesArray = Object.values(data);
                    console.log("Roles disponibles:", rolesArray);
                    setRolesDisponibles(rolesArray);
                } else {
                    console.log("No data available");
                }
            } catch (error) {
                console.error("Error obteniendo roles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    useEffect(() => {
        fetch("https://aidesign-9022b-default-rtdb.firebaseio.com/Role.json")
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setRoles(data);
                }
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const toggleSelection = (role) => {
        setSelectedRoles((prev) =>
            prev.includes(role)
                ? prev.filter((item) => item !== role)
                : [...prev, role]
        );
    };

    const handleAddRole = async () => {
        if (newRole.trim() !== "") {
            const updatedRoles = [...roles, newRole];
            setRoles(updatedRoles);
            setNewRole("");
            setOpen(false);

            // Enviar los datos actualizados a Firebase
            fetch("https://aidesign-9022b-default-rtdb.firebaseio.com/Role.json", {
                method: "PUT", // `PUT` reemplaza el array, si prefieres agregar uno por uno usa `POST`
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedRoles),
            })
                .then((response) => response.json())
                .then(() => console.log("Rol agregado correctamente"))
                .catch((error) => console.error("Error al agregar el rol:", error));
        }
    };

    const handleDeleteRole = (role) => {
        const updatedRoles = roles.filter((r) => r !== role);
        setRoles(updatedRoles);

        // Enviar los datos actualizados a Firebase
        fetch("https://aidesign-9022b-default-rtdb.firebaseio.com/Role.json", {
            method: "PUT", // `PUT` reemplaza el array en Firebase
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedRoles),
        })
            .then((response) => response.json())
            .then(() => console.log("Rol eliminado correctamente"))
            .catch((error) => console.error("Error al eliminar el rol:", error));
    };

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const imageFilesArray = selectedFiles.filter((file) =>
            file.type.startsWith("image/")
        );

        setImageFiles(imageFilesArray);

        const imagesURLs = imageFilesArray.map((file) => URL.createObjectURL(file));
        setPreviewImages(imagesURLs);
    };

    const handleVideoChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const videoFilesArray = selectedFiles.filter((file) =>
            file.type.startsWith("video/")
        );

        setVideoFiles(videoFilesArray);

        const videoURLs = videoFilesArray.map((file) => URL.createObjectURL(file));
        setPreviewVideos(videoURLs);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación para asegurar que hay texto en los campos y al menos una imagen y un video seleccionados
        if (
            !fields.field1 ||
            !fields.field2 ||
            !fields.field3 ||
            imageFiles.length === 0 ||
            videoFiles.length === 0 ||
            selectedRoles.length === 0
        ) {
            setAlertInfo({
                showAlert: true,
                type: "error",
                message:
                    "Por favor, completa todos los campos y selecciona al menos una imagen, un video y un rol.",
            });
            return;
        }

        // Lógica para enviar archivos al almacenamiento y guardar datos en la base de datos
        const folderUuid = uuidv4();
        const imageRefs = await uploadFiles(
            imageFiles,
            `images/Dataimg/${folderUuid}`
        );
        const videoRefs = await uploadFiles(
            videoFiles,
            `images/Datavideo/${folderUuid}`
        );

        // Guardar información en la base de datos
        const projectRef = dbRef(database, `Projects/${folderUuid}`);
        set(projectRef, {
            field1: fields.field1,
            field2: fields.field2,
            field3: fields.field3,
            roles: selectedRoles,
            images: imageRefs,
            videos: videoRefs,
        });

        // Mostrar alerta de éxito
        setAlertInfo({
            showAlert: true,
            type: "success",
            message: "Imágenes, Video y datos enviados correctamente.",
        });
        // Limpiar los campos y estados después de la subida exitosa
        setFields({
            field1: "",
            field2: "",
            field3: "",
        });
        setSelectedRoles([]);
        setImageFiles([]);
        setVideoFiles([]);
        setPreviewImages([]);
        setPreviewVideos([]);
    };

    const uploadFiles = async (files, storagePath) => {
        const fileRefs = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileRef = ref(storage, `${storagePath}/${file.name}`);
            await uploadBytes(fileRef, file).then(async (snapshot) => {
                const downloadURL = await getDownloadURL(snapshot.ref);
                fileRefs.push(downloadURL);
            });
        }
        return fileRefs;
    };

    const handleBack = () => {
        window.location.href =
            "https://aidesignarquitectonicos.github.io/arquitectura/";
    };

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
                    textAlign: "center",
                    justifyContent: "space-between",
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <IconButton onClick={handleBack} aria-label="Regresar">
                        <ArrowBack sx={{ color: "black" }} fontSize="32px" />
                    </IconButton>
                    <Typography
                        sx={{
                            fontFamily: "'Poppins', sans-serif",
                            color: "#000",
                            fontWeight: "bold",
                            fontSize: "1.3rem",
                        }}
                        variant="h6"
                        component="div"
                    >
                        Upload
                    </Typography>
                    <Typography variant="h6" component="div"></Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm" sx={{ marginTop: 8, marginBottom: 4 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        paddingTop: 2,
                    }}
                >
                    {alertInfo.showAlert && (
                        <Alert severity={alertInfo.type} sx={{ width: "100%", mb: 2 }}>
                            {alertInfo.message}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                        sx={{
                            "& > :not(style)": {
                                m: 1,
                                width: "100%",
                            },
                        }}
                    >
                        <Grid
                            container
                            spacing={2}
                            direction="column"
                            alignContent={"center"}
                            alignItems={"center"}
                        >
                            <Grid item xs={{ alignItems: "left", textAlign: "left" }}>
                                <Typography
                                    sx={{
                                        fontFamily: "'Poppins', sans-serif",
                                        color: "#000",
                                        fontWeight: "bold",
                                        fontSize: "1.3rem",
                                    }}
                                    variant="h6"
                                    component="div"
                                    align="start"
                                    gutterBottom
                                >
                                    Titulo del Projecto
                                </Typography>

                                <TextareaAutosize
                                    maxRows={10}
                                    aria-label="maximum height"
                                    minRows={3}
                                    name="field1"
                                    value={fields.field1}
                                    onChange={handleFieldChange}
                                    fullWidth
                                    style={{
                                        backgroundColor: grey[50],
                                        color: grey[700],
                                        border: `1px solid ${grey[300]}`,

                                        fontSize: "14px",
                                        borderRadius: 20,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    sx={{
                                        fontFamily: "'Poppins', sans-serif",
                                        color: "#000",
                                        fontWeight: "bold",
                                        fontSize: "1.3rem",
                                    }}
                                    variant="h6"
                                    component="div"
                                    align="start"
                                    gutterBottom
                                >
                                    Descripción Corta
                                </Typography>
                                <TextareaAutosize
                                    maxRows={10}
                                    aria-label="maximum height"
                                    minRows={3}
                                    name="field2"
                                    defaultValue={fields.field2}
                                    onChange={handleFieldChange}
                                    fullWidth
                                    style={{
                                        backgroundColor: grey[50],
                                        color: grey[700],
                                        border: `1px solid ${grey[300]}`,

                                        fontSize: "14px",
                                        borderRadius: 20,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    sx={{
                                        fontFamily: "'Poppins', sans-serif",
                                        color: "#000",
                                        fontWeight: "bold",
                                        fontSize: "1.3rem",
                                    }}
                                    variant="h6"
                                    component="div"
                                    align="start"
                                    gutterBottom
                                >
                                    Descripción Completa
                                </Typography>
                                <TextareaAutosize
                                    maxRows={10}
                                    aria-label="maximum height"
                                    minRows={3}
                                    name="field3"
                                    value={fields.field3}
                                    onChange={handleFieldChange}
                                    fullWidth
                                    style={{
                                        backgroundColor: grey[50],
                                        color: grey[700],
                                        border: `1px solid ${grey[300]}`,

                                        fontSize: "14px",
                                        borderRadius: 20,
                                    }}
                                />
                            </Grid>
                            <br />
                            <Grid
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    width: "100vw",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                }}
                                spacing={2}
                            >
                                <Grid item xs={12} md={6}>
                                    <input
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        id="raised-button-file"
                                        multiple
                                        type="file"
                                        onChange={handleImageChange}
                                    />
                                    <label htmlFor="raised-button-file">
                                        <Button variant="contained" component="span">
                                            Upload Images
                                        </Button>
                                    </label>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                            marginTop: 2,
                                            width: "100%",
                                            justifyContent: "center",
                                            alignContent: "center",
                                            alignItems: "center",
                                            textAlign: "center",
                                        }}
                                    >
                                        {previewImages.map((image, index) => (
                                            <Box key={index} sx={{ margin: 1 }}>
                                                <img
                                                    src={image}
                                                    alt={`preview ${index}`}
                                                    style={{ width: "100px", height: "100px" }}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <input
                                        accept="video/*"
                                        style={{ display: "none" }}
                                        id="raised-button-file-video"
                                        multiple
                                        type="file"
                                        onChange={handleVideoChange}
                                    />
                                    <label htmlFor="raised-button-file-video">
                                        <Button variant="contained" component="span">
                                            Upload Videos
                                        </Button>
                                    </label>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                            marginTop: 2,
                                            justifyContent: "center",
                                            alignContent: "center",
                                            alignItems: "center",
                                            textAlign: "center",
                                        }}
                                    >
                                        {previewVideos.map((video, index) => (
                                            <Box key={index} sx={{ margin: 1 }}>
                                                <video
                                                    key={index}
                                                    src={video}
                                                    alt={`preview ${index}`}
                                                    style={{ width: "150px", height: "150px" }}
                                                    controls
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} alignItems="center" justifyContent="center" textAlign="center">
                                <Typography
                                    sx={{
                                        fontFamily: "'Poppins', sans-serif",
                                        color: "#000",
                                        fontWeight: "bold",
                                        fontSize: "1.3rem",
                                    }}
                                    variant="h6"
                                    component="div"
                                    align="start"
                                    gutterBottom
                                >
                                    Seleccione el Rol
                                </Typography>

                                <Box p={4}>
                                    <Box
                                        display="flex"
                                        flexWrap="wrap"
                                        gap={1}
                                        alignItems="center"
                                    >
                                        {roles.map((role, index) => (
                                            <Chip
                                                key={index}
                                                label={role}
                                                onClick={() => toggleSelection(role)}
                                                sx={{
                                                    backgroundColor: selectedRoles.includes(role)
                                                        ? "black"
                                                        : "#F4F4F4",
                                                    color: selectedRoles.includes(role)
                                                        ? "#FFFFFF"
                                                        : "#000000",
                                                    padding: 3,
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                }}
                                                clickable
                                                onDelete={() => handleDeleteRole(role)}
                                                deleteIcon={<Delete sx={{ fill: "red" }} />}
                                            />
                                        ))}
                                        <IconButton color="primary" onClick={() => setOpen(true)}>
                                            <Add sx={{ fontSize: "30px" }} />
                                        </IconButton>
                                    </Box>
                                    <Dialog open={open} onClose={() => setOpen(false)}>
                                        <DialogTitle>Agregar Nuevo Rol</DialogTitle>
                                        <DialogContent>
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                fullWidth
                                                value={newRole}
                                                onChange={(e) => setNewRole(e.target.value)}
                                                variant="standard" // Hace que solo tenga el borde inferior por defecto
                                                InputProps={{
                                                    sx: {
                                                        "&:before": {
                                                            borderBottom: "1px solid blue", // Estilo cuando está inactivo
                                                        },
                                                        "&:hover:not(.Mui-disabled):before": {
                                                            borderBottom: "1px solid darkblue", // Estilo al pasar el mouse
                                                        },
                                                        "&:after": {
                                                            borderBottom: "2px solid blue", // Estilo cuando está enfocado
                                                        },
                                                    },
                                                }}
                                            />

                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => setOpen(false)}>Cancelar</Button>
                                            <Button onClick={handleAddRole} color="primary">
                                                Agregar
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </Box>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                alignContent={"center"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                textAlign={"center"}
                                marginRight={4}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
}

export default Upload;
