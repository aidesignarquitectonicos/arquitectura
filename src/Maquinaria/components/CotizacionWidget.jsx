import React, { useState } from "react";
import {
    Box, Typography, ToggleButtonGroup, ToggleButton, TextField,
    FormControlLabel, Switch, Divider, Button, Paper, Alert,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { calcularItem } from "../context/CotizacionContext";
import { useCotizacion } from "../context/CotizacionContext";
import { saveCotizacion } from "../model/MaquinariaModel";
import { generatePDF } from "../utils/pdfGenerator";

const WHATSAPP_NUMBER = "593999999999"; // ← Cambiar por número real
const IVA_LABEL = "12%";

export default function CotizacionWidget({ maquina }) {
    const { addItem } = useCotizacion();

    const [unidad, setUnidad] = useState("hora");
    const [cantidad, setCantidad] = useState(1);
    const [operador, setOperador] = useState(false);
    const [transporte, setTransporte] = useState(false);
    const [guardado, setGuardado] = useState(false);
    const [clienteNombre, setClienteNombre] = useState("");

    const precio = Number(
        unidad === "hora" ? maquina.precioHora :
        unidad === "dia" ? maquina.precioDia :
        maquina.precioSemana
    ) || 0;

    const item = {
        maquinaId: maquina.id,
        nombre: maquina.nombre,
        marca: maquina.marca,
        precio,
        cantidad: Number(cantidad) || 1,
        unidad,
        operador,
        transporte,
    };

    const { base, extras, subtotal, iva, total } = calcularItem(item);

    const handleDescargarPDF = () => {
        generatePDF({
            cliente: clienteNombre || "Cliente",
            items: [{ ...item, ...calcularItem(item) }],
            subtotal,
            iva,
            total,
        });
    };

    const handleWhatsApp = () => {
        const msg = encodeURIComponent(
            `Hola! Solicito cotización:\n` +
            `Máquina: ${maquina.nombre} (${maquina.marca})\n` +
            `Tiempo: ${cantidad} ${unidad}(s)\n` +
            `Operador: ${operador ? "Sí" : "No"} | Transporte: ${transporte ? "Sí" : "No"}\n` +
            `Total estimado: $${total.toFixed(2)}`
        );
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    };

    const handleGuardarCarrito = async () => {
        addItem(item);
        setGuardado(true);
        await saveCotizacion({
            cliente: clienteNombre || "Anónimo",
            items: [{ ...item, subtotal, iva, total }],
            subtotal,
            iva,
            total,
        });
    };

    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, maxWidth: 480 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
                Cotizador — {maquina.nombre}
            </Typography>

            <TextField
                label="Tu nombre (opcional)"
                size="small"
                fullWidth
                value={clienteNombre}
                onChange={(e) => setClienteNombre(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Typography variant="body2" fontWeight={600} gutterBottom>Unidad de tiempo</Typography>
            <ToggleButtonGroup
                value={unidad}
                exclusive
                onChange={(_, v) => v && setUnidad(v)}
                size="small"
                sx={{ mb: 2 }}
            >
                <ToggleButton value="hora">Horas</ToggleButton>
                <ToggleButton value="dia">Días</ToggleButton>
                <ToggleButton value="semana">Semanas</ToggleButton>
            </ToggleButtonGroup>

            <TextField
                label={`Cantidad (${unidad}s)`}
                type="number"
                size="small"
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
                inputProps={{ min: 1 }}
                sx={{ mb: 2, display: "block", width: 140 }}
            />

            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <FormControlLabel
                    control={<Switch checked={operador} onChange={(e) => setOperador(e.target.checked)} />}
                    label="Operador"
                />
                <FormControlLabel
                    control={<Switch checked={transporte} onChange={(e) => setTransporte(e.target.checked)} />}
                    label="Transporte"
                />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Resumen */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">Precio base ({cantidad} {unidad}s × ${precio})</Typography>
                    <Typography variant="body2">${base.toFixed(2)}</Typography>
                </Box>
                {extras > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2">Extras</Typography>
                        <Typography variant="body2">${extras.toFixed(2)}</Typography>
                    </Box>
                )}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">IVA ({IVA_LABEL})</Typography>
                    <Typography variant="body2">${iva.toFixed(2)}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography fontWeight={700}>TOTAL</Typography>
                    <Typography fontWeight={700} color="primary">${total.toFixed(2)}</Typography>
                </Box>
            </Box>

            {guardado && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setGuardado(false)}>
                    Agregado al carrito de cotización.
                </Alert>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button
                    variant="contained"
                    onClick={handleGuardarCarrito}
                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                >
                    Agregar al carrito
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDescargarPDF}
                    sx={{ borderRadius: 2, textTransform: "none" }}
                >
                    Descargar Proforma (PDF)
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
            </Box>
        </Paper>
    );
}
