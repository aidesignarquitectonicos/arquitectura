import React, { useState } from 'react';
import {
    Button, TextField, Box, Grid, Typography,
    Container, Alert, FormControl, InputLabel, Select,
    MenuItem, AppBar, Toolbar, IconButton
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { storage, database } from '../../Data/FirebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { set, ref as dbRef } from "firebase/database";
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';

const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

function Upload() {
    const navigate = useNavigate();

    const [alertInfo, setAlertInfo] = useState({
        showAlert: false,
        type: 'success', // Puede ser 'error', 'warning', 'info', 'success'
        message: ''
    });

    const [fields, setFields] = useState({
        field1: '',
        field2: '',
        field3: '',
    });

    const [role, setRole] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [videoFiles, setVideoFiles] = useState([]);

    const [previewImages, setPreviewImages] = useState([]);
    const [previewVideos, setPreviewVideos] = useState([]);

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setFields(prevFields => ({
            ...prevFields,
            [name]: value,
        }));
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const imageFilesArray = selectedFiles.filter(file => file.type.startsWith('image/'));

        setImageFiles(imageFilesArray);

        const imagesURLs = imageFilesArray.map(file => URL.createObjectURL(file));
        setPreviewImages(imagesURLs);
    };

    const handleVideoChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const videoFilesArray = selectedFiles.filter(file => file.type.startsWith('video/'));

        setVideoFiles(videoFilesArray);

        const videoURLs = videoFilesArray.map(file => URL.createObjectURL(file));
        setPreviewVideos(videoURLs);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación para asegurar que hay texto en los campos y al menos una imagen y un video seleccionados
        if (!fields.field1 || !fields.field2 || !fields.field3 || imageFiles.length === 0 || videoFiles.length === 0) {
            setAlertInfo({
                showAlert: true,
                type: 'error',
                message: 'Por favor, completa todos los campos y selecciona al menos una imagen y un video.'
            });
            return;
        }

        // Lógica para enviar archivos al almacenamiento y guardar datos en la base de datos
        const folderUuid = uuidv4();
        const imageRefs = await uploadFiles(imageFiles, `images/Dataimg/${folderUuid}`);
        const videoRefs = await uploadFiles(videoFiles, `images/Datavideo/${folderUuid}`);

        // Guardar información en la base de datos
        const projectRef = dbRef(database, `Projects/${folderUuid}`);
        set(projectRef, {
            field1: fields.field1,
            field2: fields.field2,
            field3: fields.field3,
            role: role,
            images: imageRefs,
            videos: videoRefs,
        });

        // Mostrar alerta de éxito
        setAlertInfo({
            showAlert: true,
            type: 'success',
            message: 'Imágenes, Video y datos enviados correctamente.'
        });
        // Limpiar los campos y estados después de la subida exitosa
        setFields({
            field1: '',
            field2: '',
            field3: '',
        });
        setRole('');
        setImageFiles([]);
        setVideoFiles([]);
        setPreviewImages([]);
        setPreviewVideos([]);
    };

    const uploadFiles = async (files, storagePath) => {
        const fileRefs = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileRef = ref(storage, `${storagePath}/${file.name}`);
            await uploadBytes(fileRef, file).then(async (snapshot) => {
                const downloadURL = await getDownloadURL(snapshot.ref);
                fileRefs.push(downloadURL);
            });
        }
        return fileRefs;
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            <AppBar position="fixed" sx={{
                background: "#f4f4f4",
                color: "#000",
                zIndex: (theme) => theme.zIndex.drawer + 1,
                borderBottomLeftRadius: '20px',
                borderBottomRightRadius: '20px'
            }}>
                <Toolbar>
                    <IconButton onClick={handleBack} aria-label="Regresar">
                        <ArrowBack fontSize='32px' />
                    </IconButton>
                    <Typography>
                        Upload
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm" sx={{ marginTop: 8, marginBottom: 4 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    paddingTop: 2
                }}>
                    {alertInfo.showAlert &&
                        <Alert severity={alertInfo.type} sx={{ width: '100%', mb: 2 }}>
                            {alertInfo.message}
                        </Alert>}

                    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
                        <Grid container spacing={2} direction="column" alignItems="center" justify="center">
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    maxRows={10}
                                    aria-label="maximum height"
                                    minRows={3}
                                    placeholder="Titulo del Projecto"
                                    name="field1"
                                    value={fields.field1}
                                    onChange={handleFieldChange}
                                    fullWidth
                                    style={{
                                        backgroundColor: grey[50],
                                        color: grey[700],
                                        border: `1px solid ${grey[300]}`,
                                        padding: '10px',
                                        fontSize: '14px',
                                        borderRadius: 20
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    maxRows={10}
                                    aria-label="maximum height"
                                    placeholder="Descripción Corta"
                                    minRows={3}
                                    name="field2"
                                    defaultValue={fields.field2}
                                    onChange={handleFieldChange}
                                    fullWidth
                                    style={{
                                        backgroundColor: grey[50],
                                        color: grey[700],
                                        border: `1px solid ${grey[300]}`,
                                        padding: '10px',
                                        fontSize: '14px',
                                        borderRadius: 20
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    maxRows={10}
                                    aria-label="maximum height"
                                    placeholder="Descripción Completa"
                                    minRows={3}
                                    name="field3"
                                    value={fields.field3}
                                    onChange={handleFieldChange}
                                    fullWidth
                                    style={{
                                        backgroundColor: grey[50],
                                        color: grey[700],
                                        border: `1px solid ${grey[300]}`,
                                        padding: '10px',
                                        fontSize: '14px',
                                        borderRadius: 20
                                    }}
                                />
                            </Grid>
                            <br />
                            <Grid sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100vw',
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center'
                            }} spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="raised-button-file"
                                        multiple
                                        type="file"
                                        onChange={handleImageChange}
                                    />
                                    <label htmlFor="raised-button-file">
                                        <Button variant="contained" component="span">
                                            Upload Images
                                        </Button>
                                    </label>
                                    <Box sx={{
                                        display: 'flex', flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        marginTop: 2, width: '100%',
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        textAlign: 'center'
                                    }}>
                                        {previewImages.map((image, index) => (
                                            <Box key={index} sx={{ margin: 1 }}>
                                                <img src={image} alt={`preview ${index}`} style={{ width: '100px', height: '100px' }} />
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>

                                    <input
                                        accept="video/*"
                                        style={{ display: 'none' }}
                                        id="raised-button-file-video"
                                        multiple
                                        type="file"
                                        onChange={handleVideoChange}
                                    />
                                    <label htmlFor="raised-button-file-video">
                                        <Button variant="contained" component="span">
                                            Upload Videos
                                        </Button>
                                    </label>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        flexWrap: 'wrap', marginTop: 2,
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        textAlign: 'center'
                                    }}>
                                        {previewVideos.map((video, index) => (
                                            <Box key={index} sx={{ margin: 1 }}>
                                                <video key={index} src={video}
                                                    alt={`preview ${index}`}
                                                    style={{ width: '150px', height: '150px' }}
                                                    controls />
                                            </Box>
                                        ))}
                                    </Box>

                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl sx={{ width: '200px' }} fullWidth>
                                    <InputLabel sx={{ width: '250px' }} id="role-select-label">Seleccione el Rol</InputLabel>
                                    <Select
                                        labelId="role-select-label"
                                        id="role-select"
                                        value={role}
                                        label="Rol"
                                        onChange={handleRoleChange}
                                        style={{
                                            backgroundColor: grey[50],
                                            color: grey[700],
                                            border: `1px solid ${grey[300]}`,
                                            padding: '10px',
                                            fontSize: '14px',
                                            borderRadius: 20
                                        }}
                                    >
                                        <MenuItem value={"Fachada"}>Fachada</MenuItem>
                                        <MenuItem value={"Diseño de Interiores"}>Diseño de Interiores</MenuItem>
                                        <MenuItem value={"Remodelación"}>Remodelación</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
}

export default Upload;
