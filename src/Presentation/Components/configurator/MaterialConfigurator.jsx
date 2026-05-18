import React from 'react';
import { motion } from 'framer-motion';
import { useViewerStore } from '../../store/viewerStore';

// ─── CONFIGURADOR DE MATERIALES + AMBIENTE + MODOS ────────────────────────────

const FLOOR_OPTIONS = [
    { key: 'wood', label: 'Madera', color: '#8B6F47' },
    { key: 'marble', label: 'Mármol', color: '#EFEFEF' },
    { key: 'concrete', label: 'Concreto', color: '#9E9E9E' },
];

const WALL_OPTIONS = [
    { key: 'white', label: 'Blanco', color: '#F5F5F0' },
    { key: 'stone', label: 'Piedra', color: '#8D8070' },
    { key: 'cement', label: 'Cemento', color: '#BDBDBD' },
];

const AMBIENT_OPTIONS = [
    { key: 'day', label: 'Día', icon: '☀️' },
    { key: 'night', label: 'Noche', icon: '🌙' },
    { key: 'rain', label: 'Lluvia', icon: '🌧️' },
    { key: 'fog', label: 'Niebla', icon: '🌫️' },
];

function SectionTitle({ children }) {
    return (
        <p style={{
            fontFamily: "'Helvetica Neue', sans-serif",
            fontSize: 9,
            letterSpacing: '0.3em',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            margin: '0 0 10px',
        }}>
            {children}
        </p>
    );
}

function SwatchButton({ label, color, active, onClick }) {
    return (
        <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: active ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.07)',
                background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                cursor: 'pointer',
                marginBottom: 6,
                transition: 'all 0.2s',
            }}
        >
            <div style={{
                width: 16, height: 16, borderRadius: 4,
                background: color,
                border: '1px solid rgba(255,255,255,0.15)',
                flexShrink: 0,
            }} />
            <span style={{
                fontFamily: "'Helvetica Neue', sans-serif",
                fontSize: 11,
                color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                letterSpacing: '0.05em',
            }}>
                {label}
            </span>
        </motion.button>
    );
}

export function MaterialConfigurator() {
    const { showConfigurator, toggleConfigurator, materials, setMaterial, ambientMode, setAmbientMode } = useViewerStore();

    return (
        <>
            {/* Botón flotante toggle */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleConfigurator}
                style={{
                    position: 'fixed',
                    top: 24,
                    right: 24,
                    zIndex: 950,
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(10,10,20,0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    cursor: 'pointer',
                    color: '#fff',
                    fontSize: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                }}
                title="Configurador"
            >
                ✦
            </motion.button>

            {/* Panel lateral */}
            <motion.div
                initial={false}
                animate={{ x: showConfigurator ? 0 : 320, opacity: showConfigurator ? 1 : 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                    position: 'fixed',
                    top: 80,
                    right: 24,
                    width: 260,
                    background: 'rgba(8,8,18,0.88)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                    padding: 24,
                    zIndex: 900,
                    boxShadow: '0 8px 48px rgba(0,0,0,0.6)',
                    pointerEvents: showConfigurator ? 'all' : 'none',
                    maxHeight: 'calc(100vh - 120px)',
                    overflowY: 'auto',
                }}
            >
                {/* Header */}
                <p style={{
                    fontFamily: "'Helvetica Neue', sans-serif",
                    fontSize: 10,
                    letterSpacing: '0.3em',
                    color: 'rgba(255,255,255,0.25)',
                    textTransform: 'uppercase',
                    margin: '0 0 4px',
                }}>
                    Configurador
                </p>
                <h3 style={{
                    fontFamily: "'Helvetica Neue', sans-serif",
                    fontWeight: 300,
                    fontSize: 18,
                    color: '#fff',
                    margin: '0 0 24px',
                    letterSpacing: '0.04em',
                }}>
                    Personaliza tu espacio
                </h3>

                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 24 }} />

                {/* Pisos */}
                <SectionTitle>Piso</SectionTitle>
                {FLOOR_OPTIONS.map((o) => (
                    <SwatchButton
                        key={o.key}
                        label={o.label}
                        color={o.color}
                        active={materials.floor === o.key}
                        onClick={() => setMaterial('floor', o.key)}
                    />
                ))}

                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '20px 0' }} />

                {/* Paredes */}
                <SectionTitle>Pared</SectionTitle>
                {WALL_OPTIONS.map((o) => (
                    <SwatchButton
                        key={o.key}
                        label={o.label}
                        color={o.color}
                        active={materials.wall === o.key}
                        onClick={() => setMaterial('wall', o.key)}
                    />
                ))}

                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '20px 0' }} />

                {/* Ambiente */}
                <SectionTitle>Ambiente</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {AMBIENT_OPTIONS.map((o) => (
                        <motion.button
                            key={o.key}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setAmbientMode(o.key)}
                            style={{
                                padding: '10px 6px',
                                borderRadius: 8,
                                border: ambientMode === o.key
                                    ? '1px solid rgba(255,255,255,0.35)'
                                    : '1px solid rgba(255,255,255,0.07)',
                                background: ambientMode === o.key
                                    ? 'rgba(255,255,255,0.08)'
                                    : 'transparent',
                                cursor: 'pointer',
                                textAlign: 'center',
                            }}
                        >
                            <div style={{ fontSize: 20, marginBottom: 4 }}>{o.icon}</div>
                            <div style={{
                                fontFamily: "'Helvetica Neue', sans-serif",
                                fontSize: 10,
                                color: ambientMode === o.key ? '#fff' : 'rgba(255,255,255,0.4)',
                                letterSpacing: '0.1em',
                            }}>
                                {o.label}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </>
    );
}
