import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box, Typography, Paper, Divider, Button, Chip,
    CircularProgress, Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import HomeIcon from "@mui/icons-material/Home";
import Navbar from "../../Presentation/Components/Navbar/Navbar";
import { loadOrden } from "../model/OrdenModel";
import { generatePDF } from "../utils/pdfGenerator";

const WHATSAPP_NUMBER = "593999999999"; // ← Cambiar por el número real

export default function ConfirmacionOrden() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orden, setOrden] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadOrden(id)
            .then((data) => {
                if (!data) setError("Orden no encontrada.");
                else setOrden(data);
            })
            .catch(() => setError("Error al cargar la orden."))
            .finally(() => setLoading(false));
    }, [id]);

    const handleDescargarPDF = () => {
        if (!orden) return;
        generatePDF({
            cliente: orden.cliente?.nombre ?? "Cliente",
            items: orden.items ?? [],
            subtotal: orden.subtotal,
            iva: orden.iva,
            total: orden.total,
        });
    };

    const handleWhatsApp = () => {
        if (!orden) return;
        const lineas = (orden.items ?? []).map(
            (i) => `• ${i.nombre}: ${i.cantidad} ${i.unidad}(s) — $${Number(i.total ?? 0).toFixed(2)}`
        );
        const msg = encodeURIComponent(
            `✅ Confirmación de pago — AIDesign Maquinaria\n` +
            `Cliente: ${orden.cliente?.nombre}\n` +
            `${lineas.join("\n")}\n` +
            `Total pagado: $${Number(orden.total).toFixed(2)}\n` +
            `Fecha: ${orden.fecha ? new Date(orden.fecha).toLocaleDateString("es-EC") : "—"}`
        );
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    };

    return (
        <>
            <Navbar variant="back" title="Confirmación de pago" onBack={() => navigate("/maquinaria")} />
            <Box sx={{ pt: 10, pb: 10, px: { xs: 2, sm: 4 }, maxWidth: 640, mx: "auto" }}>

                {loading && (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && <Alert severity="error">{error}</Alert>}

                {!loading && orden && (
                    <>
                        {/* Banner de éxito */}
                        <Paper
                            sx={{
                                p: 4, borderRadius: 3, textAlign: "center", mb: 3,
                                background: "linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)",
                                border: "1px solid #a5d6a7",
                            }}
                        >
                            <CheckCircleIcon sx={{ fontSize: 64, color: "#2e7d32", mb: 1 }} />
                            <Typography variant="h5" fontWeight={700} color="success.dark">
                                ¡Pago exitoso!
                            </Typography>
                            <Typography color="text.secondary" mt={0.5}>
                                Tu orden ha sido confirmada y registrada.
                            </Typography>
                            <Chip
                                label={`Orden #${id}`}
                                size="small"
                                variant="outlined"
                                color="success"
                                sx={{ mt: 1.5, fontFamily: "monospace" }}
                            />
                        </Paper>

                        {/* Detalle de la orden */}
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Detalle de la orden
                            </Typography>
                            <Box sx={{ mb: 1.5 }}>
                                <Typography variant="body2">
                                    <strong>Cliente:</strong> {orden.cliente?.nombre}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Correo:</strong> {orden.cliente?.email}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Fecha:</strong>{" "}
                                    {orden.fecha
                                        ? new Date(orden.fecha).toLocaleString("es-EC")
                                        : "—"}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Método de pago:</strong>{" "}
                                    <Chip label={orden.metodoPago ?? "tarjeta"} size="small" />
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {(orden.items ?? []).map((item, i) => (
                                <Box key={i} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                    <Box>
                                        <Typography variant="body2" fontWeight={600}>{item.nombre}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.cantidad} {item.unidad}(s)
                                            {item.operador ? " · Con operador" : ""}
                                            {item.transporte ? " · Con transporte" : ""}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" fontWeight={600}>
                                        ${Number(item.total ?? 0).toFixed(2)}
                                    </Typography>
                                </Box>
                            ))}

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography variant="body2">Subtotal</Typography>
                                <Typography variant="body2">${Number(orden.subtotal).toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography variant="body2">IVA (12%)</Typography>
                                <Typography variant="body2">${Number(orden.iva).toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography fontWeight={700}>TOTAL PAGADO</Typography>
                                <Typography fontWeight={700} color="success.dark" fontSize={18}>
                                    ${Number(orden.total).toFixed(2)}
                                </Typography>
                            </Box>
                        </Paper>

                        {/* Acciones */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                            <Button
                                variant="contained"
                                startIcon={<DownloadIcon />}
                                onClick={handleDescargarPDF}
                                sx={{ py: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                            >
                                Descargar comprobante PDF
                            </Button>
                            <Button
                                variant="outlined"
                                color="success"
                                startIcon={<WhatsAppIcon />}
                                onClick={handleWhatsApp}
                                sx={{ py: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                            >
                                Enviar resumen por WhatsApp
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<HomeIcon />}
                                onClick={() => navigate("/maquinaria")}
                                sx={{ py: 1.5, borderRadius: 2, textTransform: "none" }}
                            >
                                Volver al catálogo
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </>
    );
}
