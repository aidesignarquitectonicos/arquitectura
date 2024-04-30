import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TikTokIcon from '@mui/icons-material/MusicNote'; // Material-UI no tiene un ícono específico de TikTok, así que usamos MusicNote como alternativa

function Footer() {
    return (
        <Box
            position="fixed"
            sx={{
                width: '100vw',
                bottom: 0,
                height: '10vh',
                display: 'flex',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
                background: "#f4f4f4", // Ajusta el color de fondo según tu preferencia
                borderTop: '1px solid #e0e0e0', // Borde superior para separar el footer del contenido
                '@media (max-width: 600px)': { // Media query para pantallas pequeñas
                    padding: '10px',
                    minHeight: '15vh',
                }
            }} 
        >
            {/* Contenedor de íconos de redes sociales */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '15px',
                    '@media (max-width: 600px)': {
                        gap: '10px',

                    },
                }}
            >
                <IconButton component="a" href="https://www.facebook.com/ARQ.JAVIERMS" target="_blank" aria-label="Facebook">
                    <FacebookIcon sx={{
                        fontSize: '30px',
                        
                        color: 'blue',
                        '@media (max-width: 600px)':
                            { fontSize: '30px' }
                    }} />
                </IconButton>
                <IconButton component="a" href="https://www.instagram.com/aidesign.jm/" target="_blank" aria-label="Instagram">
                    <InstagramIcon

                        sx={{
                            color: '#dc2743',
                            fontSize: '30px',
                            
                            '@media (max-width: 600px)': {
                                fontSize: '30px',
                                
                            },
                            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    />
                </IconButton>
                <IconButton component="a" href="https://wa.me/c/593969565333" target="_blank" aria-label="WhatsApp">
                    <WhatsAppIcon sx={{
                        fontSize: '30px',
                        
                        color: 'green',
                        '@media (max-width: 600px)':
                            { fontSize: '30px' }
                    }} />
                </IconButton>
                <IconButton component="a" href="https://www.tiktok.com" target="_blank" aria-label="TikTok">
                    <TikTokIcon
                        sx={{
                            fontSize: '30px',
                            
                            color: 'black',
                            '@media (max-width: 600px)':
                                { fontSize: '30px' }
                        }} />
                </IconButton>
            </Box>
            {/* Texto de derechos de autor */}
            <Typography variant="body2"
                color="text.secondary"
                align="center"
                sx={{
                     
                    '@media (max-width: 600px)':
                        { fontSize: '0.75rem' }
                }}>
                © 2020 AUIDESIGN - Todos los Derechos Reservados
            </Typography>
        </Box>
    );
}

export default Footer;
