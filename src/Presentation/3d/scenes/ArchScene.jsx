import React, { Suspense, useRef, useState, useCallback } from 'react';
import { useGLTF, useProgress } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getMaterial } from '../materials/MaterialSystem';
import { useViewerStore } from '../../store/viewerStore';

// ─── COMPONENTE MODELO GLB CON MATERIALES DINÁMICOS ──────────────────────────
function ArchModel({ url, onLoaded }) {
    const { scene } = useGLTF(url, true); // true = draco
    const materials = useViewerStore((s) => s.materials);
    const isFirstRender = useRef(true);

    // Actualizar materiales del modelo según el estado global
    React.useEffect(() => {
        scene.traverse((node) => {
            if (!node.isMesh) return;
            const name = node.name.toLowerCase();

            if (name.includes('floor') || name.includes('piso') || name.includes('suelo')) {
                node.material = getMaterial('floor', materials.floor);
                node.castShadow = true;
                node.receiveShadow = true;
            }
            if (name.includes('wall') || name.includes('pared') || name.includes('muro')) {
                node.material = getMaterial('wall', materials.wall);
                node.receiveShadow = true;
            }
            node.castShadow = true;
            node.receiveShadow = true;
        });

        if (isFirstRender.current) {
            isFirstRender.current = false;
            if (onLoaded) onLoaded(scene);
        }
    }, [scene, materials, onLoaded]);

    return <primitive object={scene} dispose={null} />;
}

// ─── ESCENA PLACEHOLDER (sin modelo GLB) ──────────────────────────────────────
// Se usa para desarrollo/demo cuando no hay un GLB cargado
function DemoRoom({ colliderRef }) {
    const materials = useViewerStore((s) => s.materials);
    const floorMat = getMaterial('floor', materials.floor);
    const wallMat = getMaterial('wall', materials.wall);

    return (
        <group ref={colliderRef}>
            {/* Suelo */}
            <mesh receiveShadow castShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[20, 20]} />
                <primitive object={floorMat} attach="material" />
            </mesh>

            {/* Techo */}
            <mesh receiveShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 3.2, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#F5F5F0" roughness={0.9} />
            </mesh>

            {/* Paredes */}
            {[
                { pos: [0, 1.6, -10], rot: [0, 0, 0] },
                { pos: [0, 1.6, 10], rot: [0, Math.PI, 0] },
                { pos: [-10, 1.6, 0], rot: [0, Math.PI / 2, 0] },
                { pos: [10, 1.6, 0], rot: [0, -Math.PI / 2, 0] },
            ].map((w, i) => (
                <mesh key={i} receiveShadow position={w.pos} rotation={w.rot}>
                    <planeGeometry args={[20, 3.2]} />
                    <primitive object={wallMat} attach="material" />
                </mesh>
            ))}

            {/* Ventana simulada (marco) */}
            <mesh position={[0, 1.8, -9.95]} castShadow>
                <boxGeometry args={[4, 2, 0.1]} />
                <meshStandardMaterial color="#90CAF9" transparent opacity={0.3} roughness={0.05} metalness={0.1} />
            </mesh>

            {/* Mobiliario demo */}
            <mesh castShadow receiveShadow position={[-3, 0.4, -3]}>
                <boxGeometry args={[3, 0.8, 1.5]} />
                <meshStandardMaterial color="#5D4037" roughness={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[-3, 1.2, -3.5]}>
                <boxGeometry args={[3, 1.5, 0.1]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
            </mesh>
        </group>
    );
}

// ─── ESCENA PRINCIPAL ─────────────────────────────────────────────────────────
export function ArchScene({ modelUrl = null, onReady }) {
    const colliderRef = useRef();
    const [colliders, setColliders] = useState([]);

    const handleLoaded = useCallback(
        (sceneObj) => {
            const meshes = [];
            sceneObj.traverse((n) => { if (n.isMesh) meshes.push(n); });
            setColliders(meshes);
            if (onReady) onReady(meshes);
        },
        [onReady]
    );

    const handleDemoReady = useCallback(() => {
        if (colliderRef.current) {
            const meshes = [];
            colliderRef.current.traverse((n) => { if (n.isMesh) meshes.push(n); });
            setColliders(meshes);
            if (onReady) onReady(meshes);
        }
    }, [onReady]);

    // Si no hay modelo, usar sala demo
    React.useEffect(() => {
        if (!modelUrl) {
            setTimeout(handleDemoReady, 300);
        }
    }, [modelUrl, handleDemoReady]);

    return (
        <>
            {modelUrl ? (
                <Suspense fallback={null}>
                    <ArchModel url={modelUrl} onLoaded={handleLoaded} />
                </Suspense>
            ) : (
                <DemoRoom colliderRef={colliderRef} />
            )}
        </>
    );
}
