import React from 'react';
import { motion } from 'framer-motion';
import { useViewerStore } from '../../store/viewerStore';

// ─── BARRA HUD SUPERIOR ───────────────────────────────────────────────────────
export function TopHUD({ onExitWalk }) {
    const { cameraMode, setCameraMode, showMiniMap, toggleMiniMap } = useViewerStore();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{
                position: 'fixed',
                top: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 950,
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                background: 'rgba(8,8,18,0.82)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '8px 16px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
        >
            {/* Modo órbita */}
            <HUDButton
                label="Órbita"
                icon="⟳"
                active={cameraMode === 'orbit'}
                onClick={() => setCameraMode('orbit')}
            />

            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)' }} />

            {/* Modo walking */}
            <HUDButton
                label="Recorrer"
                icon="⇨"
                active={cameraMode === 'walk'}
                onClick={() => setCameraMode('walk')}
            />

            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)' }} />

            {/* Mini mapa toggle */}
            <HUDButton
                label="Planta"
                icon="⊞"
                active={showMiniMap}
                onClick={toggleMiniMap}
            />
        </motion.div>
    );
}

function HUDButton({ label, icon, active, onClick }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                border: active ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent',
                background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                cursor: 'pointer',
                color: active ? '#fff' : 'rgba(255,255,255,0.4)',
                fontFamily: "'Helvetica Neue', sans-serif",
                fontSize: 11,
                letterSpacing: '0.1em',
                transition: 'all 0.2s',
            }}
        >
            <span style={{ fontSize: 14 }}>{icon}</span>
            {label}
        </motion.button>
    );
}
