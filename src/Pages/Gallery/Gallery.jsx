import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { useSpring } from "@react-spring/web";
import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    useMediaQuery, // Importa useMediaQuery
    useTheme,
    Typography,
} from "@mui/material";
import logo from "../../Assets/icono.png";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function Gallery() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const theme = useTheme(); // Usa el tema de MUI
    const matchesXS = useMediaQuery(theme.breakpoints.down('sm')); // Mobile
    const matchesSM = useMediaQuery(theme.breakpoints.up('sm')); // Tablets
    const matchesMD = useMediaQuery(theme.breakpoints.up('md')); // Small desktop

    useEffect(() => {
        const fetchProjects = async () => {
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
            } else {
                console.log("No se encontraron proyectos.");
            }
        };

        fetchProjects();
    }, []);

    const getColsForBreakpoints = () => {
        if (matchesXS) return 1;
        if (matchesSM) return 2;
        if (matchesMD) return 3;
        return 4; // Por defecto para pantallas grandes
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            <AppBar position="fixed" sx={{ background: "#f4f4f4", color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton onClick={handleBack} aria-label="Regresar">
                        <ArrowBack fontSize='32px' />
                    </IconButton>
                    <Typography>
                        Gallery
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box maxWidth="sm" sx={{
                overflowY: 'auto',
                padding: '20px',
                marginTop: 8,
                marginBottom: 4
            }}>
                <ImageList
                    cols={getColsForBreakpoints()}
                    gap={8}
                    variant="woven"
                >
                    {projects.map((project) => (
                        <>
                            {project.images?.map((image, index) => (
                                <ImageListItem key={index}>
                                    <img
                                        loading="lazy"
                                        src={image}
                                        srcSet={`Imagen ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </ImageListItem>
                            ))}
                        </>
                    ))}
                </ImageList>
            </Box>

        </>
    );
}

export default Gallery;
