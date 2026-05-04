import React, { useRef } from 'react';
import QRCode from 'qrcode.react';
import { Dialog, DialogTitle, DialogContent, IconButton, Button, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';

const QRCodePopup = ({ open, onClose, url, project }) => {
    const qrCodeRef = useRef(null);
    const qrSize = 151; // 40mm en píxeles (aproximadamente 151 px a 96 PPI)
    const ppi = 96; // Establecer PPI

    const handleDownload = () => {
        if (qrCodeRef.current) {
            html2canvas(qrCodeRef.current, { scale: 1, width: qrSize, height: qrSize }).then(canvas => {
                const imgData = canvas.toDataURL("image/png", 1.0); // Asegúrate de que el tipo sea 'image/png'
                const link = document.createElement('a');
                link.href = imgData;
                link.download = `${project.field1 || 'desconocido'}.png`; // Nombre de archivo único con el ID del proyecto
                link.click();
            });
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Código QR del Proyecto {project && project.field1 ? project.field1 : "Desconocido"}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        marginLeft: 'auto',
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box ref={qrCodeRef} sx={{ display: 'inline-block', padding: 0, backgroundColor: 'white', width: qrSize, height: qrSize }}>
                    {/* Genera el código QR solo si 'url' está disponible */}
                    {url && <QRCode value={url} size={qrSize} />}
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownload}
                    sx={{ marginTop: 2 }}
                    disabled={!url} // Deshabilitar el botón si no hay URL
                >
                    Descargar QR
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default QRCodePopup;
