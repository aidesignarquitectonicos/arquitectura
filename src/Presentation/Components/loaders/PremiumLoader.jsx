import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useViewerStore } from '../../store/viewerStore';

// ─── LOADER PREMIUM CINEMATOGRÁFICO ───────────────────────────────────────────

export function PremiumLoader() {
    const { isLoaded, loadProgress } = useViewerStore();
    const canvasRef = useRef(null);
    const animFrameRef = useRef(null);

    // Partículas de fondo animadas en canvas 2D
    useEffect(() => {
        if (isLoaded) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const dots = Array.from({ length: 80 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.3,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            alpha: Math.random() * 0.6 + 0.1,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dots.forEach((d) => {
                d.x += d.vx;
                d.y += d.vy;
                if (d.x < 0) d.x = canvas.width;
                if (d.x > canvas.width) d.x = 0;
                if (d.y < 0) d.y = canvas.height;
                if (d.y > canvas.height) d.y = 0;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200,200,220,${d.alpha})`;
                ctx.fill();
            });
            animFrameRef.current = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animFrameRef.current);
        };
    }, [isLoaded]);

    return (
        <AnimatePresence>
            {!isLoaded && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.04 }}
                    transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        background: 'linear-gradient(135deg, #0A0A12 0%, #12121E 50%, #0A0A12 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                    }}
                >
                    {/* Partículas canvas */}
                    <canvas
                        ref={canvasRef}
                        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
                    />

                    {/* Logo / Marca */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.9, ease: 'easeOut' }}
                        style={{ position: 'relative', textAlign: 'center', marginBottom: 48 }}
                    >
                        <p style={{
                            fontFamily: "'Helvetica Neue', sans-serif",
                            fontSize: 11,
                            letterSpacing: '0.35em',
                            color: 'rgba(255,255,255,0.35)',
                            textTransform: 'uppercase',
                            marginBottom: 12,
                        }}>
                            AI Design Arquitectónicos
                        </p>
                        <h1 style={{
                            fontFamily: "'Helvetica Neue', sans-serif",
                            fontWeight: 300,
                            fontSize: 'clamp(28px, 5vw, 52px)',
                            color: '#FFFFFF',
                            letterSpacing: '0.08em',
                            margin: 0,
                        }}>
                            VISUALIZADOR 3D
                        </h1>
                        <div style={{
                            width: 40,
                            height: 1,
                            background: 'rgba(255,255,255,0.25)',
                            margin: '18px auto 0',
                        }} />
                    </motion.div>

                    {/* Barra de progreso premium */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        style={{ width: 'min(340px, 80vw)', position: 'relative' }}
                    >
                        {/* Track */}
                        <div style={{
                            width: '100%',
                            height: 1,
                            background: 'rgba(255,255,255,0.08)',
                            borderRadius: 1,
                            overflow: 'hidden',
                        }}>
                            <motion.div
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.9))',
                                    borderRadius: 1,
                                    width: `${loadProgress}%`,
                                    transition: 'width 0.3s ease',
                                    boxShadow: '0 0 8px rgba(255,255,255,0.5)',
                                }}
                            />
                        </div>

                        {/* Porcentaje */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: 12,
                        }}>
                            <span style={{
                                fontFamily: "'Helvetica Neue', sans-serif",
                                fontSize: 10,
                                letterSpacing: '0.2em',
                                color: 'rgba(255,255,255,0.25)',
                                textTransform: 'uppercase',
                            }}>
                                Cargando escena
                            </span>
                            <span style={{
                                fontFamily: "'Helvetica Neue', sans-serif",
                                fontSize: 10,
                                letterSpacing: '0.1em',
                                color: 'rgba(255,255,255,0.45)',
                            }}>
                                {Math.round(loadProgress)}%
                            </span>
                        </div>
                    </motion.div>

                    {/* Texto inferior */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        style={{
                            position: 'absolute',
                            bottom: 32,
                            fontFamily: "'Helvetica Neue', sans-serif",
                            fontSize: 10,
                            letterSpacing: '0.25em',
                            color: 'rgba(255,255,255,0.15)',
                            textTransform: 'uppercase',
                        }}
                    >
                        Experiencia inmersiva 3D
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
