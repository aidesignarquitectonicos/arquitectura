import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

const Particles = () => {
    const pointsRef = useRef();
    const numParticles = 500;

    const positions = new Float32Array(numParticles * 3);
    for (let i = 0; i < numParticles * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 5; // Distribución aleatoria
    }

    useFrame(() => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += 0.001;
        }
    });

    return (
        <Points ref={pointsRef} positions={positions} stride={3}>
            <PointMaterial
                transparent
                color="#A9A9A9"
                size={0.05}
                sizeAttenuation
                depthWrite={false}
            />
        </Points>
    );
};

const ParticleBackground = () => {
    return (
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <Particles />
        </Canvas>
    );
};

export default ParticleBackground;
