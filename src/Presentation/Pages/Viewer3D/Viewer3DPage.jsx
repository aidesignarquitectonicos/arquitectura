import React, { Suspense, useState, useCallback, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor, OrbitControls, useProgress } from '@react-three/drei';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';

// ── 3D Core ──────────────────────────────────────────────────────────────────
import { ArchScene } from '../../3d/scenes/ArchScene';
import { DynamicLighting } from '../../3d/lights/DynamicLighting';
import { EnvironmentSystem } from '../../3d/environments/EnvironmentSystem';
import { CinematicCamera, OrbitDrift } from '../../3d/controls/CinematicCamera';
import { WalkingControls } from '../../3d/controls/WalkingControls';

// ── UI Components ─────────────────────────────────────────────────────────────
import { HotspotSystem, HotspotPanel } from '../../Components/hotspots/HotspotSystem';
import { PremiumLoader } from '../../Components/loaders/PremiumLoader';
import { MiniMap } from '../../Components/minimap/MiniMap';
import { MaterialConfigurator } from '../../Components/configurator/MaterialConfigurator';
import { MobileJoystick, KeyboardHint } from '../../Components/mobile/MobileControls';
import { TopHUD } from '../../Components/hud/TopHUD';

// ── Store ─────────────────────────────────────────────────────────────────────
import { useViewerStore } from '../../store/viewerStore';

// ─── PROGRESS TRACKER (dentro del Canvas) ────────────────────────────────────
function ProgressTracker() {
    const { progress } = useProgress();
    const setLoadProgress = useViewerStore((s) => s.setLoadProgress);
    const setLoaded = useViewerStore((s) => s.setLoaded);
    const triggered = useRef(false);

    useEffect(() => {
        setLoadProgress(progress);
        if (progress >= 100 && !triggered.current) {
            triggered.current = true;
            // Pequeño delay para la transición cinematográfica
            setTimeout(() => setLoaded(true), 800);
        }
    }, [progress, setLoadProgress, setLoaded]);

    return null;
}

// ─── ESCENA 3D INTERNA ────────────────────────────────────────────────────────
function Scene3D({ modelUrl, colliders, onColliders }) {
    const cameraMode = useViewerStore((s) => s.cameraMode);
    const setCameraMode = useViewerStore((s) => s.setCameraMode);

    const handleCinematicDone = useCallback(() => {
        setCameraMode('orbit');
    }, [setCameraMode]);

    return (
        <>
            <ProgressTracker />
            <DynamicLighting />
            <EnvironmentSystem />
            <ArchScene modelUrl={modelUrl} onReady={onColliders} />
            <HotspotSystem />

            {/* Cámara según modo */}
            {cameraMode === 'cinematic' && (
                <CinematicCamera onComplete={handleCinematicDone} />
            )}
            {cameraMode === 'orbit' && (
                <>
                    <OrbitDrift />
                    <OrbitControls
                        enablePan={false}
                        minDistance={2}
                        maxDistance={20}
                        maxPolarAngle={Math.PI / 2.1}
                        enableDamping
                        dampingFactor={0.06}
                    />
                </>
            )}
            {cameraMode === 'walk' && (
                <WalkingControls colliders={colliders} />
            )}
        </>
    );
}

// ─── PÁGINA PRINCIPAL VIEWER 3D ───────────────────────────────────────────────
// Pasa modelUrl como prop o deja undefined para usar la sala demo
export default function Viewer3DPage({ modelUrl }) {
    const [colliders, setColliders] = useState([]);
    const { activeHotspot, setActiveHotspot } = useViewerStore();

    const handleColliders = useCallback((meshes) => {
        setColliders(meshes);
    }, []);

    // Performance: reducir DPR en móviles
    const [dpr, setDpr] = useState([1, 1.5]);

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#0A0A12', overflow: 'hidden' }}>

            {/* ── Loader premium (overlay) ─────────────────────────────────────────── */}
            <PremiumLoader />

            {/* ── Canvas principal 3D ──────────────────────────────────────────────── */}
            <Canvas
                dpr={dpr}
                shadows
                gl={{
                    antialias: true,
                    toneMapping: ACESFilmicToneMapping,
                    toneMappingExposure: 1.1,
                    outputColorSpace: SRGBColorSpace,
                }}
                camera={{
                    fov: 65,
                    near: 0.1,
                    far: 200,
                }}
                performance={{ min: 0.5 }}
                style={{ position: 'absolute', inset: 0 }}
            >
                {/* Adaptación automática de rendimiento */}
                <AdaptiveDpr pixelated />
                <AdaptiveEvents />
                <PerformanceMonitor
                    onDecline={() => setDpr([0.8, 1])}
                    onIncline={() => setDpr([1, 1.5])}
                />

                <Suspense fallback={null}>
                    <Scene3D
                        modelUrl={modelUrl}
                        colliders={colliders}
                        onColliders={handleColliders}
                    />
                </Suspense>
            </Canvas>

            {/* ── UI Overlay (fuera del Canvas, DOM puro) ──────────────────────────── */}

            {/* HUD superior — modos de cámara y controles */}
            <TopHUD />

            {/* Configurador de materiales y ambiente */}
            <MaterialConfigurator />

            {/* Mini mapa */}
            <MiniMap />

            {/* Panel de hotspot activo (fuera del Canvas) */}
            <HotspotPanel
                hotspot={activeHotspot}
                onClose={() => setActiveHotspot(null)}
            />

            {/* Joystick móvil */}
            <MobileJoystick />

            {/* Hint de teclado (auto-desaparece) */}
            <KeyboardHint />
        </div>
    );
}
