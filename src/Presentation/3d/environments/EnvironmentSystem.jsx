import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Environment, Sky, Fog } from '@react-three/drei';
import * as THREE from 'three';
import { useViewerStore } from '../../store/viewerStore';

// ─── SISTEMA DE ENTORNO AMBIENTAL ─────────────────────────────────────────────

export function EnvironmentSystem() {
    const ambientMode = useViewerStore((s) => s.ambientMode);
    const { scene } = useThree();

    // Niebla dinámica por modo
    useEffect(() => {
        switch (ambientMode) {
            case 'fog':
                scene.fog = new THREE.FogExp2('#CFD8DC', 0.04);
                break;
            case 'rain':
                scene.fog = new THREE.Fog('#90A4AE', 15, 50);
                break;
            case 'night':
                scene.fog = new THREE.Fog('#0D1B2A', 20, 60);
                break;
            default:
                scene.fog = null;
        }
        return () => { scene.fog = null; };
    }, [ambientMode, scene]);

    if (ambientMode === 'night') {
        return (
            <Environment
                background
                files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/moonlit_golf_1k.hdr"
            />
        );
    }

    if (ambientMode === 'rain' || ambientMode === 'fog') {
        return (
            <Sky
                distance={450000}
                sunPosition={[0, 0.1, -1]}
                inclination={0}
                azimuth={0.25}
                rayleigh={4}
                turbidity={20}
                mieCoefficient={0.1}
                mieDirectionalG={0.8}
            />
        );
    }

    // Día — cielo HDR natural
    return (
        <>
            <Sky
                distance={450000}
                sunPosition={[1, 0.5, 0.3]}
                inclination={0.49}
                azimuth={0.25}
                rayleigh={0.5}
                turbidity={8}
            />
            <Environment preset="apartment" background={false} />
        </>
    );
}
