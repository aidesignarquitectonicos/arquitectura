import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useViewerStore } from '../../store/viewerStore';
import { HOTSPOT_DATA } from '../hotspots/HotspotSystem';

// ─── MINI MAPA INTERACTIVO ────────────────────────────────────────────────────
// Proyecta la posición 3D del usuario a un plano 2D

const MAP_SIZE = 160;          // px canvas
const WORLD_HALF = 11;         // mitad del mundo en unidades Three.js

function worldToMap(x, z) {
    const u = ((x + WORLD_HALF) / (WORLD_HALF * 2)) * MAP_SIZE;
    const v = ((z + WORLD_HALF) / (WORLD_HALF * 2)) * MAP_SIZE;
    return { u, v };
}

export function MiniMap() {
    const { userPosition, userRotation, showMiniMap } = useViewerStore();
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!showMiniMap) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Fondo
        ctx.clearRect(0, 0, MAP_SIZE, MAP_SIZE);
        ctx.fillStyle = 'rgba(8,8,18,0.85)';
        ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE);

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 4; i++) {
            const step = (MAP_SIZE / 4) * i;
            ctx.beginPath(); ctx.moveTo(step, 0); ctx.lineTo(step, MAP_SIZE); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, step); ctx.lineTo(MAP_SIZE, step); ctx.stroke();
        }

        // Paredes de la sala
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(4, 4, MAP_SIZE - 8, MAP_SIZE - 8);

        // Hotspots en el mapa
        HOTSPOT_DATA.forEach((h) => {
            const { u, v } = worldToMap(h.position[0], h.position[2]);
            ctx.beginPath();
            ctx.arc(u, v, 4, 0, Math.PI * 2);
            ctx.fillStyle = h.color + 'BB';
            ctx.fill();
            ctx.strokeStyle = h.color;
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // Usuario — triángulo indicador de dirección
        const { u, v } = worldToMap(userPosition.x, userPosition.z);
        ctx.save();
        ctx.translate(u, v);
        ctx.rotate(-userRotation);

        ctx.beginPath();
        ctx.moveTo(0, -7);
        ctx.lineTo(4.5, 5);
        ctx.lineTo(-4.5, 5);
        ctx.closePath();
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
    }, [userPosition, userRotation, showMiniMap]);

    if (!showMiniMap) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
                position: 'fixed',
                bottom: 24,
                left: 24,
                zIndex: 900,
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(8px)',
            }}
        >
            <canvas
                ref={canvasRef}
                width={MAP_SIZE}
                height={MAP_SIZE}
                style={{ display: 'block' }}
            />
            <div style={{
                position: 'absolute',
                top: 6,
                left: 8,
                fontFamily: "'Helvetica Neue', sans-serif",
                fontSize: 8,
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                pointerEvents: 'none',
            }}>
                Planta
            </div>
        </motion.div>
    );
}
