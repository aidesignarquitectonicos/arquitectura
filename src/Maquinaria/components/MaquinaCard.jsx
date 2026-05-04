import React from "react";
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Chip,
    Button,
    Box,
    Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const PLACEHOLDER = "https://via.placeholder.com/400x250?text=Maquinaria";

export function MaquinaCardSkeleton() {
    return (
        <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Skeleton variant="rectangular" height={180} />
            <CardContent>
                <Skeleton width="60%" />
                <Skeleton width="40%" />
                <Skeleton width="80%" />
            </CardContent>
        </Card>
    );
}

export default function MaquinaCard({ maquina }) {
    const navigate = useNavigate();
    const { id, nombre, marca, precioHora, precioDia, imagenes = [], estado = "Disponible" } = maquina;

    const disponible = estado === "Disponible";
    const imagen = imagenes[0] ?? PLACEHOLDER;

    return (
        <Card
            sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
            }}
        >
            <CardMedia
                component="img"
                height="180"
                image={imagen}
                alt={nombre}
                sx={{ objectFit: "cover" }}
                onError={(e) => { e.target.src = PLACEHOLDER; }}
            />
            <CardContent sx={{ pb: 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Typography variant="h6" fontWeight={700} noWrap sx={{ flex: 1 }}>
                        {nombre}
                    </Typography>
                    <Chip
                        label={estado}
                        size="small"
                        color={disponible ? "success" : "error"}
                        sx={{ ml: 1, fontWeight: 600 }}
                    />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {marca}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                    {precioHora && (
                        <Chip label={`$${precioHora}/hora`} size="small" variant="outlined" color="primary" />
                    )}
                    {precioDia && (
                        <Chip label={`$${precioDia}/día`} size="small" variant="outlined" color="primary" />
                    )}
                </Box>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2, pt: 1 }}>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/maquinaria/${id}`)}
                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                    startIcon={<ShoppingCartIcon />}
                >
                    Ver detalles
                </Button>
            </CardActions>
        </Card>
    );
}
