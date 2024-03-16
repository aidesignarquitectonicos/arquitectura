import React, { useState } from 'react';
import { Button, TextField, Box, Grid, Typography, Container, Alert, FormControl, InputLabel, Select, MenuItem, AppBar, Toolbar, IconButton } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { storage, database } from '../../Data/FirebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { set, ref as dbRef } from "firebase/database";
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Upload() {
    const navigate = useNavigate();

    //Constantes del ALERT
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
    // retorno a pagina anterior
    const handleBack = () => {
        navigate(-1);
    };
    const [role, setRole] = useState('');
    const [files, setFiles] = useState([]);
    //Show alerts constantes
    const [showAlert, setShowAlert] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);

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

    const handleFileChange = (e) => {
        const selectedFiles = e.target.files;
        setFiles(selectedFiles);
        // Crear URL para previsualizar imágenes
        const filesArray = Array.from(selectedFiles);
        const imagesURLs = filesArray.map(file => URL.createObjectURL(file));
        setPreviewImages(imagesURLs);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación para asegurar que hay texto en los campos y al menos una imagen seleccionada
        if (!fields.field1 || !fields.field2 || !fields.field3 || files.length === 0) {
            setAlertInfo({
                showAlert: true,
                type: 'error',
                message: 'No hay datos para enviar. Asegúrate de haber llenado los campos de texto y seleccionado al menos una imagen.'
            });
            return;
        }

        // Aquí iría la lógica para enviar la información al backend,
        const folderUuid = uuidv4();
        const imageRefs = [];
        // incluido el envío de archivos e información de los campos de texto.
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileRef = ref(storage, `images/Dataimg/${folderUuid}/${file.name}`);
            await uploadBytes(fileRef, file).then(async (snapshot) => {
                const downloadURL = await getDownloadURL(snapshot.ref);
                imageRefs.push(downloadURL);
            });
        }
        // El UUID debería ser generado en el backend antes de la carga para asegurar su unicidad y seguridad.
        const projectRef = dbRef(database, `Projects/${folderUuid}`);
        set(projectRef, {
            field1: fields.field1,
            field2: fields.field2,
            field3: fields.field3,
            role: role,
            images: imageRefs,
        });

        // Si todo sale bien y los datos se envían correctamente:
        setAlertInfo({
            showAlert: true,
            type: 'success',
            message: 'Imágenes y datos enviados correctamente.'
        });
        setShowAlert(true);

    };
    return (
        <>
            <AppBar position="fixed" sx={{ background: "#f4f4f4", color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar >
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

                    alignItems: 'center',
                    justifyContent: 'center',


                    paddingTop: 2
                }}>
                    {alertInfo.showAlert && <Alert severity={alertInfo.type} sx={{ width: '100%', mb: 2 }}>
                        {alertInfo.message}
                    </Alert>}

                    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
                        <Grid container spacing={2} direction="column" alignItems="center" justify="center">

                            <Grid item xs={12}>
                                <TextField
                                    label="Titulo del Projecto"
                                    variant="outlined"
                                    name="field1"
                                    value={fields.field1}
                                    onChange={handleFieldChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Descripción Corta"
                                    variant="outlined"
                                    name="field2"
                                    value={fields.field2}
                                    onChange={handleFieldChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Descripción Completa"
                                    variant="outlined"
                                    name="field3"
                                    value={fields.field3}
                                    onChange={handleFieldChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid
                                item xs={12}

                                sx={{
                                    textAlign: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    justifyContent: "center"
                                }}>
                                <Grid item xs={12}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="raised-button-file"
                                        multiple
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="raised-button-file">
                                        <Button variant="contained" component="span">
                                            Upload Images
                                        </Button>
                                    </label>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 }}>
                                        {previewImages.map((image, index) => (
                                            <Box key={index} sx={{ margin: 1 }}>
                                                <img src={image} alt={`preview ${index}`} style={{ width: '100px', height: '100px' }} />
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="role-select-label">Rol</InputLabel>
                                        <Select
                                            labelId="role-select-label"
                                            id="role-select"
                                            value={role}
                                            label="Rol"
                                            onChange={handleRoleChange}
                                        >
                                            <MenuItem value={"Fachada"}>Fachada</MenuItem>
                                            <MenuItem value={"Diseño de Interiores"}>Diseño de Interiores</MenuItem>
                                            <MenuItem value={"Remodelación"}>Remodelación</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
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