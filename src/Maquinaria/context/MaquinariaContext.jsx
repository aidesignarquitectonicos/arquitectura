import React, { createContext, useContext, useState, useCallback } from "react";
import { loadMaquinas, loadMaquina } from "../model/MaquinariaModel";

const MaquinariaContext = createContext(null);

export function MaquinariaProvider({ children }) {
    const [maquinas, setMaquinas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Filtros
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroDisponible, setFiltroDisponible] = useState(false);
    const [filtroPrecioMax, setFiltroPrecioMax] = useState("");
    const [busqueda, setBusqueda] = useState("");

    const fetchMaquinas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await loadMaquinas();
            setMaquinas(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const getMaquinaById = useCallback(
        (id) => maquinas.find((m) => m.id === id) ?? null,
        [maquinas]
    );

    const maquinasFiltradas = maquinas.filter((m) => {
        if (filtroTipo && m.tipo !== filtroTipo) return false;
        if (filtroDisponible && m.estado !== "Disponible") return false;
        if (filtroPrecioMax && Number(m.precioHora) > Number(filtroPrecioMax)) return false;
        if (
            busqueda &&
            !m.nombre?.toLowerCase().includes(busqueda.toLowerCase()) &&
            !m.marca?.toLowerCase().includes(busqueda.toLowerCase())
        )
            return false;
        return true;
    });

    return (
        <MaquinariaContext.Provider
            value={{
                maquinas,
                maquinasFiltradas,
                loading,
                error,
                fetchMaquinas,
                getMaquinaById,
                // Filtros
                filtroTipo, setFiltroTipo,
                filtroDisponible, setFiltroDisponible,
                filtroPrecioMax, setFiltroPrecioMax,
                busqueda, setBusqueda,
            }}
        >
            {children}
        </MaquinariaContext.Provider>
    );
}

export function useMaquinaria() {
    const ctx = useContext(MaquinariaContext);
    if (!ctx) throw new Error("useMaquinaria debe usarse dentro de MaquinariaProvider");
    return ctx;
}
