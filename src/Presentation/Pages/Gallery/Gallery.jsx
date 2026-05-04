import React from "react";
import { Box } from "@mui/material";
import { Share } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import GalleryView from "../../Components/View/GalleryView";
import Navbar from "../../Components/Navbar/Navbar";

function Gallery() {


    const handleBack = () => {
        window.location.href = 'https://aidesignarquitectonicos.github.io/arquitectura/';
    };


    return (
        <>
            <Navbar
                variant="back"
                title="Proyectos"
                onBack={handleBack}
                rightAction={
                                            <IconButton
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: "AIDesign Arquitectónicos",
                                        text: "Conoce nuestros proyectos",
                                        url: window.location.href,
                                    }).catch((error) => console.log("Error al compartir", error));
                                }
                            }}
                            aria-label="Compartir"
                            sx={{ color: "#000" }}
                        >
                            <Share fontSize="32px" sx={{ color: 'green' }} />
                        </IconButton>
                }
            />
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
