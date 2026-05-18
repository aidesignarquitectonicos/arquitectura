import * as THREE from 'three';

// ─── PALETA DE MATERIALES PREMIUM ─────────────────────────────────────────────
// Todos los materiales usan PBR (Physically Based Rendering)

const buildMaterial = (params) =>
    new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0.0, ...params });

export const FLOOR_MATERIALS = {
    wood: buildMaterial({
        color: new THREE.Color('#8B6F47'),
        roughness: 0.75,
        metalness: 0.0,
    }),
    marble: buildMaterial({
        color: new THREE.Color('#EFEFEF'),
        roughness: 0.1,
        metalness: 0.05,
    }),
    concrete: buildMaterial({
        color: new THREE.Color('#9E9E9E'),
        roughness: 0.9,
        metalness: 0.0,
    }),
};

export const WALL_MATERIALS = {
    white: buildMaterial({
        color: new THREE.Color('#F5F5F0'),
        roughness: 0.85,
    }),
    stone: buildMaterial({
        color: new THREE.Color('#8D8070'),
        roughness: 0.95,
        metalness: 0.0,
    }),
    cement: buildMaterial({
        color: new THREE.Color('#BDBDBD'),
        roughness: 0.9,
        metalness: 0.0,
    }),
};

// Retorna el material Three.js listo para aplicar
export const getMaterial = (type, key) => {
    const map = { floor: FLOOR_MATERIALS, wall: WALL_MATERIALS };
    return map[type]?.[key] ?? new THREE.MeshStandardMaterial({ color: '#ffffff' });
};
