/**
 * Google Drive CDN Service
 *
 * Flujo:
 *  1. Autenticar al usuario con Google Identity Services (OAuth2 → scope drive.file)
 *  2. Subir imagen con multipart upload a Drive API v3
 *  3. Dar permiso público (anyone → reader) al archivo
 *  4. Devolver URL CDN:
 *       https://www.googleapis.com/drive/v3/files/{FILE_ID}?alt=media&key={API_KEY}
 *
 * Variables de entorno requeridas (.env):
 *   REACT_APP_GOOGLE_CLIENT_ID       → OAuth 2.0 Client ID (Web application)
 *   REACT_APP_GOOGLE_API_KEY         → API Key habilitada para Drive API v3
 *   REACT_APP_GOOGLE_DRIVE_FOLDER_ID → ID de la carpeta pública en Google Drive
 */

const DRIVE_API = "https://www.googleapis.com/drive/v3/files";
const DRIVE_UPLOAD_API = "https://www.googleapis.com/upload/drive/v3/files";

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

// ---------- Subida a Drive ----------

/**
 * Sube un archivo de imagen a Google Drive.
 * @param {File} file - Archivo a subir
 * @param {string} folderName - Prefijo/nombre de la carpeta del proyecto
 * @returns {string} URL pública CDN con alt=media
 */
export async function uploadImageToDrive(file, folderName) {
    const token = await getToken();
    const folderId = process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_ID;

    if (!folderId) {
        throw new Error(
            "REACT_APP_GOOGLE_DRIVE_FOLDER_ID no está configurado en .env"
        );
    }

    // Metadata del archivo en Drive
    const metadata = {
        name: `${folderName}_${file.name}`,
        parents: [folderId],
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

    // URL CDN pública usando alt=media + API Key
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    return `${DRIVE_API}/${fileId}?alt=media&key=${apiKey}`;
}

/**
 * Sube múltiples imágenes a Google Drive en secuencia.
 * @param {File[]} files - Array de archivos a subir
 * @param {string} folderName - Prefijo del proyecto
 * @returns {string[]} Array de URLs CDN públicas
 */
export async function uploadImagesToDrive(files, folderName) {
    const urls = [];
    for (const file of files) {
        const url = await uploadImageToDrive(file, folderName);
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
