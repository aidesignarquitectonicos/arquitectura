/**
 * Google Drive CDN Service
 *
 * Flujo:
 *  1. Autenticar al usuario con Google Identity Services (OAuth2 → scope drive.file)
 *  2. Subir imagen/video con multipart upload a Drive API v3
 *  3. Dar permiso público (anyone → reader) al archivo
 *  4. Devolver URL CDN pública que funciona directamente en <img> y <video>:
 *       https://drive.google.com/uc?export=view&id={FILE_ID}
 *
 * Variables de entorno requeridas (.env):
 *   REACT_APP_GOOGLE_CLIENT_ID       → OAuth 2.0 Client ID (Web application)
 *   REACT_APP_GOOGLE_DRIVE_FOLDER_ID → ID de la carpeta pública en Google Drive
 */

const DRIVE_API = "https://www.googleapis.com/drive/v3/files";
const DRIVE_UPLOAD_API = "https://www.googleapis.com/upload/drive/v3/files";
const DRIVE_VIEW_URL = "https://drive.usercontent.google.com/download?id=";

let accessToken = null;

// ---------- Autenticación con Google Identity Services ----------

function loadGoogleIdentityServices() {
    return new Promise((resolve) => {
        if (window.google?.accounts?.oauth2) {
            resolve();
            return;
        }
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

/**
 * Solicita un access token OAuth2 al usuario.
 * Abre el popup de Google sólo si no hay token previo.
 */
export async function requestGoogleAccessToken() {
    await loadGoogleIdentityServices();

    return new Promise((resolve, reject) => {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            scope: "https://www.googleapis.com/auth/drive.file",
            callback: (response) => {
                if (response.error) {
                    reject(new Error(`Error de autenticación: ${response.error}`));
                    return;
                }
                accessToken = response.access_token;
                resolve(accessToken);
            },
        });

        // prompt: '' reutiliza sesión existente sin popup si ya fue autorizado antes
        tokenClient.requestAccessToken({ prompt: "" });
    });
}

async function getToken() {
    if (!accessToken) {
        await requestGoogleAccessToken();
    }
    return accessToken;
}

// ---------- Crear carpeta para proyecto ----------

/**
 * Crea una carpeta en Google Drive para un proyecto.
 * @param {string} projectUuid - UUID del proyecto (será el nombre de la carpeta)
 * @returns {string} ID de la carpeta creada
 */
export async function createProjectFolder(projectUuid) {
    const token = await getToken();
    const parentFolderId = process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_ID;

    if (!parentFolderId) {
        throw new Error(
            "REACT_APP_GOOGLE_DRIVE_FOLDER_ID no está configurado en .env"
        );
    }

    // Crear metadata de la carpeta
    const folderMetadata = {
        name: projectUuid,
        mimeType: "application/vnd.google-apps.folder",
        parents: [parentFolderId],
    };

    const response = await fetch(DRIVE_API, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(folderMetadata),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Error al crear carpeta en Drive (${response.status}): ${err}`);
    }

    const folderData = await response.json();

    // Dar acceso público a la carpeta
    const permResponse = await fetch(`${DRIVE_API}/${folderData.id}/permissions`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "anyone", role: "reader" }),
    });

    if (!permResponse.ok) {
        const err = await permResponse.text();
        throw new Error(`Error al dar permiso público a la carpeta: ${err}`);
    }

    return folderData.id;
}

// ---------- Subida a Drive ----------

/**
 * Sube un archivo de imagen a Google Drive.
 * @param {File} file - Archivo a subir
 * @param {string} projectFolderId - ID de la carpeta del proyecto en Drive
 * @returns {string} URL pública CDN
 */
export async function uploadImageToDrive(file, projectFolderId) {
    const token = await getToken();

    if (!projectFolderId) {
        throw new Error(
            "El ID de la carpeta del proyecto no se proporcionó"
        );
    }

    // Metadata del archivo en Drive
    const metadata = {
        name: file.name,
        parents: [projectFolderId],
        mimeType: file.type,
    };

    // Multipart upload: metadata + binario
    const formData = new FormData();
    formData.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    formData.append("file", file);

    const uploadResponse = await fetch(
        `${DRIVE_UPLOAD_API}?uploadType=multipart&fields=id`,
        {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        }
    );

    if (!uploadResponse.ok) {
        const err = await uploadResponse.text();
        throw new Error(`Drive upload falló (${uploadResponse.status}): ${err}`);
    }

    const { id: fileId } = await uploadResponse.json();

    // Dar acceso público (anyone → reader)
    const permResponse = await fetch(`${DRIVE_API}/${fileId}/permissions`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "anyone", role: "reader" }),
    });

    if (!permResponse.ok) {
        const err = await permResponse.text();
        throw new Error(`Error al dar permiso público: ${err}`);
    }

    // URL pública que funciona directamente en <img> y <video>
    // Esta URL no requiere API Key y funciona para archivos públicos
    // Usa el endpoint drive.usercontent.google.com que no requiere redirecciones
    return `${DRIVE_VIEW_URL}${fileId}&export=view`;
}

/**
 * Sube múltiples imágenes a Google Drive en secuencia.
 * @param {File[]} files - Array de archivos a subir
 * @param {string} projectFolderId - ID de la carpeta del proyecto en Drive
 * @returns {string[]} Array de URLs CDN públicas
 */
export async function uploadImagesToDrive(files, projectFolderId) {
    const urls = [];
    for (const file of files) {
        const url = await uploadImageToDrive(file, projectFolderId);
        urls.push(url);
    }
    return urls;
}

/**
 * Sube un archivo de video a Google Drive.
 * @param {File} file - Archivo de video a subir
 * @param {string} projectFolderId - ID de la carpeta del proyecto en Drive
 * @returns {string} URL pública CDN que funciona en <video>
 */
export async function uploadVideoToDrive(file, projectFolderId) {
    const token = await getToken();

    if (!projectFolderId) {
        throw new Error(
            "El ID de la carpeta del proyecto no se proporcionó"
        );
    }

    // Metadata del archivo en Drive
    const metadata = {
        name: file.name,
        parents: [projectFolderId],
        mimeType: file.type || "video/mp4",
    };

    // Multipart upload: metadata + binario
    const formData = new FormData();
    formData.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    formData.append("file", file);

    const uploadResponse = await fetch(
        `${DRIVE_UPLOAD_API}?uploadType=multipart&fields=id`,
        {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        }
    );

    if (!uploadResponse.ok) {
        const err = await uploadResponse.text();
        throw new Error(`Drive upload falló (${uploadResponse.status}): ${err}`);
    }

    const { id: fileId } = await uploadResponse.json();

    // Dar acceso público (anyone → reader)
    const permResponse = await fetch(`${DRIVE_API}/${fileId}/permissions`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "anyone", role: "reader" }),
    });

    if (!permResponse.ok) {
        const err = await permResponse.text();
        throw new Error(`Error al dar permiso público: ${err}`);
    }

    // URL pública que funciona directamente en <video>
    // Esta URL no requiere API Key y funciona para archivos públicos
    // Usa el endpoint drive.usercontent.google.com que no requiere redirecciones
    return `${DRIVE_VIEW_URL}${fileId}&export=view`;
}

/**
 * Sube múltiples videos a Google Drive en secuencia.
 * @param {File[]} files - Array de archivos de video a subir
 * @param {string} projectFolderId - ID de la carpeta del proyecto en Drive
 * @returns {string[]} Array de URLs CDN públicas
 */
export async function uploadVideosToDrive(files, projectFolderId) {
    const urls = [];
    for (const file of files) {
        const url = await uploadVideoToDrive(file, projectFolderId);
        urls.push(url);
    }
    return urls;
}

/**
 * Limpia el token en memoria (logout / expiración).
 */
export function clearDriveToken() {
    accessToken = null;
}

/**
 * Convierte URLs viejas de Google Drive a un proxy CORS seguro.
 * El proxy resuelve el problema de CORS bloqueado por Google Drive.
 * 
 * URLs soportadas:
 *   - https://drive.usercontent.google.com/download?id=...
 *   - https://drive.google.com/uc?export=view&id=...
 *   - https://www.googleapis.com/drive/v3/files/{ID}?alt=media&key=...
 * 
 * @param {string} url - URL a convertir
 * @param {boolean} isVideo - Si es un video (usa proxy diferente)
 * @returns {string} URL del proxy CORS o URL original si no es Drive
 */
export function convertGoogleDriveUrl(url, isVideo = false) {
    if (!url) return url;

    let fileId = null;

    // Extraer fileId de cualquier formato de URL de Drive
    if (url.includes("drive.usercontent.google.com")) {
        fileId = url.match(/[?&]id=([a-zA-Z0-9-_]+)/)?.[1];
    } else if (url.includes("drive.google.com/uc")) {
        fileId = url.match(/[?&]id=([a-zA-Z0-9-_]+)/)?.[1];
    } else if (url.includes("lh3.googleusercontent.com/d/")) {
        return url; // Ya es el formato correcto para embeds
    } else if (url.includes("/files/")) {
        fileId = url.match(/\/files\/([a-zA-Z0-9-_]+)/)?.[1];
    }

    // Usar lh3.googleusercontent.com que sirve contenido directamente
    // sin páginas de confirmación de descarga/escaneo de virus
    if (fileId) {
        return `https://lh3.googleusercontent.com/d/${fileId}`;
    }

    return url;
}
