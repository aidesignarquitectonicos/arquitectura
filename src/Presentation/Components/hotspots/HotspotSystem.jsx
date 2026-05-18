import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useViewerStore } from '../../store/viewerStore';

// ─── DEFINICIÓN DE HOTSPOTS ───────────────────────────────────────────────────
export const HOTSPOT_DATA = [
    {
        id: 'living',
        label: 'Sala Principal',
        position: [0, 1.5, -2],
        color: '#64B5F6',
        icon: '🛋',
        info: {
            area: '42 m²',
            materiales: 'Piso madera nogal · Pared stucco blanco',
            acabados: 'Ventanas piso a techo · Iluminación LED empotrada',
            costo: '$85,000 USD',
            descripcion: 'Sala de estar con doble altura y vista panorámica al jardín.',
        },
    },
    {
        id: 'kitchen',
        label: 'Cocina',
        position: [-4, 1.5, 2],
        color: '#A5D6A7',
        icon: '🍳',
        info: {
            area: '28 m²',
            materiales: 'Isla de mármol Calacatta · Gabinetes lacados mate',
            acabados: 'Electrodomésticos Miele integrados · Splash de vidrio templado',
            costo: '$62,000 USD',
            descripcion: 'Cocina premium de concepto abierto con isla central.',
        },
    },
    {
        id: 'bedroom',
        label: 'Dormitorio Master',
        position: [4, 1.5, 2],
        color: '#CE93D8',
        icon: '🛏',
        info: {
            area: '35 m²',
            materiales: 'Alfombra de lana · Pared revestida en terciopelo',
            acabados: 'Walk-in closet · Baño en suite',
            costo: '$55,000 USD',
            descripcion: 'Suite principal con terraza privada y vistas al paisaje.',
        },
    },
    {
        id: 'bathroom',
        label: 'Baño Principal',
        position: [4, 1.5, -3],
        color: '#80DEEA',
        icon: '🚿',
        info: {
            area: '18 m²',
            materiales: 'Mármol Carrara · Griferías Hansgrohe',
            acabados: 'Ducha lluvia · Bañera independiente · Doble lavabo',
            costo: '$38,000 USD',
            descripcion: 'Baño spa de lujo con iluminación ambiental inteligente.',
        },
    },
];

// ─── HOTSPOT 3D INDIVIDUAL ────────────────────────────────────────────────────
function Hotspot({ data, onSelect }) {
    const meshRef = useRef();
    const ringRef = useRef();
    const [hovered, setHovered] = useState(false);
    const { camera } = useThree();

    useFrame((_, delta) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y += delta * 0.8;
        const pulse = 1 + Math.sin(Date.now() * 0.002) * 0.12;
        meshRef.current.scale.setScalar(hovered ? 1.4 : pulse);
        if (ringRef.current) {
            ringRef.current.rotation.z += delta * 1.2;
        }
        // Billboard: siempre mirar a la cámara
        meshRef.current.lookAt(camera.position);
    });

    return (
        <group position={data.position}>
            {/* Anillo exterior pulsante */}
            <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.28, 0.02, 8, 32]} />
                <meshStandardMaterial
                    color={data.color}
                    emissive={data.color}
                    emissiveIntensity={hovered ? 3 : 1.5}
                    transparent
                    opacity={0.7}
                />
            </mesh>

            {/* Punto central */}
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={() => onSelect(data)}
                castShadow
            >
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial
                    color={data.color}
                    emissive={data.color}
                    emissiveIntensity={hovered ? 4 : 2}
                />
            </mesh>

            {/* Línea vertical */}
            <mesh position={[0, -0.4, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.8, 8]} />
                <meshStandardMaterial color={data.color} transparent opacity={0.5} />
            </mesh>

            {/* Label HTML flotante */}
            <Html
                position={[0, 0.4, 0]}
                center
                distanceFactor={6}
                style={{ pointerEvents: 'none' }}
            >
                <div style={{
                    background: 'rgba(10,10,20,0.75)',
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${data.color}44`,
                    borderRadius: 6,
                    padding: '4px 10px',
                    color: '#fff',
                    fontFamily: "'Helvetica Neue', sans-serif",
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase',
                    opacity: hovered ? 1 : 0.7,
                    transition: 'opacity 0.3s',
                    boxShadow: `0 0 16px ${data.color}44`,
                }}>
                    {data.icon} {data.label}
                </div>
            </Html>
        </group>
    );
}

// ─── PANEL DE INFO HOTSPOT (UI 2D) ────────────────────────────────────────────
function HotspotPanel({ hotspot, onClose }) {
    return (
        <AnimatePresence>
            {hotspot && (
                <motion.div
                    key={hotspot.id}
                    initial={{ opacity: 0, x: 40, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 40, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{
                        position: 'fixed',
                        top: '50%',
                        right: 24,
                        transform: 'translateY(-50%)',
                        width: 'min(320px, 85vw)',
                        background: 'rgba(8,8,18,0.85)',
                        backdropFilter: 'blur(24px)',
                        border: `1px solid ${hotspot.color}33`,
                        borderRadius: 16,
                        padding: 28,
                        color: '#fff',
                        fontFamily: "'Helvetica Neue', sans-serif",
                        zIndex: 1000,
                        boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 24px ${hotspot.color}22`,
                    }}
                >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                        <div>
                            <p style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: 0 }}>
                                Espacio
                            </p>
                            <h2 style={{ fontSize: 22, fontWeight: 300, margin: '4px 0 0', letterSpacing: '0.04em' }}>
                                {hotspot.icon} {hotspot.label}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'rgba(255,255,255,0.08)',
                                border: 'none',
                                borderRadius: 8,
                                width: 32,
                                height: 32,
                                cursor: 'pointer',
                                color: '#fff',
                                fontSize: 16,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            ×
                        </button>
                    </div>

                    {/* Línea divisora */}
                    <div style={{ height: 1, background: `linear-gradient(90deg, ${hotspot.color}88, transparent)`, marginBottom: 20 }} />

                    {/* Info */}
                    {[
                        ['Área', hotspot.info.area],
                        ['Materiales', hotspot.info.materiales],
                        ['Acabados', hotspot.info.acabados],
                        ['Inversión estimada', hotspot.info.costo],
                    ].map(([key, val]) => (
                        <div key={key} style={{ marginBottom: 14 }}>
                            <p style={{ fontSize: 9, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', margin: '0 0 3px' }}>
                                {key}
                            </p>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.5 }}>
                                {val}
                            </p>
                        </div>
                    ))}

                    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '20px 0' }} />

                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>
                        {hotspot.info.descripcion}
                    </p>

                    {/* CTA */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            marginTop: 24,
                            width: '100%',
                            padding: '12px 0',
                            background: `linear-gradient(135deg, ${hotspot.color}44, ${hotspot.color}22)`,
                            border: `1px solid ${hotspot.color}66`,
                            borderRadius: 10,
                            color: '#fff',
                            fontFamily: "'Helvetica Neue', sans-serif",
                            fontSize: 11,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                        }}
                    >
                        Solicitar cotización
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─── SISTEMA DE HOTSPOTS COMPLETO ─────────────────────────────────────────────
export function HotspotSystem() {
    const { activeHotspot, setActiveHotspot } = useViewerStore();

    return (
        <>
            {/* Hotspots 3D dentro del Canvas */}
            {HOTSPOT_DATA.map((h) => (
                <Hotspot key={h.id} data={h} onSelect={setActiveHotspot} />
            ))}

            {/* Panel info fuera del Canvas (DOM) */}
            <HotspotPanel hotspot={activeHotspot} onClose={() => setActiveHotspot(null)} />
        </>
    );
}

// Exportar solo el panel para usarlo fuera del Canvas
export { HotspotPanel };
