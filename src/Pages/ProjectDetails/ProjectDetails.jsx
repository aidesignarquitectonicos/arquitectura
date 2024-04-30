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

    return (
        <>
            <AppBar position="fixed" sx={{ background: "#f4f4f4", color: "#000" }}>
                <Toolbar>
                    <IconButton onClick={handleBack} aria-label="Regresar">
                        <ArrowBack fontSize='32px' />
                    </IconButton>
                    <Typography>Detalles del Proyecto</Typography>
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
        </>
    );
}

export default ProjectDetails;
