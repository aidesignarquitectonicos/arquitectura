import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get } from "firebase/database";
import { useSpring, animated } from "@react-spring/web";
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Grid,
    Typography,
} from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function Content() {
    const [projects, setProjects] = useState([]);

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

        fetchProjects();
    }, []);

    const fadeIn = useSpring({
        to: { opacity: 1, transform: "translateY(0)" },
        from: { opacity: 0, transform: "translateY(20px)" },
        delay: 200,
    });

    return (
        <Grid container spacing={2} style={{ padding: 20 }}>
            {projects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project.uuid}>
                    <animated.div style={fadeIn}>
                        <Card
                            raised
                            style={{ cursor: "pointer", background: "#f4f4f4" }}
                        >
                            <CardActionArea>
                                <CardContent sx={{ padding: '0px' }}>
                                    <Typography variant="h5" component="h2" style={{ margin: "20px" }}>
                                        Proyecto: {project.field1}
                                    </Typography>
                                    <AutoPlaySwipeableViews>
                                        {project.images?.map((image, index) => (
                                            <Box key={index} sx={{ height: 140, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <img src={image} alt={`Imagen ${index + 1}`} style={{ height: '100%', width: '98%' }} />
                                            </Box>
                                        ))}
                                    </AutoPlaySwipeableViews>
                                </CardContent>
                                <Typography
                                    variant="body2"
                                    component="p"
                                    style={{ margin: "20px" }}
                                >
                                    Descripción: {project.field2}
                                </Typography>
                            </CardActionArea>
                        </Card>
                    </animated.div>
                </Grid>
            ))}
        </Grid>
    );
}

export default Content;
