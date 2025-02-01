import React from "react";
import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
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
                <Toolbar>
                    <IconButton onClick={handleBack} aria-label="Regresar">
                        <ArrowBack fontSize="32px" />
                    </IconButton>
                    <Typography>Gallery</Typography>
                </Toolbar>
            </AppBar>
            <Box
                maxWidth="sm"
                sx={{
                    overflowY: "auto",
                    padding: "20px",
                    marginTop: 8,
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
