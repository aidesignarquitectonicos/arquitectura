import React, { useEffect, useRef, useState } from 'react';
import nipplejs from 'nipplejs';
import { useViewerStore } from '../../store/viewerStore';

// ─── JOYSTICK VIRTUAL PARA MÓVIL ──────────────────────────────────────────────
export let mobileInput = { x: 0, y: 0 }; // compartido con WalkingControls

export function MobileJoystick() {
    const containerRef = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
            || window.innerWidth <= 768;
        setVisible(isMobile);
        if (!isMobile) return;

        const manager = nipplejs.create({
            zone: containerRef.current,
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: 'rgba(255,255,255,0.4)',
            size: 100,
        });

        manager.on('move', (_, data) => {
            if (data.vector) {
                mobileInput.x = data.vector.x;
                mobileInput.y = -data.vector.y; // invertir eje Y
            }
        });

        manager.on('end', () => {
            mobileInput.x = 0;
            mobileInput.y = 0;
        });

        return () => manager.destroy();
    }, []);

    if (!visible) return null;

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                bottom: 40,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 130,
                height: 130,
                zIndex: 800,
            }}
        />
    );
}

// ─── HUD CONTROLES (teclado hint) ─────────────────────────────────────────────
export function KeyboardHint() {
    const cameraMode = useViewerStore((s) => s.cameraMode);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setDismissed(true), 6000);
        return () => clearTimeout(t);
    }, []);

    if (cameraMode !== 'walk' || dismissed) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(8,8,18,0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: '10px 20px',
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            zIndex: 800,
        }}>
            {['W', 'A', 'S', 'D'].map((k) => (
                <span key={k} style={{
                    fontFamily: 'monospace',
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.5)',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 4,
                    padding: '3px 8px',
                }}>
                    {k}
                </span>
            ))}
            <span style={{
                fontFamily: "'Helvetica Neue', sans-serif",
                fontSize: 10,
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.1em',
            }}>
                Mover · Shift = Sprint · Click = Mirar
            </span>
        </div>
    );
}
