import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import { useViewerStore } from '../../store/viewerStore';

// Ruta cinematográfica: posición inicial → posición final
const CINEMATIC_START = new THREE.Vector3(12, 6, 14);
const CINEMATIC_TARGET = new THREE.Vector3(0, 1.6, 0);
const WALK_HEIGHT = 1.7; // altura de ojo humano

export function CinematicCamera({ onComplete }) {
    const { camera } = useThree();
    const cameraMode = useViewerStore((s) => s.cameraMode);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        // Posición inicial fuera de escena
        camera.position.copy(CINEMATIC_START);
        camera.lookAt(CINEMATIC_TARGET);

        const proxy = {
            px: CINEMATIC_START.x,
            py: CINEMATIC_START.y,
            pz: CINEMATIC_START.z,
        };

        // Animación cinematográfica GSAP con easing premium
        gsap.to(proxy, {
            px: 0,
            py: WALK_HEIGHT,
            pz: 6,
            duration: 4.5,
            ease: 'power3.inOut',
            onUpdate: () => {
                camera.position.set(proxy.px, proxy.py, proxy.pz);
                camera.lookAt(CINEMATIC_TARGET);
            },
            onComplete: () => {
                if (onComplete) onComplete();
            },
        });
    }, [camera, onComplete]);

    return null;
}

// Orbitador suave para modo 'orbit'
export function OrbitDrift() {
    const { camera } = useThree();
    const angle = useRef(0);

    useFrame((_, delta) => {
        angle.current += delta * 0.08;
        camera.position.x = Math.sin(angle.current) * 8;
        camera.position.z = Math.cos(angle.current) * 8;
        camera.position.y = 3 + Math.sin(angle.current * 0.5) * 1;
        camera.lookAt(0, 1, 0);
    });

    return null;
}
