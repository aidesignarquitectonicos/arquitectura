import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import {
    Box,
    useMediaQuery,
    useTheme,
    Card,
    CardActionArea,
    CardContent,
} from "@mui/material";
import ImageList from "@mui/material/ImageList";
import { sample } from "lodash";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { useNavigate } from "react-router-dom";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function Quilted_image({ project }) {
    const [projects, setProjects] = useState([]);
    const theme = useTheme(); // Usa el tema de MUI
    const matchesXS = useMediaQuery(theme.breakpoints.down("sm")); // Mobile
    const matchesSM = useMediaQuery(theme.breakpoints.up("sm")); // Tablets
    const matchesMD = useMediaQuery(theme.breakpoints.up("md")); // Small desktop

    useEffect(() => {
        const fetchProjects = async () => {
            // Primero, intenta recuperar los proyectos desde localStorage
            const storedProjects = localStorage.getItem("projects");
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

        fetchProjects();
    }, []);

    const getColsForBreakpoints = () => {
        if (matchesXS) return 1;
        if (matchesSM) return 2;
        if (matchesMD) return 3;
        return 4; // Por defecto para pantallas grandes
    };

    const randomProject = sample(projects);

    const navigate = useNavigate();

    const handleClick = (project) => {
        navigate(`/project/${project.uuid}`);
    };

    return (
        <>
            <Box

                sx={{
                    overflowY: "auto",
                    padding: "20px",
                    marginTop: 8,
                    marginBottom: 4,
                    width: "100%",
                }}
            >
                <ImageList sx={{
                    display: 'flex', position: "relative",
                    objectFit: "cover",
                    cursor: "pointer",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                }}>
                    {randomProject && randomProject.images && (
                        <Box
                            key={randomProject.uuid}
                            sx={{
                                marginBottom: 4,
                                width: "100%",
                            }}>
                            <AutoPlaySwipeableViews>
                                {randomProject.images.map((image, index) => (
                                    <>
                                        <Card
                                            raised
                                            style={{
                                                cursor: "pointer",
                                                background: "transparent",
                                                width: "100%",
                                            }}

                                        >
                                            <CardActionArea
                                                onClick={() => handleClick(randomProject)}
                                            >
                                                <CardContent sx={{ padding: "0px" }}>
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            height: 500,
                                                            width: "100%",
                                                            position: "relative",
                                                            display: "flex",
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
                                                                height: "100%",
                                                                objectFit: "cover",
                                                                cursor: "pointer",
                                                            }}
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </>
                                ))}
                            </AutoPlaySwipeableViews>
                        </Box>
                    )}
                </ImageList>
            </Box>
        </>
    );
}

export default Quilted_image;
