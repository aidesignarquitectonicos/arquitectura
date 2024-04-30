import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { useSpring, animated } from "@react-spring/web";
import { useParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { update } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import GalleryView from "../../Components/View/GalleryView";
import {
    AppBar, Toolbar, IconButton, ImageListItemBar,
    Typography, Container, Box,
    ImageList, ImageListItem, ListSubheader
} from "@mui/material";
import { ArrowBack } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import { Share } from "@mui/icons-material";

function ProjectDetails() {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            const database = getDatabase();
            const projectRef = ref(database, `Projects/${uuid}`);
            const snapshot = await get(projectRef);
            if (snapshot.exists()) {
                setProject({
                    uuid: uuid,
                    ...snapshot.val(),
                });
            } else {
                console.log("No se encontraron proyectos.");
            }
        };

        fetchProject();
    }, [uuid]);

    const handleBack = () => {
        navigate(-1);
    };

    const fade = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 1000 },
    });

    //Constantes para el Alert
    const [alertInfo, setAlertInfo] = useState({
        showAlert: false,
        type: "info", // Puede ser 'error', 'warning', 'info', 'success'
        message: "",
    });

    //Compartir Projecto
    const shareProject = async (project) => {
        // Construye la URL del proyecto usando el UUID del proyecto
        const projectUrl = `${window.location.href}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    image: `${project.image}`,
                    title: `Proyecto: ${project.field1}`, // Título del contenido a compartir
                    text: `Echa un vistazo a este proyecto: ${project.field1}`, // Texto descriptivo
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

    return (
        <>
            <animated.div style={fade}>
                <AppBar position="fixed" sx={{ background: "#f4f4f4", color: "#000" }}>
                    <Toolbar>
                        <IconButton onClick={handleBack} aria-label="Regresar" edge="start">
                            <ArrowBack fontSize='32px' />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                            Detalles del Proyecto
                        </Typography>
                        <IconButton onClick={() => shareProject(project)}>
                            <Share sx={{ color: "green" }} />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container sx={{ marginTop: 12, marginBottom: 4 }}>
                    {project ? (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Typography variant="h5"
                                gutterBottom>
                                Detalles del Proyecto:
                                {project.field1}
                            </Typography>
                            <ImageList sx={{ width: 'auto', height: 'auto' }}>
                                {project.images?.map((image, index) => (
                                    <ImageListItem key={index}>
                                        <img src={`${image}?w=248&fit=crop&auto=format`} alt={`Imagen de ${project.field1}`} loading="lazy" />
                                        <ImageListItemBar title={project.field1} actionIcon={<IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }} aria-label={`info about ${project.field1}`}><InfoIcon /></IconButton>} />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Box>
                    ) : (
                        <Typography variant="h6" textAlign="center">Cargando detalles del proyecto...</Typography>
                    )}
                </Container>
            </animated.div>

        </>
    );
}

export default ProjectDetails;
