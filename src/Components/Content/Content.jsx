import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { useSpring, animated } from "@react-spring/web";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { Edit, Save, Share } from "@mui/icons-material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { update } from "firebase/database";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function Content() {

    //Sistema de filtrado
    const [filter, setFilter] = useState("");
    const [projects, setProjects] = useState([]);

    // Nueva función para manejar cambios en el filtro
    const handleFilterChange = (category) => {
        setFilter(category);
    };

    // Filtrar proyectos basados en la selección
    const filteredProjects = projects.filter((project) => {
        return filter === "" || project.role === filter; // Asegúrate de que 'role' es la propiedad correcta para filtrar
    });

    //Constantes para el Alert
    const [alertInfo, setAlertInfo] = useState({
        showAlert: false,
        type: "info", // Puede ser 'error', 'warning', 'info', 'success'
        message: "",
    });

    //CONSTANTES PARA EDICIÓN
    const [editMode, setEditMode] = useState({});
    const [editedProjects, setEditedProjects] = useState({});
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            // Intenta recuperar los proyectos desde localStorage
            const storedProjects = localStorage.getItem('projects');
            if (storedProjects) {
                setProjects(JSON.parse(storedProjects));
            } else {
                // Si no hay proyectos en localStorage, realiza la solicitud a la base de datos
                const database = getDatabase();
                const projectsRef = ref(database, "Projects");
                const snapshot = await get(projectsRef);
                if (snapshot.exists()) {
                    const projectsData = snapshot.val();
                    const projectsArray = Object.keys(projectsData).map((key) => ({
                        uuid: key,
                        ...projectsData[key],
                    }));
                    setProjects(projectsArray);
                    // Actualiza localStorage con los nuevos proyectos
                    localStorage.setItem('projects', JSON.stringify(projectsArray));
                } else {
                    console.log("No se encontraron proyectos.");
                }
            }
        };

        // Escuchar cambios en el estado de autenticación
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsUserLoggedIn(true); // Usuario está logueado
            } else {
                setIsUserLoggedIn(false); // Usuario no está logueado
            }
        });

        fetchProjects();
    }, []);

    const fadeIn = useSpring({
        to: { opacity: 1, transform: "translateY(0)" },
        from: { opacity: 0, transform: "translateY(20px)" },
        delay: 200,
    });

    // Modificación previa
    const handleEditChange = (uuid, field, value) => {
        setEditedProjects((prevState) => ({
            ...prevState,
            [uuid]: {
                ...prevState[uuid],
                [field]: value,
            },
        }));
    };

    const handleRoleChange = (event, uuid) => {
        // Actualizar el proyecto específico con el nuevo rol en el estado editedProjects
        setEditedProjects(prevState => ({
            ...prevState,
            [uuid]: {
                ...prevState[uuid],
                role: event.target.value,
            },
        }));
    };

    // Modificación del toogle
    const toggleEditMode = (uuid) => {
        if (editMode[uuid]) {
            // Si estamos desactivando el modo de edición, intenta guardar los cambios
            saveChanges(uuid);
        }

        setEditMode((prevState) => ({
            ...prevState,
            [uuid]: !prevState[uuid],
        }));
    };

    //Compartir Projecto
    const shareProject = async (project) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    image: `${project.image}`,
                    title: `Proyecto: ${project.field1}`, // Título del contenido a compartir
                    text: `Echa un vistazo a este proyecto: ${project.field1}`, // Texto descriptivo
                    url: window.location.href, // Puedes personalizar esta URL si cada proyecto tiene su propia página
                });
                setAlertInfo({
                    showAlert: true,
                    type: "success",
                    message: "Contenido compartido con éxito.",
                });
            } catch (error) {
                setAlertInfo({
                    showAlert: true,
                    type: "error",
                    message: "Error al compartir.",
                });
            }
        } else {
            setAlertInfo({
                showAlert: true,
                type: "warning",
                message: "La API de Web Share no está soportada en este navegador.",
            });
        }
    };

    //Save data
    const saveChanges = async (uuid) => {

        if (!editedProjects[uuid]) {
            console.error("No hay cambios para guardar");
            return;
        }

        try {
            const database = getDatabase();
            const projectRef = ref(database, `Projects/${uuid}`);
            await update(projectRef, editedProjects[uuid]);

            // Actualiza el proyecto en el estado 'projects'
            const updatedProjects = projects.map(project =>
                project.uuid === uuid ? { ...project, ...editedProjects[uuid] } : project
            );
            setProjects(updatedProjects);

            // Actualiza localStorage con los proyectos actualizados
            localStorage.setItem('projects', JSON.stringify(updatedProjects));

            setAlertInfo({
                showAlert: true,
                type: "success",
                message: "Los cambios se han guardado exitosamente.",
            });

            // Opcionalmente, recargar los proyectos desde la base de datos para reflejar los cambios
            // fetchProjects(); // Deberás asegurarte de que fetchProjects no dependa del ciclo de vida de useEffect para poder llamarla directamente

        } catch (error) {
            console.error("Error al guardar los cambios: ", error);
            setAlertInfo({
                showAlert: true,
                type: "error",
                message: "Hubo un error al guardar los cambios.",
            });
        }
    }

    return (
        <Grid container spacing={1} style={{ padding: 20 }}>
            <Grid
                item
                xs={12}
                style={{
                    width: "100%",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Card
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                        }}>
                        <CardContent sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                        }}>
                            <div >
                                <Button
                                    sx={{
                                        background: '#f4f4f4',
                                        '@media (max-width: 600px)': {
                                            fontSize: '12px',
                                        },
                                        fontSize: "15px",

                                    }}
                                    onClick={() => handleFilterChange("")}
                                >
                                    Todos
                                </Button>
                            </div>
                            <div >
                                <Button
                                    sx={{
                                        fontSize: "11px",
                                        '@media (max-width: 600px)': {
                                            fontSize: '9px',
                                        },
                                    }}
                                    onClick={() => handleFilterChange("Fachada")}
                                >
                                    Fachada
                                </Button>
                            </div>
                            <div >
                                <Button
                                    sx={{
                                        fontSize: "11px",
                                        '@media (max-width: 600px)': {
                                            fontSize: '9px',
                                        },
                                    }}
                                    onClick={() => handleFilterChange("Diseño de Interiores")}
                                >
                                    Diseño de Interiores
                                </Button>
                            </div>
                            <div >
                                <Button
                                    sx={{
                                        fontSize: "11px",
                                        '@media (max-width: 600px)': {
                                            fontSize: '9px',
                                        },
                                    }}
                                    onClick={() => handleFilterChange("Remodelación")}
                                >
                                    Remodelación
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </Box>
                <br />
                {alertInfo.showAlert && (
                    <Alert
                        severity={alertInfo.type}
                        onClose={() => setAlertInfo({ ...alertInfo, showAlert: false })}
                        sx={{ width: "100%", mb: 2 }}
                    >
                        {alertInfo.message}
                    </Alert>
                )}
                {filteredProjects.map((project) => (
                    <Grid xs={12}>
                        {projects.map((project) => (
                            <Grid item xs={12} sm={6} md={4} key={project.uuid}>
                                <animated.div style={fadeIn}>
                                    <Card
                                        raised
                                        style={{ cursor: "pointer", background: "#f4f4f4" }}
                                    >
                                        <CardContent sx={{ padding: "0px" }}>
                                            <CardContent
                                                sx={{
                                                    padding: "0px",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                {editMode[project.uuid] ? (
                                                    <TextField
                                                        variant="outlined"
                                                        defaultValue={project.field1}
                                                        onChange={(e) =>
                                                            handleEditChange(
                                                                project.uuid,
                                                                "field1",
                                                                e.target.value
                                                            )
                                                        }
                                                        fullWidth
                                                    />
                                                ) : (
                                                    <Typography
                                                        variant="h5"
                                                        component="h2"
                                                        style={{ margin: "20px" }}
                                                    >
                                                        Proyecto:{" "}
                                                        {editedProjects[project.uuid]?.field1 ||
                                                            project.field1}
                                                    </Typography>
                                                )}
                                                {isUserLoggedIn ? (
                                                    <IconButton onClick={() => toggleEditMode(project.uuid)}>
                                                        {editMode[project.uuid] ? <Save sx={{ color: "black" }} /> : <Edit sx={{ color: "black" }} />}
                                                    </IconButton>
                                                ) : (
                                                    <IconButton onClick={() => shareProject(project)}>
                                                        <Share sx={{ color: "green" }} />
                                                    </IconButton>
                                                )}
                                            </CardContent>

                                            <AutoPlaySwipeableViews>
                                                {project.images?.map((image, index) => (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            height: 140,
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <img
                                                            src={image}
                                                            alt={`Imagen ${index + 1}`}
                                                            style={{ height: "100%", width: "98%" }}
                                                        />
                                                    </Box>
                                                ))}
                                            </AutoPlaySwipeableViews>
                                        </CardContent>
                                        {editMode[project.uuid] ? (
                                            <TextField
                                                variant="outlined"
                                                defaultValue={project.field2}
                                                onChange={(e) =>
                                                    handleEditChange(project.uuid, "field2", e.target.value)
                                                }
                                                fullWidth
                                            />
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                component="p"
                                                style={{ margin: "20px" }}
                                            >
                                                Descripción:{" "}
                                                {editedProjects[project.uuid]?.field2 || project.field2}
                                            </Typography>
                                        )}
                                        <CardContent sx={{ padding: "0px" }}>
                                            {editMode[project.uuid] ? (
                                                <Grid item xs={12}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="role-select-label">Rol</InputLabel>
                                                        <Select
                                                            labelId="role-select-label"
                                                            id="role-select"
                                                            value={editedProjects[project.uuid]?.role || project.role}
                                                            label="Rol"
                                                            onChange={(event) => handleRoleChange(event, project.uuid)}
                                                        >
                                                            <MenuItem value={"Fachada"}>Fachada</MenuItem>
                                                            <MenuItem value={"Diseño de Interiores"}>Diseño de Interiores</MenuItem>
                                                            <MenuItem value={"Remodelación"}>Remodelación</MenuItem>
                                                        </Select>

                                                    </FormControl>
                                                </Grid>
                                            ) : (
                                                <Typography
                                                    variant="body2"
                                                    component="p"
                                                    style={{ margin: "20px" }}
                                                >
                                                    Descripción:{" "}
                                                    {editedProjects[project.uuid]?.role || project.role}
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </animated.div>
                            </Grid>
                        ))}
                    </Grid>
                ))}

            </Grid>
        </Grid>
    );
}

export default Content;
