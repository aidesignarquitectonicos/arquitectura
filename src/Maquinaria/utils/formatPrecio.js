export function formatPrecioMaquina(precio, unidad) {
    return Number(precio) > 0
        ? `$${precio}/${unidad}`
        : `No disponible/${unidad}`;
}
