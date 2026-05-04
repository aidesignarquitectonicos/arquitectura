import React, { useEffect } from "react";
import { Box, Grid, Typography, Alert } from "@mui/material";
import Navbar from "../../Presentation/Components/Navbar/Navbar";
import MaquinaCard, { MaquinaCardSkeleton } from "../components/MaquinaCard";
import FiltrosMaquinaria from "../components/FiltrosMaquinaria";
import { useMaquinaria } from "../context/MaquinariaContext";
import CarritoFab from "../components/CarritoFab";

export default function CatalogoMaquinaria() {
    const { maquinasFiltradas, loading, error, fetchMaquinas } = useMaquinaria();

    useEffect(() => {
        fetchMaquinas();
    }, [fetchMaquinas]);

    return (
        <>
            <Navbar
                variant="back"
                title="Alquiler de Maquinaria"
                onBack={() => window.history.back()}
            />
            <Box sx={{ pt: 10, pb: 10, px: { xs: 2, sm: 4 }, maxWidth: 1200, mx: "auto" }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Catálogo de Maquinaria
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Selecciona la maquinaria que necesitas para tu proyecto.
                </Typography>

                <FiltrosMaquinaria />

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Grid container spacing={3}>
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <Grid item xs={12} sm={6} md={4} key={n}>
                                <MaquinaCardSkeleton />
                            </Grid>
                        ))}
                    </Grid>
                ) : maquinasFiltradas.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                        <Typography color="text.secondary">
                            No se encontraron máquinas con los filtros aplicados.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {maquinasFiltradas.map((maquina) => (
                            <Grid item xs={12} sm={6} md={4} key={maquina.id}>
                                <MaquinaCard maquina={maquina} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
            <CarritoFab />
        </>
    );
}
