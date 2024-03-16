import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TikTokIcon from '@mui/icons-material/MusicNote'; // Material-UI no tiene un ícono específico de TikTok, así que usamos MusicNote como alternativa

function Footer() {
    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                backgroundColor: '#f8f8f8', // Ajusta el color de fondo según tu preferencia
                borderTop: '1px solid #e0e0e0', // Borde superior para separar el footer del contenido
            }}
        >
            {/* Contenedor de íconos de redes sociales */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px', // Espacio entre los íconos
                }}
            >
                <IconButton component="a" href="https://www.facebook.com/ARQ.JAVIERMS" target="_blank" aria-label="Facebook">
                    <FacebookIcon sx={{
                        fontSize: '84px',
                        color: 'blue'
                    }} />
                </IconButton>
                <IconButton component="a" href="https://www.instagram.com/aidesign.jm/" target="_blank" aria-label="Instagram">
                    <InstagramIcon fontSize='24px' sx={{
                        fontSize: '84px',
                         
                    }}/>
                </IconButton>
                <IconButton component="a" href="https://wa.me/c/593969565333" target="_blank" aria-label="WhatsApp">
                    <WhatsAppIcon sx={{
                        fontSize: '84px',
                        color: 'green'
                    }}/>
                </IconButton>
                <IconButton component="a" href="https://www.tiktok.com" target="_blank" aria-label="TikTok">
                    <TikTokIcon sx={{
                        fontSize: '84px',
                        color: 'black'
                    }}/>
                </IconButton>
            </Box>
            {/* Texto de derechos de autor */}
            <Typography variant="body2" color="text.secondary" align="center" sx={{ marginTop: '10px' }}>
                © 2020 AUIDESIGN - Todos los Derechos Reservados
            </Typography>
        </Box>
    );
}

export default Footer;
