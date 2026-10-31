import { getDatabase, ref, get, set, push, update, remove } from "firebase/database";

const TIPOS_MAQUINA_PREDETERMINADOS = [
    "Excavadora",
    "Retroexcavadora",
    "Volqueta",
    "Cargadora",
    "Compactadora",
    "Grúa",
];
const SPECS_ENCODING_VERSION = 1;
const SPECS_KEY_PREFIX = "__spec__";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const encodeSpecs = (specs) =>
    Object.fromEntries(
        Object.entries(specs && typeof specs === "object" ? specs : {}).map(([key, value]) => [
            `${SPECS_KEY_PREFIX}${encodeURIComponent(key).replace(/\./g, "%2E")}`,
            value,
        ]),
    );

const decodeMaquina = (id, data) => {
    const { _specsEncodingVersion, specs, ...maquina } = data;
    const decodedSpecs =
        _specsEncodingVersion === SPECS_ENCODING_VERSION && specs
            ? Object.fromEntries(
                  Object.entries(specs).map(([key, value]) => [
                      key.startsWith(SPECS_KEY_PREFIX)
                          ? decodeURIComponent(key.slice(SPECS_KEY_PREFIX.length))
                          : key,
                      value,
                  ]),
              )
            : specs;

    return {
        id,
        ...maquina,
        specs: decodedSpecs,
        imagenes: convertToArray(data.imagenes),
        videos: convertToArray(data.videos),
        reviews: convertReviewsToArray(data.reviews),
    };
};

const encodeMaquina = (data) => ({
    ...data,
    specs: encodeSpecs(data.specs),
    _specsEncodingVersion: SPECS_ENCODING_VERSION,
});

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
    return Object.entries(data).map(([id, val]) => decodeMaquina(id, val));
}

export async function loadMaquina(id) {
    const db = getDatabase();
    const snap = await get(ref(db, `maquinas/${id}`));
    if (!snap.exists()) return null;
    return decodeMaquina(id, snap.val());
}

export async function createMaquina(data) {
    const db = getDatabase();
    const newRef = push(ref(db, "maquinas"));
    await set(newRef, encodeMaquina(data));
    return newRef.key;
}

export async function updateMaquina(id, data) {
    const db = getDatabase();
    await update(ref(db, `maquinas/${id}`), encodeMaquina(data));
}

export async function deleteMaquina(id) {
    const db = getDatabase();
    await remove(ref(db, `maquinas/${id}`));
}

// ─── Categorías de maquinaria ──────────────────────────────────────────────────

export async function loadTiposMaquina() {
    const db = getDatabase();
    const snap = await get(ref(db, "tiposMaquina"));
    if (!snap.exists()) return TIPOS_MAQUINA_PREDETERMINADOS;
    return Object.values(snap.val()).filter((tipo) => typeof tipo === "string");
}

async function ensureTiposMaquinaInicializados(db) {
    const tiposRef = ref(db, "tiposMaquina");
    const snap = await get(tiposRef);
    if (snap.exists()) return tiposRef;

    const tipos = { __initialized: true };
    TIPOS_MAQUINA_PREDETERMINADOS.forEach((tipo) => {
        tipos[push(tiposRef).key] = tipo;
    });
    await set(tiposRef, tipos);
    return tiposRef;
}

export async function createTipoMaquina(tipo) {
    const db = getDatabase();
    const tiposRef = await ensureTiposMaquinaInicializados(db);
    const newRef = push(tiposRef);
    await set(newRef, tipo);
    return newRef.key;
}

export async function deleteTipoMaquina(tipo) {
    const db = getDatabase();
    const tiposRef = await ensureTiposMaquinaInicializados(db);
    const snap = await get(tiposRef);
    const updates = {};

    Object.entries(snap.val() ?? {}).forEach(([id, nombre]) => {
        if (nombre === tipo) updates[id] = null;
    });

    if (Object.keys(updates).length > 0) {
        await update(tiposRef, updates);
    }
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
