import React, { useEffect, useState, useCallback } from "react";
import {
    Box, Typography, Paper, Grid, Button, TextField, Select, MenuItem,
    InputLabel, FormControl, Divider, IconButton, Chip, Tab, Tabs, Alert,
    Table, TableHead, TableRow, TableCell, TableBody, Skeleton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Navbar from "../../Presentation/Components/Navbar/Navbar";
import {
    loadMaquinas, createMaquina, updateMaquina, deleteMaquina, loadCotizaciones,
} from "../model/MaquinariaModel";
import { useNavigate } from "react-router-dom";

const TIPOS = ["Excavadora", "Retroexcavadora", "Volqueta", "Cargadora", "Compactadora", "Grúa"];

const emptyForm = {
    nombre: "", marca: "", modelo: "", año: "", tipo: "",
    descripcion: "", estado: "Disponible",
    precioHora: "", precioDia: "", precioSemana: "",
    ubicacion: "",
    specs: {},
    imagenes: [],
    videos: [],
};

function TabPanel({ children, value, index }) {
    return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;
}

export default function AdminMaquinaria() {
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const [maquinas, setMaquinas] = useState([]);
    const [cotizaciones, setCotizaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [ok, setOk] = useState(false);
    const [error, setError] = useState(null);

    // Manejo de specs
    const [specKey, setSpecKey] = useState("");
    const [specVal, setSpecVal] = useState("");

    // Manejo de imagenes/videos (URLs)
    const [newImgUrl, setNewImgUrl] = useState("");
    const [newVideoUrl, setNewVideoUrl] = useState("");

    const fetchAll = useCallback(async () => {
        setLoading(true);
        const [maq, cot] = await Promise.all([loadMaquinas(), loadCotizaciones()]);
        setMaquinas(maq);
        setCotizaciones(cot);
        setLoading(false);
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const handleChange = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleAddSpec = () => {
        if (!specKey) return;
        setForm((prev) => ({ ...prev, specs: { ...prev.specs, [specKey]: specVal } }));
        setSpecKey(""); setSpecVal("");
    };

    const handleRemoveSpec = (key) => {
        const { [key]: _, ...rest } = form.specs;
        setForm((prev) => ({ ...prev, specs: rest }));
    };

    const handleAddImagen = () => {
        if (!newImgUrl) return;
        setForm((prev) => ({ ...prev, imagenes: [...prev.imagenes, newImgUrl] }));
        setNewImgUrl("");
    };

    const handleRemoveImagen = (idx) => {
        setForm((prev) => ({ ...prev, imagenes: prev.imagenes.filter((_, i) => i !== idx) }));
    };

    const handleAddVideo = () => {
        if (!newVideoUrl) return;
        setForm((prev) => ({ ...prev, videos: [...prev.videos, newVideoUrl] }));
        setNewVideoUrl("");
    };

    const handleRemoveVideo = (idx) => {
        setForm((prev) => ({ ...prev, videos: prev.videos.filter((_, i) => i !== idx) }));
    };

    const handleEdit = (maquina) => {
        setEditingId(maquina.id);
        setForm({
            nombre: maquina.nombre ?? "",
            marca: maquina.marca ?? "",
            modelo: maquina.modelo ?? "",
            año: maquina.año ?? "",
            tipo: maquina.tipo ?? "",
            descripcion: maquina.descripcion ?? "",
            estado: maquina.estado ?? "Disponible",
            precioHora: maquina.precioHora ?? "",
            precioDia: maquina.precioDia ?? "",
            precioSemana: maquina.precioSemana ?? "",
            ubicacion: maquina.ubicacion ?? "",
            specs: maquina.specs ?? {},
            imagenes: maquina.imagenes ?? [],
            videos: maquina.videos ?? [],
        });
        setTab(0);
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm(emptyForm);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar esta máquina?")) return;
        await deleteMaquina(id);
        fetchAll();
    };

    const handleSave = async () => {
        if (!form.nombre || !form.marca) {
            setError("Nombre y marca son requeridos.");
            return;
        }
        setSaving(true);
        setError(null);
        try {
            const data = {
                ...form,
                precioHora: Number(form.precioHora) || 0,
                precioDia: Number(form.precioDia) || 0,
                precioSemana: Number(form.precioSemana) || 0,
            };
            if (editingId) {
                await updateMaquina(editingId, data);
            } else {
                await createMaquina(data);
            }
            setOk(true);
            setEditingId(null);
            setForm(emptyForm);
            fetchAll();
        } catch (e) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Navbar variant="back" title="Admin — Maquinaria" onBack={() => navigate("/maquinaria")} />
            <Box sx={{ pt: 10, pb: 10, px: { xs: 2, sm: 4 }, maxWidth: 1100, mx: "auto" }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Panel de Administración
                </Typography>

                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                    <Tab label={editingId ? "✏️ Editar Máquina" : "➕ Nueva Máquina"} />
                    <Tab label="Lista de Máquinas" />
                    <Tab label="Cotizaciones" />
                </Tabs>

                {/* ── FORMULARIO ── */}
                <TabPanel value={tab} index={0}>
                    {ok && (
                        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setOk(false)}>
                            {editingId ? "Actualizado" : "Creado"} correctamente.
                        </Alert>
                    )}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Nombre *" fullWidth size="small" value={form.nombre} onChange={handleChange("nombre")} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Marca *" fullWidth size="small" value={form.marca} onChange={handleChange("marca")} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField label="Modelo" fullWidth size="small" value={form.modelo} onChange={handleChange("modelo")} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField label="Año" fullWidth size="small" value={form.año} onChange={handleChange("año")} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Tipo</InputLabel>
                                    <Select value={form.tipo} label="Tipo" onChange={handleChange("tipo")}>
                                        {TIPOS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Estado</InputLabel>
                                    <Select value={form.estado} label="Estado" onChange={handleChange("estado")}>
                                        <MenuItem value="Disponible">Disponible</MenuItem>
                                        <MenuItem value="Ocupado">Ocupado</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField label="Precio/hora ($)" type="number" fullWidth size="small" value={form.precioHora} onChange={handleChange("precioHora")} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField label="Precio/día ($)" type="number" fullWidth size="small" value={form.precioDia} onChange={handleChange("precioDia")} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Precio/semana ($)" type="number" fullWidth size="small" value={form.precioSemana} onChange={handleChange("precioSemana")} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Ubicación" fullWidth size="small" value={form.ubicacion} onChange={handleChange("ubicacion")} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="Descripción" fullWidth size="small" multiline rows={3} value={form.descripcion} onChange={handleChange("descripcion")} />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        {/* Specs */}
                        <Typography fontWeight={600} gutterBottom>Especificaciones técnicas</Typography>
                        <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
                            <TextField label="Clave (ej: peso)" size="small" value={specKey} onChange={(e) => setSpecKey(e.target.value)} sx={{ width: 180 }} />
                            <TextField label="Valor (ej: 20t)" size="small" value={specVal} onChange={(e) => setSpecVal(e.target.value)} sx={{ width: 180 }} />
                            <Button variant="outlined" size="small" onClick={handleAddSpec} startIcon={<AddIcon />}>Agregar</Button>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                            {Object.entries(form.specs).map(([k, v]) => (
                                <Chip key={k} label={`${k}: ${v}`} onDelete={() => handleRemoveSpec(k)} />
                            ))}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Imágenes */}
                        <Typography fontWeight={600} gutterBottom>Imágenes (URLs)</Typography>
                        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                            <TextField label="URL de imagen" size="small" sx={{ flex: 1 }} value={newImgUrl} onChange={(e) => setNewImgUrl(e.target.value)} />
                            <Button variant="outlined" size="small" onClick={handleAddImagen} startIcon={<AddIcon />}>Agregar</Button>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
                            {form.imagenes.map((url, i) => (
                                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography variant="body2" noWrap sx={{ flex: 1, maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis" }}>{url}</Typography>
                                    <IconButton size="small" color="error" onClick={() => handleRemoveImagen(i)}><DeleteIcon fontSize="small" /></IconButton>
                                </Box>
                            ))}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Videos */}
                        <Typography fontWeight={600} gutterBottom>Videos (URLs de YouTube o Google Drive)</Typography>
                        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                            <TextField label="URL de video" size="small" sx={{ flex: 1 }} value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} />
                            <Button variant="outlined" size="small" onClick={handleAddVideo} startIcon={<AddIcon />}>Agregar</Button>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
                            {form.videos.map((url, i) => (
                                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography variant="body2" noWrap sx={{ flex: 1, maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis" }}>{url}</Typography>
                                    <IconButton size="small" color="error" onClick={() => handleRemoveVideo(i)}><DeleteIcon fontSize="small" /></IconButton>
                                </Box>
                            ))}
                        </Box>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={handleSave}
                                disabled={saving}
                                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                            >
                                {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear Máquina"}
                            </Button>
                            {editingId && (
                                <Button variant="outlined" onClick={handleCancelEdit} sx={{ borderRadius: 2, textTransform: "none" }}>
                                    Cancelar
                                </Button>
                            )}
                        </Box>
                    </Paper>
                </TabPanel>

                {/* ── LISTA DE MÁQUINAS ── */}
                <TabPanel value={tab} index={1}>
                    {loading ? (
                        [1, 2, 3].map((n) => <Skeleton key={n} height={60} sx={{ mb: 1 }} />)
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>Nombre</b></TableCell>
                                    <TableCell><b>Marca</b></TableCell>
                                    <TableCell><b>Tipo</b></TableCell>
                                    <TableCell><b>Estado</b></TableCell>
                                    <TableCell><b>$/hora</b></TableCell>
                                    <TableCell align="right"><b>Acciones</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {maquinas.map((m) => (
                                    <TableRow key={m.id} hover>
                                        <TableCell>{m.nombre}</TableCell>
                                        <TableCell>{m.marca}</TableCell>
                                        <TableCell>{m.tipo}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={m.estado}
                                                size="small"
                                                color={m.estado === "Disponible" ? "success" : "error"}
                                            />
                                        </TableCell>
                                        <TableCell>${m.precioHora}</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={() => handleEdit(m)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDelete(m.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </TabPanel>

                {/* ── COTIZACIONES ── */}
                <TabPanel value={tab} index={2}>
                    {loading ? (
                        [1, 2, 3].map((n) => <Skeleton key={n} height={60} sx={{ mb: 1 }} />)
                    ) : cotizaciones.length === 0 ? (
                        <Typography color="text.secondary">Sin cotizaciones registradas.</Typography>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>Cliente</b></TableCell>
                                    <TableCell><b>Fecha</b></TableCell>
                                    <TableCell><b>Total</b></TableCell>
                                    <TableCell><b>Máquinas</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cotizaciones.map((c) => (
                                    <TableRow key={c.id} hover>
                                        <TableCell>{c.cliente}</TableCell>
                                        <TableCell>
                                            {c.fecha ? new Date(c.fecha).toLocaleDateString("es-EC") : "—"}
                                        </TableCell>
                                        <TableCell>${Number(c.total).toFixed(2)}</TableCell>
                                        <TableCell>
                                            {(c.items ?? []).map((i, idx) => (
                                                <Chip key={idx} label={i.nombre} size="small" sx={{ mr: 0.5 }} />
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </TabPanel>
            </Box>
        </>
    );
}
