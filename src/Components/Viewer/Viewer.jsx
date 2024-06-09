/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Typography } from '@mui/material';
import lateral_hacienda from '../../Assets/SVG/lateral_hacienda.svg';

const Viewer = () => {
    // Animación para cada parte del SVG
    const partAnimation = useAnimation();

    // Función para animar una parte del SVG
    const animatePart = async () => {
        // Ejemplo: animación de escala desde 0 a 1 en 1 segundo
        await partAnimation.start({
            scale: 1,
            transition: { duration: 1 },
        });
    };

    // Llamar a la función de animación al montar el componente
    React.useEffect(() => {
        animatePart();
    }, [animatePart]);


    return (
        <div style={{ position: 'absolute', zIndex: 1 }}>
            {/* SVG como imagen */}
            <img src={lateral_hacienda} alt="lateral_hacienda" style={{ width: '100%', height: 'auto' }} />

            {/* Cada parte del SVG como un componente motion */}
            <motion.path
                d="..." // Agrega aquí el atributo "d" de la primera parte del SVG
                fill="transparent"
                animate={partAnimation}
            />
            
        </div>

    );
};

export default Viewer;
