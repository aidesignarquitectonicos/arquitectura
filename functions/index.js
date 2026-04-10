const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors");

// Middleware CORS
const corsHandler = cors({ origin: true });

/**
 * Proxy para descargar imágenes de Google Drive sin problemas de CORS
 * Uso: GET /driveImageProxy?id={fileId}
 */
exports.driveImageProxy = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        try {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ error: "Missing file ID parameter" });
            }

            // URL de Google Drive para descargar el archivo
            const driveUrl = `https://drive.usercontent.google.com/download?id=${id}&export=download`;

            // Descargar la imagen
            const response = await axios.get(driveUrl, {
                responseType: "arraybuffer",
                timeout: 30000,
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
            });

            // Detectar el tipo de contenido
            const contentType = response.headers["content-type"] || "image/jpeg";

            // Configurar headers CORS
            res.set("Access-Control-Allow-Origin", "*");
            res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
            res.set("Access-Control-Allow-Headers", "Content-Type");
            res.set("Content-Type", contentType);
            res.set("Cache-Control", "public, max-age=31536000");
            res.set("Content-Length", response.data.length);

            // Enviar la imagen
            res.send(response.data);
        } catch (error) {
            console.error("Error al descargar imagen de Drive:", error.message);

            res.set("Access-Control-Allow-Origin", "*");
            res.status(500).json({
                error: "Failed to download image from Drive",
                message: error.message,
            });
        }
    });
});

/**
 * Proxy para descargar videos de Google Drive sin problemas de CORS
 * Uso: GET /driveVideoProxy?id={fileId}
 */
exports.driveVideoProxy = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        try {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ error: "Missing file ID parameter" });
            }

            // URL de Google Drive para descargar el archivo
            const driveUrl = `https://drive.usercontent.google.com/download?id=${id}&export=download`;

            // Descargar el video con stream para videos grandes
            const response = await axios.get(driveUrl, {
                responseType: "stream",
                timeout: 60000,
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
            });

            // Detectar el tipo de contenido
            const contentType = response.headers["content-type"] || "video/mp4";

            // Configurar headers CORS
            res.set("Access-Control-Allow-Origin", "*");
            res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
            res.set("Access-Control-Allow-Headers", "Content-Type, Range");
            res.set("Content-Type", contentType);
            res.set("Cache-Control", "public, max-age=31536000");

            // Si hay información de tamaño, enviarla
            if (response.data.headers["content-length"]) {
                res.set(
                    "Content-Length",
                    response.data.headers["content-length"]
                );
            }

            // Hacer pipe del stream
            response.data.pipe(res);
        } catch (error) {
            console.error("Error al descargar video de Drive:", error.message);

            res.set("Access-Control-Allow-Origin", "*");
            res.status(500).json({
                error: "Failed to download video from Drive",
                message: error.message,
            });
        }
    });
});
