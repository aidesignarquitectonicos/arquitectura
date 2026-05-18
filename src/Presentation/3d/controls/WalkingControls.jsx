import React, { useRef, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { useViewerStore } from '../../store/viewerStore';

const SPEED_NORMAL = 4;
const SPEED_SPRINT = 9;
const WALK_HEIGHT = 1.7;

// Mapa de teclas activas
const keys = {};

export function WalkingControls({ colliders = [] }) {
    const { camera, gl } = useThree();
    const controlsRef = useRef();
    const setUserPosition = useViewerStore((s) => s.setUserPosition);
    const setUserRotation = useViewerStore((s) => s.setUserRotation);
    const isSprinting = useViewerStore((s) => s.isSprinting);
    const setSprinting = useViewerStore((s) => s.setSprinting);

    const velocity = useRef(new THREE.Vector3());
    const direction = useRef(new THREE.Vector3());
    const raycaster = useRef(new THREE.Raycaster());

    const onKeyDown = useCallback((e) => {
        keys[e.code] = true;
        if (e.code === 'ShiftLeft') setSprinting(true);
    }, [setSprinting]);

    const onKeyUp = useCallback((e) => {
        keys[e.code] = false;
        if (e.code === 'ShiftLeft') setSprinting(false);
    }, [setSprinting]);

    // Cooldown para evitar el error del navegador al re-adquirir pointer lock
    // inmediatamente después de haberlo liberado.
    useEffect(() => {
        const domElement = gl.domElement;
        let lockCooldown = false;
        const originalRequestPointerLock = domElement.requestPointerLock.bind(domElement);

        domElement.requestPointerLock = () => {
            if (lockCooldown) return;
            try {
                originalRequestPointerLock();
            } catch (_) {
                // ignorar errores de timing del navegador
            }
        };

        const onPointerLockChange = () => {
            if (document.pointerLockElement !== domElement) {
                lockCooldown = true;
                setTimeout(() => { lockCooldown = false; }, 1200);
            }
        };

        const onPointerLockError = (e) => {
            e.preventDefault();
            lockCooldown = true;
            setTimeout(() => { lockCooldown = false; }, 1200);
        };

        document.addEventListener('pointerlockchange', onPointerLockChange);
        document.addEventListener('pointerlockerror', onPointerLockError);

        return () => {
            domElement.requestPointerLock = originalRequestPointerLock;
            document.removeEventListener('pointerlockchange', onPointerLockChange);
            document.removeEventListener('pointerlockerror', onPointerLockError);
        };
    }, [gl.domElement]);

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [onKeyDown, onKeyUp]);

    useFrame((_, delta) => {
        if (!controlsRef.current?.isLocked) return;

        const speed = isSprinting ? SPEED_SPRINT : SPEED_NORMAL;

        // Dirección de movimiento en espacio de cámara
        direction.current.set(0, 0, 0);
        if (keys['KeyW'] || keys['ArrowUp']) direction.current.z -= 1;
        if (keys['KeyS'] || keys['ArrowDown']) direction.current.z += 1;
        if (keys['KeyA'] || keys['ArrowLeft']) direction.current.x -= 1;
        if (keys['KeyD'] || keys['ArrowRight']) direction.current.x += 1;
        direction.current.normalize();

        // Velocidad con amortiguación suave
        velocity.current.x += direction.current.x * speed * delta * 60 * 0.1;
        velocity.current.z += direction.current.z * speed * delta * 60 * 0.1;
        velocity.current.x *= 0.85;
        velocity.current.z *= 0.85;

        // Colisión: raycast hacia adelante
        const moveDir = velocity.current.clone().normalize();
        if (colliders.length > 0 && moveDir.length() > 0.01) {
            raycaster.current.set(camera.position, moveDir);
            const hits = raycaster.current.intersectObjects(colliders, true);
            if (hits.length > 0 && hits[0].distance < 0.6) {
                velocity.current.set(0, 0, 0);
            }
        }

        controlsRef.current.moveRight(velocity.current.x * delta);
        controlsRef.current.moveForward(-velocity.current.z * delta);

        // Fijar altura de cámara
        camera.position.y = WALK_HEIGHT;

        // Actualizar minimap
        setUserPosition(camera.position);
        setUserRotation(camera.rotation.y);
    });

    return (
        <PointerLockControls
            ref={controlsRef}
            args={[camera, gl.domElement]}
            pointerSpeed={0.8}
        />
    );
}
