import React from 'react';
import QRCode from 'qrcode.react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const QRCodePopup = ({ open, onClose, url }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Código QR del Proyecto
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <QRCode value={url} size={256} />
            </DialogContent>
        </Dialog>
    );
};

export default QRCodePopup;