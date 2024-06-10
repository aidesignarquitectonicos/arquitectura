import React, { useEffect, useState } from "react";
import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import GalleryView from "../../Components/View/GalleryView";


function Gallery() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    background: "#f4f4f4",
                    color: "#000",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
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
