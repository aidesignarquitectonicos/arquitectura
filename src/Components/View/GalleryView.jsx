import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { useSpring, animated } from "@react-spring/web";
import {
    Alert,
    Box,
    Card,
    CardContent,
    CardActionArea,
    Grid,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { Directions, Edit, Save, Share } from "@mui/icons-material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { update } from "firebase/database";
import { useNavigate } from "react-router-dom";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function GalleryView({ project, index, image }) {
    //Sistema de filtrado
    const [filter, setFilter] = useState("");
    const [projects, setProjects] = useState([]);

    // Nueva función para manejar cambios en el filtro
    //const handleFilterChange = (category) => {
    //   setFilter(category);
    //};

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
            const storedProjects = localStorage.getItem("Projects");
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
                    localStorage.setItem("projects", JSON.stringify(projectsArray));
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

    // ESTE APARTADO ES LA OPACIDAD A LA PAGUINA
    const fade = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 1500 },
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
        setEditedProjects((prevState) => ({
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
        // Construye la URL del proyecto usando el UUID del proyecto
        const projectUrl = `${window.location.href}#/project/${project.uuid}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    image: project.image,
                    title: `Proyecto: ${project.field3} - ${project.role}`, // Título del contenido a compartir
                    text: `Descripción: ${project.field1}`, // Texto descriptivo
                    url: projectUrl, // Puedes personalizar esta URL si cada proyecto tiene su propia página
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
            const updatedProjects = projects.map((project) =>
                project.uuid === uuid
                    ? { ...project, ...editedProjects[uuid] }
                    : project
            );
            setProjects(updatedProjects);

            // Actualiza localStorage con los proyectos actualizados
            localStorage.setItem("projects", JSON.stringify(updatedProjects));

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
    };

    const navigate = useNavigate();

    const handleClick = (project) => {
        navigate(`/project/${project.uuid}`);
    };

    return (
        <>
            <animated.div style={fade}>
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
                                <Box item key={project.uuid} sx={{ marginBottom: 5 }}>
                                    <animated.div style={fadeIn}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <div>
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
                                                    <Typography variant="h8" component="h3" style={{}}>
                                                        Proyecto:{" "}
                                                        {editedProjects[project.uuid]?.field1 ||
                                                            project.field1}
                                                    </Typography>
                                                )}
                                            </div>

                                            <div>
                                                {isUserLoggedIn ? (
                                                    <IconButton
                                                        onClick={() => toggleEditMode(project.uuid)}
                                                    >
                                                        {editMode[project.uuid] ? (
                                                            <Save sx={{ color: "black" }} />
                                                        ) : (
                                                            <Edit sx={{ color: "black" }} />
                                                        )}
                                                    </IconButton>
                                                ) : (
                                                    <IconButton onClick={() => shareProject(project)}>
                                                        <Share fontSize="32px" />
                                                    </IconButton>
                                                )}
                                            </div>
                                        </Box>
                                        <div style={{}}>
                                            <AutoPlaySwipeableViews
                                                onClick={() => handleClick(project)}
                                            >
                                                {project.images?.map((image, index) => (
                                                    <CardActionArea
                                                        key={index}
                                                        sx={{
                                                            borderRadius: 2,

                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                height: { xs: 250, md: '100%' },
                                                                width: "100%",
                                                                display: "flex",
                                                                position: "relative",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                overflow: "hidden",
                                                            }}
                                                        >
                                                            <img
                                                                key={index}
                                                                loading="lazy"
                                                                src={image}
                                                                alt={`Imagen ${index + 1}`}
                                                                style={{
                                                                    borderTopLeftRadius: "20px",
                                                                    borderTopRightRadius: "20px",
                                                                    borderBottomLeftRadius: "20px",
                                                                    borderBottomRightRadius: "20px",
                                                                    width: "100%",
                                                                    height: "100%", // Mantiene la relación de aspecto
                                                                    objectFit: "cover", // Cubre el contenedor sin distorsión
                                                                    cursor: "pointer",
                                                                }}
                                                            />
                                                        </Box>
                                                    </CardActionArea>
                                                ))}
                                            </AutoPlaySwipeableViews>
                                        </div>
                                    </animated.div>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </animated.div>
        </>
    );
}

export default GalleryView;
