import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Typography, Table, TableHead, TableRow, TableCell,
    TableBody, Chip, Skeleton, Select, MenuItem, FormControl,
    InputLabel, Paper, IconButton, Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import Navbar from "../../Presentation/Components/Navbar/Navbar";
import { loadOrdenes, updateEstadoOrden } from "../model/OrdenModel";
import { generatePDF } from "../utils/pdfGenerator";

const ESTADO_COLOR = {
    pagado: "success",
    pendiente: "warning",
    cancelado: "error",
    fallido: "error",
};

export default function HistorialOrdenes() {
    const navigate = useNavigate();
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrdenes = useCallback(async () => {
        setLoading(true);
        const data = await loadOrdenes();
        // Ordenar por fecha descendente
        data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setOrdenes(data);
        setLoading(false);
    }, []);

    useEffect(() => { fetchOrdenes(); }, [fetchOrdenes]);

    const handleEstadoChange = async (id, nuevoEstado) => {
        await updateEstadoOrden(id, nuevoEstado);
        setOrdenes((prev) =>
            prev.map((o) => (o.id === id ? { ...o, estado: nuevoEstado } : o))
        );
    };

    const handleDescargar = (orden) => {
        generatePDF({
            cliente: orden.cliente?.nombre ?? "Cliente",
            items: orden.items ?? [],
            subtotal: orden.subtotal,
            iva: orden.iva,
            total: orden.total,
        });
    };

    const totalIngresos = ordenes
        .filter((o) => o.estado === "pagado")
        .reduce((acc, o) => acc + Number(o.total ?? 0), 0);

    return (
        <>
            <Navbar variant="back" title="Historial de Órdenes" onBack={() => navigate("/admin/maquinaria")} />
            <Box sx={{ pt: 10, pb: 10, px: { xs: 2, sm: 4 }, maxWidth: 1100, mx: "auto" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h5" fontWeight={700}>
                        Historial de Órdenes
                    </Typography>
                    <Paper variant="outlined" sx={{ px: 3, py: 1.5, borderRadius: 3 }}>
                        <Typography variant="body2" color="text.secondary">Total ingresos</Typography>
                        <Typography variant="h6" fontWeight={700} color="success.dark">
                            ${totalIngresos.toFixed(2)}
                        </Typography>
                    </Paper>
                </Box>

                {loading ? (
                    [1, 2, 3, 4].map((n) => <Skeleton key={n} height={60} sx={{ mb: 1 }} />)
                ) : ordenes.length === 0 ? (
                    <Typography color="text.secondary">No hay órdenes registradas.</Typography>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>ID</b></TableCell>
                                <TableCell><b>Cliente</b></TableCell>
                                <TableCell><b>Correo</b></TableCell>
                                <TableCell><b>Fecha</b></TableCell>
                                <TableCell><b>Total</b></TableCell>
                                <TableCell><b>Método</b></TableCell>
                                <TableCell><b>Estado</b></TableCell>
                                <TableCell align="right"><b>Acciones</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ordenes.map((o) => (
                                <TableRow key={o.id} hover>
                                    <TableCell>
                                        <Typography
                                            variant="caption"
                                            sx={{ fontFamily: "monospace", color: "text.secondary" }}
                                        >
                                            {o.id.slice(0, 8)}…
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{o.cliente?.nombre ?? "—"}</TableCell>
                                    <TableCell>{o.cliente?.email ?? "—"}</TableCell>
                                    <TableCell>
                                        {o.fecha
                                            ? new Date(o.fecha).toLocaleDateString("es-EC")
                                            : "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Typography fontWeight={600}>${Number(o.total).toFixed(2)}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={o.metodoPago ?? "—"} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell>
                                        <FormControl size="small" sx={{ minWidth: 110 }}>
                                            <Select
                                                value={o.estado ?? "pendiente"}
                                                onChange={(e) => handleEstadoChange(o.id, e.target.value)}
                                                renderValue={(val) => (
                                                    <Chip
                                                        label={val}
                                                        size="small"
                                                        color={ESTADO_COLOR[val] ?? "default"}
                                                    />
                                                )}
                                            >
                                                <MenuItem value="pagado">pagado</MenuItem>
                                                <MenuItem value="pendiente">pendiente</MenuItem>
                                                <MenuItem value="cancelado">cancelado</MenuItem>
                                                <MenuItem value="fallido">fallido</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Ver confirmación">
                                            <IconButton size="small" onClick={() => navigate(`/ordenes/${o.id}`)}>
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Descargar PDF">
                                            <IconButton size="small" onClick={() => handleDescargar(o)}>
                                                <DownloadIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Box>
        </>
    );
}
