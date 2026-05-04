import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box, Typography, Chip, Grid, Divider, Tab, Tabs,
    ImageList, ImageListItem, Paper, Rating, TextField,
    Button, Avatar, Alert, Skeleton, IconButton, Dialog,
    DialogContent,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import Navbar from "../../Presentation/Components/Navbar/Navbar";
import { loadMaquina, addReview } from "../model/MaquinariaModel";
import { useCotizacion } from "../context/CotizacionContext";
import CotizacionWidget from "../components/CotizacionWidget";
import CarritoFab from "../components/CarritoFab";

const WHATSAPP_NUMBER = "593999999999"; // ← Cambiar por el número real

function TabPanel({ children, value, index }) {
    return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;
}

export default function DetalleMaquina() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCotizacion();

    const [maquina, setMaquina] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);
    const [zoomImg, setZoomImg] = useState(null);

    // Review form
    const [reviewer, setReviewer] = useState("");
    const [ratingVal, setRatingVal] = useState(5);
    const [comentario, setComentario] = useState("");
    const [reviewSaving, setReviewSaving] = useState(false);
    const [reviewOk, setReviewOk] = useState(false);

    useEffect(() => {
        loadMaquina(id).then((data) => {
            setMaquina(data);
            setLoading(false);
        });
    }, [id]);

    const handleWhatsApp = () => {
        const msg = encodeURIComponent(
            `Hola! Me interesa cotizar la maquinaria: ${maquina?.nombre} (${maquina?.marca})`
        );
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    };

    const handleAgregarCarrito = () => {
        if (!maquina) return;
        addItem({
            maquinaId: maquina.id,
            nombre: maquina.nombre,
            marca: maquina.marca,
            precio: Number(maquina.precioHora) || 0,
            cantidad: 1,
            unidad: "hora",
            operador: false,
            transporte: false,
        });
    };

    const handleEnviarReview = async () => {
        if (!reviewer || !comentario) return;
        setReviewSaving(true);
        await addReview(id, { usuario: reviewer, calificacion: ratingVal, comentario });
        setReviewOk(true);
        setReviewSaving(false);
        setReviewer("");
        setComentario("");
        setRatingVal(5);
        // Reload
        loadMaquina(id).then(setMaquina);
    };

    if (loading) {
        return (
            <>
                <Navbar variant="back" title="Detalle" onBack={() => navigate("/maquinaria")} />
                <Box sx={{ pt: 10, px: 2, maxWidth: 900, mx: "auto" }}>
                    <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3, mb: 2 }} />
                    <Skeleton width="60%" height={40} />
                    <Skeleton width="40%" />
                </Box>
            </>
        );
    }

    if (!maquina) {
        return (
            <>
                <Navbar variant="back" title="No encontrado" onBack={() => navigate("/maquinaria")} />
                <Box sx={{ pt: 12, textAlign: "center" }}>
                    <Typography>Máquina no encontrada.</Typography>
                </Box>
            </>
        );
    }

    const {
        nombre, marca, modelo, año, estado = "Disponible",
        descripcion, specs = {}, imagenes = [], videos = [], reviews = [],
        precioHora, precioDia, precioSemana, ubicacion,
    } = maquina;

    return (
        <>
            <Navbar variant="back" title={nombre} onBack={() => navigate("/maquinaria")} />

            <Box sx={{ pt: 9, pb: 12, px: { xs: 2, sm: 4 }, maxWidth: 960, mx: "auto" }}>

                {/* Hero imagen */}
                {imagenes[0] && (
                    <Box
                        component="img"
                        src={imagenes[0]}
                        alt={nombre}
                        onClick={() => setZoomImg(imagenes[0])}
                        sx={{
                            width: "100%",
                            maxHeight: 340,
                            objectFit: "cover",
                            borderRadius: 3,
                            mb: 3,
                            cursor: "zoom-in",
                        }}
                    />
                )}

                {/* Info básica */}
                <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1, mb: 1 }}>
                    <Box>
                        <Typography variant="h5" fontWeight={700}>{nombre}</Typography>
                        <Typography color="text.secondary">{marca}{modelo ? ` — ${modelo}` : ""}{año ? ` (${año})` : ""}</Typography>
                    </Box>
                    <Chip
                        label={estado}
                        color={estado === "Disponible" ? "success" : "error"}
                        sx={{ fontWeight: 700, height: 32, alignSelf: "center" }}
                    />
                </Box>

                {/* Precios */}
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                    {precioHora && <Chip label={`$${precioHora}/hora`} color="primary" variant="outlined" />}
                    {precioDia && <Chip label={`$${precioDia}/día`} color="primary" variant="outlined" />}
                    {precioSemana && <Chip label={`$${precioSemana}/semana`} color="primary" variant="outlined" />}
                    {ubicacion && <Chip label={`📍 ${ubicacion}`} variant="outlined" />}
                </Box>

                {/* Botones acción */}
                <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                    <Button
                        variant="contained"
                        startIcon={<AddShoppingCartIcon />}
                        onClick={handleAgregarCarrito}
                        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                    >
                        Agregar al carrito
                    </Button>
                    <Button
                        variant="outlined"
                        color="success"
                        startIcon={<WhatsAppIcon />}
                        onClick={handleWhatsApp}
                        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                    >
                        Contactar por WhatsApp
                    </Button>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Tabs */}
                <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
                    <Tab label="Descripción" />
                    <Tab label="Especificaciones" />
                    <Tab label="Galería" />
                    <Tab label="Videos" />
                    <Tab label="Cotizar" />
                    <Tab label={`Reseñas (${reviews.length})`} />
                </Tabs>

                {/* Descripción */}
                <TabPanel value={tab} index={0}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                        {descripcion || "Sin descripción disponible."}
                    </Typography>
                </TabPanel>

                {/* Especificaciones */}
                <TabPanel value={tab} index={1}>
                    {Object.keys(specs).length === 0 ? (
                        <Typography color="text.secondary">Sin especificaciones registradas.</Typography>
                    ) : (
                        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
                            {Object.entries(specs).map(([key, val], i) => (
                                <Box
                                    key={key}
                                    sx={{
                                        display: "flex",
                                        px: 2,
                                        py: 1.5,
                                        bgcolor: i % 2 === 0 ? "#f9f9f9" : "white",
                                    }}
                                >
                                    <Typography fontWeight={600} sx={{ minWidth: 160, textTransform: "capitalize" }}>
                                        {key}
                                    </Typography>
                                    <Typography color="text.secondary">{val}</Typography>
                                </Box>
                            ))}
                        </Paper>
                    )}
                </TabPanel>

                {/* Galería */}
                <TabPanel value={tab} index={2}>
                    {imagenes.length === 0 ? (
                        <Typography color="text.secondary">Sin imágenes disponibles.</Typography>
                    ) : (
                        <ImageList cols={3} gap={8} sx={{ borderRadius: 2, overflow: "hidden" }}>
                            {imagenes.map((url, i) => (
                                <ImageListItem
                                    key={i}
                                    onClick={() => setZoomImg(url)}
                                    sx={{ cursor: "zoom-in", borderRadius: 2, overflow: "hidden" }}
                                >
                                    <img
                                        src={url}
                                        alt={`${nombre} ${i + 1}`}
                                        loading="lazy"
                                        style={{ borderRadius: 8 }}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    )}
                </TabPanel>

                {/* Videos */}
                <TabPanel value={tab} index={3}>
                    {videos.length === 0 ? (
                        <Typography color="text.secondary">Sin videos disponibles.</Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {videos.map((url, i) => (
                                <Grid item xs={12} sm={6} key={i}>
                                    {url.includes("youtube.com") || url.includes("youtu.be") ? (
                                        <Box
                                            component="iframe"
                                            src={url.replace("watch?v=", "embed/")}
                                            title={`Video ${i + 1}`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            sx={{ width: "100%", height: 220, borderRadius: 2, border: "none" }}
                                        />
                                    ) : (
                                        <Box
                                            component="video"
                                            src={url}
                                            controls
                                            sx={{ width: "100%", borderRadius: 2 }}
                                        />
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </TabPanel>

                {/* Cotizar */}
                <TabPanel value={tab} index={4}>
                    <CotizacionWidget maquina={maquina} />
                </TabPanel>

                {/* Reseñas */}
                <TabPanel value={tab} index={5}>
                    {reviews.map((r) => (
                        <Paper key={r.id} variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                                    {r.usuario?.[0]?.toUpperCase() ?? "?"}
                                </Avatar>
                                <Typography fontWeight={600}>{r.usuario}</Typography>
                                <Rating value={r.calificacion} readOnly size="small" />
                            </Box>
                            <Typography variant="body2" color="text.secondary">{r.comentario}</Typography>
                        </Paper>
                    ))}

                    <Divider sx={{ my: 2 }} />
                    <Typography fontWeight={600} gutterBottom>Deja tu reseña</Typography>
                    {reviewOk && (
                        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setReviewOk(false)}>
                            Reseña enviada. ¡Gracias!
                        </Alert>
                    )}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 480 }}>
                        <TextField
                            label="Tu nombre"
                            size="small"
                            value={reviewer}
                            onChange={(e) => setReviewer(e.target.value)}
                        />
                        <Box>
                            <Typography variant="body2" mb={0.5}>Calificación</Typography>
                            <Rating value={ratingVal} onChange={(_, v) => setRatingVal(v)} />
                        </Box>
                        <TextField
                            label="Comentario"
                            size="small"
                            multiline
                            rows={3}
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            onClick={handleEnviarReview}
                            disabled={reviewSaving || !reviewer || !comentario}
                            sx={{ alignSelf: "flex-start", borderRadius: 2, textTransform: "none" }}
                        >
                            {reviewSaving ? "Enviando..." : "Enviar reseña"}
                        </Button>
                    </Box>
                </TabPanel>
            </Box>

            {/* Zoom de imagen */}
            <Dialog open={!!zoomImg} onClose={() => setZoomImg(null)} maxWidth="lg">
                <DialogContent sx={{ p: 0, position: "relative" }}>
                    <IconButton
                        onClick={() => setZoomImg(null)}
                        sx={{ position: "absolute", top: 8, right: 8, bgcolor: "rgba(0,0,0,0.5)", color: "white" }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <img src={zoomImg} alt="zoom" style={{ maxWidth: "90vw", maxHeight: "85vh", display: "block" }} />
                </DialogContent>
            </Dialog>

            <CarritoFab />
        </>
    );
}
