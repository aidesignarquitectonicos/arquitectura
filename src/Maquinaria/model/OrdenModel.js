import { getDatabase, ref, get, set, push, update } from "firebase/database";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const convertToArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "object") return Object.values(data);
    return [];
};

// ─── Órdenes ──────────────────────────────────────────────────────────────────

/**
 * Guarda una orden confirmada en Firebase.
 * @param {{cliente, items, subtotal, iva, total, metodoPago, stripePaymentId}} orden
 * @returns {string} ID generado
 */
export async function saveOrden(orden) {
    const db = getDatabase();
    const newRef = push(ref(db, "ordenes"));
    await set(newRef, {
        ...orden,
        estado: "pagado",
        fecha: new Date().toISOString(),
    });
    return newRef.key;
}

/**
 * Carga todas las órdenes (para admin).
 */
export async function loadOrdenes() {
    const db = getDatabase();
    const snap = await get(ref(db, "ordenes"));
    if (!snap.exists()) return [];
    const data = snap.val();
    return Object.entries(data).map(([id, val]) => ({
        id,
        ...val,
        items: convertToArray(val.items),
    }));
}

/**
 * Carga una orden por ID.
 */
export async function loadOrden(id) {
    const db = getDatabase();
    const snap = await get(ref(db, `ordenes/${id}`));
    if (!snap.exists()) return null;
    const val = snap.val();
    return { id, ...val, items: convertToArray(val.items) };
}

/**
 * Actualiza el estado de una orden (ej: "pagado" → "cancelado").
 */
export async function updateEstadoOrden(id, estado) {
    const db = getDatabase();
    await update(ref(db, `ordenes/${id}`), { estado });
}
