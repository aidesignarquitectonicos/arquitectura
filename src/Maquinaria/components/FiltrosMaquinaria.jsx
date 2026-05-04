import React from "react";
import {
    Box,
    TextField,
    FormControlLabel,
    Switch,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    InputAdornment,
    Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useMaquinaria } from "../context/MaquinariaContext";

const TIPOS = ["Excavadora", "Retroexcavadora", "Volqueta", "Cargadora", "Compactadora", "Grúa"];

export default function FiltrosMaquinaria() {
    const {
        filtroTipo, setFiltroTipo,
        filtroDisponible, setFiltroDisponible,
        filtroPrecioMax, setFiltroPrecioMax,
        busqueda, setBusqueda,
    } = useMaquinaria();

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid #e0e0e0",
                mb: 3,
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                alignItems: "center",
            }}
        >
            <TextField
                size="small"
                placeholder="Buscar por nombre o marca..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                sx={{ flex: "1 1 200px" }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                        </InputAdornment>
                    ),
                }}
            />

            <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Tipo</InputLabel>
                <Select
                    value={filtroTipo}
                    label="Tipo"
                    onChange={(e) => setFiltroTipo(e.target.value)}
                >
                    <MenuItem value="">Todos</MenuItem>
                    {TIPOS.map((t) => (
                        <MenuItem key={t} value={t}>{t}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                size="small"
                label="Precio máx/hora ($)"
                type="number"
                value={filtroPrecioMax}
                onChange={(e) => setFiltroPrecioMax(e.target.value)}
                sx={{ width: 160 }}
                inputProps={{ min: 0 }}
            />

            <FormControlLabel
                control={
                    <Switch
                        checked={filtroDisponible}
                        onChange={(e) => setFiltroDisponible(e.target.checked)}
                        color="success"
                    />
                }
                label="Solo disponibles"
            />
        </Paper>
    );
}
