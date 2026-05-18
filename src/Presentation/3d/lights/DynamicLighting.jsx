import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useViewerStore } from '../../store/viewerStore';

// ─── ILUMINACIÓN DINÁMICA POR MODO AMBIENTAL ──────────────────────────────────

const LIGHT_CONFIGS = {
    day: {
        ambient: { intensity: 1.2, color: '#FFF5E0' },
        sun: { intensity: 3.5, color: '#FFE9C0', position: [10, 20, 10] },
        fill: { intensity: 0.6, color: '#C8DCFF', position: [-10, 8, -10] },
    },
    night: {
        ambient: { intensity: 0.08, color: '#1A237E' },
        sun: { intensity: 0.3, color: '#7986CB', position: [-5, 15, -5] },
        fill: { intensity: 0.4, color: '#3949AB', position: [8, 5, 8] },
    },
    rain: {
        ambient: { intensity: 0.4, color: '#B0BEC5' },
        sun: { intensity: 0.8, color: '#90A4AE', position: [5, 18, 5] },
        fill: { intensity: 0.3, color: '#78909C', position: [-8, 6, -8] },
    },
    fog: {
        ambient: { intensity: 0.7, color: '#ECEFF1' },
        sun: { intensity: 1.2, color: '#CFD8DC', position: [8, 20, 8] },
        fill: { intensity: 0.5, color: '#B0BEC5', position: [-8, 5, -8] },
    },
};

export function DynamicLighting() {
    const ambientRef = useRef();
    const sunRef = useRef();
    const fillRef = useRef();
    const ambientMode = useViewerStore((s) => s.ambientMode);

    const cfg = LIGHT_CONFIGS[ambientMode] ?? LIGHT_CONFIGS.day;

    // Interpolación suave en cada frame hacia la config objetivo
    useFrame((_, delta) => {
        const lerp = 1 - Math.pow(0.005, delta);

        if (ambientRef.current) {
            ambientRef.current.intensity = THREE.MathUtils.lerp(
                ambientRef.current.intensity,
                cfg.ambient.intensity,
                lerp
            );
        }
        if (sunRef.current) {
            sunRef.current.intensity = THREE.MathUtils.lerp(
                sunRef.current.intensity,
                cfg.sun.intensity,
                lerp
            );
            sunRef.current.position.lerp(
                new THREE.Vector3(...cfg.sun.position),
                lerp
            );
        }
        if (fillRef.current) {
            fillRef.current.intensity = THREE.MathUtils.lerp(
                fillRef.current.intensity,
                cfg.fill.intensity,
                lerp
            );
        }
    });

    return (
        <>
            <ambientLight ref={ambientRef} intensity={cfg.ambient.intensity} color={cfg.ambient.color} />

            {/* Luz solar principal con sombras suaves */}
            <directionalLight
                ref={sunRef}
                intensity={cfg.sun.intensity}
                color={cfg.sun.color}
                position={cfg.sun.position}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-far={60}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
                shadow-bias={-0.0005}
            />

            {/* Luz de relleno */}
            <directionalLight
                ref={fillRef}
                intensity={cfg.fill.intensity}
                color={cfg.fill.color}
                position={cfg.fill.position}
            />

            {/* Luz de acento puntual (decorativa interior) */}
            <pointLight position={[0, 3, 0]} intensity={0.5} color="#FFF3E0" distance={12} decay={2} />
        </>
    );
}
