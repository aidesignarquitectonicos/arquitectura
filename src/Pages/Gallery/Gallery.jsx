import React from "react";
import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";
import { ArrowBack, Share } from "@mui/icons-material";
import GalleryView from "../../Components/View/GalleryView";


function Gallery() {


    const handleBack = () => {
        window.location.href = 'https://aidesignarquitectonicos.github.io/arquitectura/';
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
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <IconButton onClick={handleBack} aria-label="Regresar">
                        <ArrowBack sx={{ color: 'black' }} fontSize="32px" />
                    </IconButton>
                    <Typography sx={{
                        fontFamily: "'Poppins', sans-serif",
                        color: '#000',
                        fontWeight: "bold",
                        fontSize: "1.3rem",
                    }}>Proyectos</Typography>
                    <IconButton
                        onClick={() => {
                            // Lógica para compartir
                            if (navigator.share) {
                                navigator
                                    .share({
                                        title: "AIDesign Arquitectónicos",
                                        text: "Conoce nuestros proyectos",
                                        url: window.location.href,
                                    })
                                    .then(() => console.log("Contenido compartido"))
                                    .catch((error) => console.log("Error al compartir", error));
                            }
                        }
                        }
                        aria-label="Compartir"
                        sx={{ color: "#000" }}
                    >
                        <Share fontSize="32px" sx={{ color: 'green' }} />
                    </IconButton>

                </Toolbar>
            </AppBar>
            <Box
                maxWidth="sm"
                sx={{
                    overflowY: "auto",
                    padding: "20px",
                    marginTop: 6,
                    marginBottom: 4,
                    maxWidth: "100%",
                }}
            >
                <GalleryView />
            </Box>
        </>
    );
}

export default Gallery;
