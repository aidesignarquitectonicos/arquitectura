import { getDatabase, ref, get, set, push, update, remove } from "firebase/database";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const convertToArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "object") return Object.values(data);
    return [];
};

const convertReviewsToArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return Object.entries(data).map(([id, val]) => ({ id, ...val }));
};

// ─── Maquinaria CRUD ───────────────────────────────────────────────────────────

export async function loadMaquinas() {
    const db = getDatabase();
    const snap = await get(ref(db, "maquinas"));
    if (!snap.exists()) return [];
    const data = snap.val();
    return Object.entries(data).map(([id, val]) => ({
        id,
        ...val,
        imagenes: convertToArray(val.imagenes),
        videos: convertToArray(val.videos),
        reviews: convertReviewsToArray(val.reviews),
    }));
}

export async function loadMaquina(id) {
    const db = getDatabase();
    const snap = await get(ref(db, `maquinas/${id}`));
    if (!snap.exists()) return null;
    const val = snap.val();
    return {
        id,
        ...val,
        imagenes: convertToArray(val.imagenes),
        videos: convertToArray(val.videos),
        reviews: convertReviewsToArray(val.reviews),
    };
}

export async function createMaquina(data) {
    const db = getDatabase();
    const newRef = push(ref(db, "maquinas"));
    await set(newRef, data);
    return newRef.key;
}

export async function updateMaquina(id, data) {
    const db = getDatabase();
    await update(ref(db, `maquinas/${id}`), data);
}

export async function deleteMaquina(id) {
    const db = getDatabase();
    await remove(ref(db, `maquinas/${id}`));
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function addReview(maquinaId, review) {
    const db = getDatabase();
    const reviewRef = push(ref(db, `maquinas/${maquinaId}/reviews`));
    await set(reviewRef, { ...review, fecha: new Date().toISOString() });
    return reviewRef.key;
}

// ─── Cotizaciones ─────────────────────────────────────────────────────────────

export async function saveCotizacion(cotizacion) {
    const db = getDatabase();
    const newRef = push(ref(db, "cotizaciones"));
    await set(newRef, { ...cotizacion, fecha: new Date().toISOString() });
    return newRef.key;
}

export async function loadCotizaciones() {
    const db = getDatabase();
    const snap = await get(ref(db, "cotizaciones"));
    if (!snap.exists()) return [];
    const data = snap.val();
    return Object.entries(data).map(([id, val]) => ({ id, ...val }));
}
