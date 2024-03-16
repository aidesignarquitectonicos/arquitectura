import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get } from "firebase/database";
import { useSpring, animated } from "@react-spring/web";
import {
    Alert,
    Box,
    Card,
    CardContent,
    Grid,
    IconButton,
    TextField,
    Typography,
} from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { Edit, Save, Share } from '@mui/icons-material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function Content() {
    const [projects, setProjects] = useState([]);

    //Constantes para el Alert
    const [alertInfo, setAlertInfo] = useState({
        showAlert: false,
        type: 'info', // Puede ser 'error', 'warning', 'info', 'success'
        message: ''
    });


    //CONSTANTES PARA EDICIÓN
    const [editMode, setEditMode] = useState({});
    const [editedProjects, setEditedProjects] = useState({});
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            const database = getDatabase();
            const projectsRef = ref(database, 'Projects');
            const snapshot = await get(projectsRef);

            if (snapshot.exists()) {
                const projectsData = snapshot.val();
                const projectsArray = Object.keys(projectsData).map((key) => ({
                    uuid: key,
                    ...projectsData[key],
                }));
                setProjects(projectsArray);
            } else {
                console.log("No se encontraron proyectos.");
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
        setEditedProjects(prevState => ({
            ...prevState,
            [uuid]: {
                ...prevState[uuid],
                [field]: value,
            }
        }));
    };

    // Modificación del toogle
    const toggleEditMode = (uuid) => {
        setEditMode(prevState => ({
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
                    type: 'success',
                    message: 'Contenido compartido con éxito.'
                });
            } catch (error) {
                setAlertInfo({
                    showAlert: true,
                    type: 'error',
                    message: 'Error al compartir.'
                });
            }
        } else {
            setAlertInfo({
                showAlert: true,
                type: 'warning',
                message: 'La API de Web Share no está soportada en este navegador.'
            });
        }
    };


    return (
        <Grid container spacing={2} style={{ padding: 20 }}>
            {alertInfo.showAlert && (
            <Alert severity={alertInfo.type} onClose={() => setAlertInfo({ ...alertInfo, showAlert: false })} sx={{ width: '100%', mb: 2 }}>
                {alertInfo.message}
            </Alert>
        )}
            {projects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project.uuid}>
                    <animated.div style={fadeIn}>
                        <Card
                            raised
                            style={{ cursor: "pointer", background: "#f4f4f4" }}
                        >
                            <CardContent sx={{ padding: '0px' }}>
                                <CardContent sx={{ padding: '0px', display: 'flex', justifyContent: 'space-between' }}>

                                    {editMode[project.uuid] ? (
                                        <TextField
                                            variant="outlined"
                                            defaultValue={project.field1}
                                            onChange={(e) => handleEditChange(project.uuid, 'field1', e.target.value)}
                                            fullWidth
                                        />
                                    ) : (
                                        <Typography variant="h5" component="h2" style={{ margin: "20px" }}>
                                            Proyecto: {editedProjects[project.uuid]?.field1 || project.field1}
                                        </Typography>
                                    )}
                                    {isUserLoggedIn ? (
                                        <IconButton onClick={() => toggleEditMode(project.uuid)}>
                                            {editMode[project.uuid] ? <Save sx={{ color: 'black' }} /> : <Edit sx={{ color: 'black' }} />}
                                        </IconButton>
                                    ) : (
                                        <IconButton onClick={() => shareProject(project)}>
                                            <Share sx={{ color: 'green' }} />
                                        </IconButton>
                                    )}
                                </CardContent>

                                <AutoPlaySwipeableViews>
                                    {project.images?.map((image, index) => (
                                        <Box key={index} sx={{ height: 140, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <img src={image} alt={`Imagen ${index + 1}`} style={{ height: '100%', width: '98%' }} />
                                        </Box>
                                    ))}
                                </AutoPlaySwipeableViews>
                            </CardContent>
                            {editMode[project.uuid] ? (
                                <TextField
                                    variant="outlined"
                                    defaultValue={project.field2}
                                    onChange={(e) => handleEditChange(project.uuid, 'field2', e.target.value)}
                                    fullWidth
                                />
                            ) : (
                                <Typography
                                    variant="body2"
                                    component="p"
                                    style={{ margin: "20px" }}
                                >
                                    Descripción: {editedProjects[project.uuid]?.field2 || project.field2}
                                </Typography>
                            )}

                        </Card>
                    </animated.div>
                </Grid>
            ))}
        </Grid>
    );
}

export default Content;
