import { create } from 'zustand';

// ─── STORE GLOBAL — VISUALIZADOR 3D PREMIUM ───────────────────────────────────
export const useViewerStore = create((set) => ({

    // ── Modo de cámara ────────────────────────────────────────────────────────
    cameraMode: 'cinematic', // 'cinematic' | 'walk' | 'orbit'
    setCameraMode: (mode) => set({ cameraMode: mode }),

    // ── Hotspot activo ────────────────────────────────────────────────────────
    activeHotspot: null,
    setActiveHotspot: (hotspot) => set({ activeHotspot: hotspot }),

    // ── Sistema ambiental ─────────────────────────────────────────────────────
    ambientMode: 'day', // 'day' | 'night' | 'rain' | 'fog'
    setAmbientMode: (mode) => set({ ambientMode: mode }),

    // ── Materiales dinámicos ──────────────────────────────────────────────────
    materials: {
        floor: 'wood',      // 'wood' | 'marble' | 'concrete'
        wall: 'white',      // 'white' | 'stone' | 'cement'
        ceiling: 'white',
    },
    setMaterial: (key, value) =>
        set((s) => ({ materials: { ...s.materials, [key]: value } })),

    // ── UI panels ─────────────────────────────────────────────────────────────
    showConfigurator: false,
    toggleConfigurator: () =>
        set((s) => ({ showConfigurator: !s.showConfigurator })),

    showMiniMap: true,
    toggleMiniMap: () => set((s) => ({ showMiniMap: !s.showMiniMap })),

    // ── Posición del usuario (para mini mapa) ─────────────────────────────────
    userPosition: { x: 0, z: 0 },
    userRotation: 0,
    setUserPosition: (pos) => set({ userPosition: { x: pos.x, z: pos.z } }),
    setUserRotation: (rot) => set({ userRotation: rot }),

    // ── Estado de carga ───────────────────────────────────────────────────────
    isLoaded: false,
    loadProgress: 0,
    setLoaded: (v) => set({ isLoaded: v }),
    setLoadProgress: (v) => set({ loadProgress: v }),

    // ── Walking sprint ────────────────────────────────────────────────────────
    isSprinting: false,
    setSprinting: (v) => set({ isSprinting: v }),
}));
