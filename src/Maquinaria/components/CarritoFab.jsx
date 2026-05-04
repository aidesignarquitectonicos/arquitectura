import React, { useState } from "react";
import {
    Fab, Badge, Drawer, Box, Typography, IconButton,
    Divider, Button, Paper, TextField, Alert,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CloseIcon from "@mui/icons-material/Close";
import { useCotizacion, calcularItem } from "../context/CotizacionContext";
import { saveCotizacion } from "../model/MaquinariaModel";
import { generatePDF } from "../utils/pdfGenerator";

const WHATSAPP_NUMBER = "593999999999";

export default function CarritoFab() {
    const { items, removeItem, clearCart, totales } = useCotizacion();
    const [open, setOpen] = useState(false);
    const [clienteNombre, setClienteNombre] = useState("");
    const [guardado, setGuardado] = useState(false);

    const handleDescargarPDF = () => {
        const enriched = items.map((i) => ({ ...i, ...calcularItem(i) }));
        generatePDF({
            cliente: clienteNombre || "Cliente",
            items: enriched,
            ...totales,
        });
    };

    const handleWhatsApp = () => {
        const lineas = items.map(
            (i) => `• ${i.nombre}: ${i.cantidad} ${i.unidad}(s) — $${calcularItem(i).total.toFixed(2)}`
        );
        const msg = encodeURIComponent(
            `Hola! Solicito cotización para:\n${lineas.join("\n")}\nTotal: $${totales.total.toFixed(2)}`
        );
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    };

    const handleGuardar = async () => {
        const enriched = items.map((i) => ({ ...i, ...calcularItem(i) }));
        await saveCotizacion({
            cliente: clienteNombre || "Anónimo",
            items: enriched,
            ...totales,
        });
        setGuardado(true);
    };

    return (
        <>
            <Fab
                color="primary"
                onClick={() => setOpen(true)}
                sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1200 }}
            >
                <Badge badgeContent={items.length} color="error">
                    <ShoppingCartIcon />
                </Badge>
            </Fab>

            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                <Box sx={{ width: { xs: "100vw", sm: 400 }, p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6" fontWeight={700}>Carrito de Cotización</Typography>
                        <IconButton onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {items.length === 0 ? (
                        <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography color="text.secondary">El carrito está vacío.</Typography>
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ flex: 1, overflowY: "auto" }}>
                                {items.map((item) => {
                                    const calc = calcularItem(item);
                                    return (
                                        <Paper
                                            key={item.maquinaId}
                                            variant="outlined"
                                            sx={{ p: 2, mb: 2, borderRadius: 2 }}
                                        >
                                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                <Box>
                                                    <Typography fontWeight={600}>{item.nombre}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {item.marca} — {item.cantidad} {item.unidad}(s)
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {item.operador ? "Con operador" : "Sin operador"} ·{" "}
                                                        {item.transporte ? "Con transporte" : "Sin transporte"}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ textAlign: "right" }}>
                                                    <Typography fontWeight={700} color="primary">
                                                        ${calc.total.toFixed(2)}
                                                    </Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => removeItem(item.maquinaId)}
                                                        color="error"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    );
                                })}
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                    <Typography variant="body2">Subtotal</Typography>
                                    <Typography variant="body2">${totales.subtotal.toFixed(2)}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                    <Typography variant="body2">IVA (12%)</Typography>
                                    <Typography variant="body2">${totales.iva.toFixed(2)}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography fontWeight={700}>TOTAL</Typography>
                                    <Typography fontWeight={700} color="primary">
                                        ${totales.total.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>

                            <TextField
                                label="Nombre del cliente"
                                size="small"
                                fullWidth
                                value={clienteNombre}
                                onChange={(e) => setClienteNombre(e.target.value)}
                                sx={{ mb: 2 }}
                            />

                            {guardado && (
                                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setGuardado(false)}>
                                    Cotización guardada en Firebase.
                                </Alert>
                            )}

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleGuardar}
                                    sx={{ borderRadius: 2, textTransform: "none" }}
                                >
                                    Guardar cotización
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={handleDescargarPDF}
                                    sx={{ borderRadius: 2, textTransform: "none" }}
                                >
                                    Descargar Proforma PDF
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="success"
                                    startIcon={<WhatsAppIcon />}
                                    onClick={handleWhatsApp}
                                    sx={{ borderRadius: 2, textTransform: "none" }}
                                >
                                    Enviar por WhatsApp
                                </Button>
                                <Button
                                    variant="text"
                                    color="error"
                                    onClick={clearCart}
                                    sx={{ borderRadius: 2, textTransform: "none" }}
                                >
                                    Vaciar carrito
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Drawer>
        </>
    );
}
