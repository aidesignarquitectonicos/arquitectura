import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { useSpring, animated } from "@react-spring/web";
import { useParams } from "react-router-dom";
//import { getAuth, onAuthStateChanged } from "firebase/auth";
//import { update } from "firebase/database";
//import GalleryView from "../../Components/View/GalleryView";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import icono from "../../Assets/icono.png";
import { convertGoogleDriveUrl } from "../../Data/googleDriveService";

import {
    AppBar,
    Toolbar,
    IconButton,
    ImageListItemBar,
    Typography,
    Container,
    Box,
    ImageList,
    ImageListItem,
    Menu,
    MenuItem,
    Divider,
    Alert,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";
import { Share } from "@mui/icons-material";
import CardContent from "@mui/joy/CardContent";

function ProjectDetails() {
    //constantes de toogle menu

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openHandle = Boolean(anchorEl);

    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    //constantes de encriptado
    const { uuid } = useParams();
    const [project, setProject] = useState(null);
    const [project_video, setProjectVideo] = useState(null);

    // Helper: Convertir Firebase object indexado a array
    const convertToArray = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data === "object") {
            return Object.keys(data)
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map((key) => data[key]);
        }
        return [];
    };

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const database = getDatabase();
                const projectRef = ref(database, `Projects/${uuid}`);
                const snapshot = await get(projectRef);

                if (snapshot.exists()) {
                    const projectData = snapshot.val();
                    console.log('📸 Datos del proyecto cargados:', projectData);
                    const imagesArray = convertToArray(projectData.images);
                    console.log('📸 Array de imágenes:', imagesArray);

                    if (imagesArray && imagesArray.length > 0) {
                        console.log(`📸 Se encontraron ${imagesArray.length} imágenes en el proyecto`);
                        const updatedImages = imagesArray.map((url) => ({
                            url,
                            type: url.toLowerCase().endsWith(".mp4") ? "video" : "image",
                        }));
                        setProject({
                            uuid: uuid,
                            ...projectData,
                            images: updatedImages,
                        });
                    } else {
                        console.log("No se encontraron imágenes en el proyecto.");
                        setProject({
                            uuid: uuid,
                            ...projectData,
                            images: [],
                        });
                    }
                } else {
                    console.log("No se encontró el proyecto.");
                }
            } catch (error) {
                console.error("Error al obtener el proyecto:", error);
            }
        };

        fetchProject();
    }, [uuid]);

    useEffect(() => {
        const fetchProjectVideos = async () => {
            try {
                const database = getDatabase();
                const projectRefVideo = ref(database, `Projects/${uuid}`);
                const snapshot = await get(projectRefVideo);
                if (snapshot.exists()) {
                    const projectData = snapshot.val();
                    console.log('🎬 Datos del proyecto (videos) cargados:', projectData);
                    const videosArray = convertToArray(projectData.videos);
                    console.log('🎬 Array de videos:', videosArray);

                    if (videosArray && videosArray.length > 0) {
                        console.log(`🎬 Se encontraron ${videosArray.length} videos en el proyecto`);
                        const updatedVideos = videosArray.map((url) => ({
                            url,
                            type: url.toLowerCase().endsWith(".mp4") ? "video" : "image",
                        }));
                        setProjectVideo({
                            uuid: uuid,
                            ...projectData,
                            videos: updatedVideos,
                        });
                    } else {
                        console.log("No se encontraron videos en el proyecto.");
                        setProjectVideo({
                            uuid: uuid,
                            ...projectData,
                            videos: [],
                        });
                    }
                } else {
                    console.log("No se encontró el proyecto.");
                }
            } catch (error) {
                console.error("Error al obtener el proyecto:", error);
            }
        };
        fetchProjectVideos();
    }, [uuid]);

    const handleBack = () => {
        window.location.href = 'https://aidesignarquitectonicos.github.io/arquitectura/#/Gallery';
    };

    const fade = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 1800 },
    });

    //Constantes para el Alert
    const [alertInfo, setAlertInfo] = useState({
        showAlert: false,
        type: "info", // Puede ser 'error', 'warning', 'info', 'success'
        message: "",
    });

    //Compartir Projecto
    const shareProject_uidd = async (project) => {
        // Construye la URL del proyecto usando el UUID del proyecto
        const projectUrl = `${window.location.href}`;
        console.log("Compartiendo el proyecto con la URL:", projectUrl);
        if (navigator.share) {
            try {
                await navigator.share({
                    image: [project.images],
                    title: `Proyecto: ${project.field3} - ${project.role}`,
                    text: `Descripción: ${project.field1}`,
                    url: projectUrl,
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
                <AppBar
                    position="fixed"
                    sx={{
                        background: "#f4f4f4",
                        color: "#000",
                        borderBottomLeftRadius: "20px",
                        borderBottomRightRadius: "20px",
                    }}
                >
                    <Toolbar>
                        <IconButton onClick={handleBack} aria-label="Regresar" edge="start">
                            <ArrowBack fontSize="32px" sx={{ color: 'black' }} />
                        </IconButton>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1, textAlign: "center" }}
                        >
                            Detalles del Proyecto
                        </Typography>
                        <IconButton onClick={() => shareProject_uidd(project)}>
                            <Share fontSize="32px" sx={{ color: 'green' }} />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container sx={{ marginTop: 12, marginBottom: 4 }}>
                    {alertInfo.showAlert && (
                        <Alert
                            severity={alertInfo.type}
                            onClose={() => setAlertInfo({ ...alertInfo, showAlert: false })}
                            sx={{ width: "100%", mb: 2, }}
                        >
                            {alertInfo.message}
                        </Alert>
                    )}
                    {project ? (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Typography variant="h5" gutterBottom>

                                {project.field1}
                            </Typography>
                            <ImageList sx={{
                                width: "100%",
                                height: "auto",
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                gap: 2
                            }}>
                                {project.images && project.images.length > 0 && project.images.map((media, index) => (
                                    <ImageListItem key={index} sx={{
                                        borderRadius: 2,
                                        position: "relative",
                                        overflow: "hidden",
                                        height: 250
                                    }}>
                                        {media && media.type === "image" ? (
                                            <>
                                                <img
                                                    style={{
                                                        borderRadius: 10,
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover"
                                                    }}
                                                    src={convertGoogleDriveUrl(media.url, false)}
                                                    alt={`${project.field1}`}
                                                    loading="lazy"
                                                    onLoad={() => console.log('✅ Imagen cargada:', media.url)}
                                                    onError={(e) => {
                                                        // Reintentar una vez antes de mostrar placeholder
                                                        // (React StrictMode en dev causa doble render que aborta la primera carga)
                                                        const img = e.target;
                                                        if (!img.dataset.retried) {
                                                            img.dataset.retried = 'true';
                                                            img.src = convertGoogleDriveUrl(media.url, false);
                                                        } else {
                                                            console.error('❌ Error cargando imagen:', media.url);
                                                            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23999"%3EError cargando imagen%3C/text%3E%3C/svg%3E';
                                                        }
                                                    }}
                                                />
                                                <Box
                                                    component="img"
                                                    src={icono}
                                                    alt="Marca de agua"
                                                    sx={{
                                                        position: "absolute",
                                                        bottom: 0,
                                                        left: -40,
                                                        width: "50%",
                                                        height: "50%",
                                                        objectFit: "contain",
                                                        opacity: 0.15,
                                                        pointerEvents: "none",
                                                    }}
                                                />
                                            </>
                                        ) : null}
                                        <ImageListItemBar
                                            sx={{ borderRadius: 2 }}
                                            title={`${project.field1}`}
                                            actionIcon={
                                                <IconButton
                                                    sx={{ color: "rgba(255, 255, 255, 0.54)", ml: 2 }}
                                                    aria-label={`info about ${project.field1}`}
                                                    aria-haspopup="true"
                                                    size="small"
                                                    onClick={handleClickMenu}
                                                >
                                                    <InfoIcon />
                                                </IconButton>
                                            }
                                        />
                                        <Menu
                                            sx={{ background: "transparent", color: "white" }}
                                            open={openHandle}
                                            anchorEl={anchorEl}
                                            id="account-menu"
                                            onClose={handleClose}
                                            onClick={handleClose}
                                            PaperProps={{
                                                elevation: 0,
                                                sx: {
                                                    overflow: "visible",
                                                    filter: "drop-shadow(0px 1px 1px rgba(0,0,0,0.32))",
                                                    background: "#f4f4f4",
                                                    opacity: "20%",
                                                    mt: 1.5,
                                                    "& .MuiAvatar-root": {
                                                        width: 32,
                                                        height: 32,
                                                        ml: -0.5,
                                                        mr: 1,
                                                    },
                                                    "&::before": {
                                                        content: '""',
                                                        display: "block",
                                                        position: "absolute",
                                                        top: 0,
                                                        right: 14,
                                                        width: 10,
                                                        height: 10,
                                                        bgcolor: "background.paper",
                                                        transform: "translateY(-50%) rotate(45deg)",
                                                        zIndex: 0,
                                                    },
                                                },
                                            }}
                                            transformOrigin={{
                                                horizontal: "right",
                                                vertical: "top",
                                            }}
                                            anchorOrigin={{
                                                horizontal: "right",
                                                vertical: "bottom",
                                            }}
                                        >
                                            <MenuItem onClick={handleClose} sx={{ color: "black" }}>
                                                {project.field1}
                                            </MenuItem>
                                            <Divider />
                                            <MenuItem onClick={handleClose} sx={{ color: "black" }}>
                                                {project.role}
                                            </MenuItem>
                                        </Menu>
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Box>
                    ) : (
                        <Typography variant="h6" textAlign="center">
                            Cargando detalles del proyecto...
                        </Typography>
                    )}
                    {project_video ? (
                        <>
                            <Box>
                                {project_video.videos && project_video.videos.length > 0 ? (
                                    <>
                                        {project_video.videos.map((media, index) => (
                                            <React.Fragment key={index}>
                                                <Typography variant="h6" gutterBottom>
                                                    {`Video 3D ${project.field1} ${index + 1}`}
                                                </Typography>
                                                <Card
                                                    component="li"
                                                    sx={{
                                                        display: "flex",
                                                        flexGrow: 1,
                                                        marginBottom: 2,
                                                        boxShadow: 3,
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            height: 200,
                                                            width: "100%",
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        <CardCover>
                                                            <video
                                                                autoPlay
                                                                loop
                                                                muted
                                                                onLoadedData={() => console.log('✅ Video cargado:', media.url)}
                                                                onError={() => console.error('❌ Error cargando video:', media.url)}
                                                                style={{
                                                                    maxHeight: "100%",
                                                                    width: "100%",

                                                                    borderRadius: 10,
                                                                }}
                                                            >
                                                                <source src={convertGoogleDriveUrl(media.url)} type="video/mp4" />
                                                            </video>
                                                        </CardCover>
                                                        <Box
                                                            component="img"
                                                            src={icono}
                                                            alt="Marca de agua"
                                                            sx={{
                                                                position: "absolute",
                                                                bottom: 0,
                                                                left: 0,
                                                                width: "50%",
                                                                height: "50%",
                                                                objectFit: "contain",
                                                                opacity: 0.15,
                                                                pointerEvents: "none",
                                                            }}
                                                        />
                                                        <CardContent>
                                                            <Typography
                                                                level="body-lg"
                                                                fontWeight="lg"
                                                                mt={{ xs: 18 }}
                                                                sx={{
                                                                    width: 80,
                                                                    color: "#f4f4f4",
                                                                    background: "rgba(0,0,0,0.5)",
                                                                    padding: "10px",
                                                                    justifyContent: "center",
                                                                    textAlign: "center",
                                                                    alignContent: "center",
                                                                    alignItems: "center",
                                                                    top: 20,
                                                                    borderRadius: 20,
                                                                }}
                                                            >
                                                                AIDesign
                                                            </Typography>
                                                        </CardContent>
                                                    </Box>
                                                </Card>
                                            </React.Fragment>
                                        ))}
                                    </>
                                ) : (
                                    <Typography variant="h6" gutterBottom>
                                        Videos 3D Proximamente
                                    </Typography>
                                )}
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography variant="h6" textAlign="center">
                                Cargando videos del proyecto...
                            </Typography>
                        </>
                    )}
                </Container>
            </animated.div>
        </>
    );
}

export default ProjectDetails;
