/**
 * Componente para inyectar metadatos de video dinámicamente en el head
 * Crítico para SEO de videos en SPAs (React)
 * 
 * Uso:
 * <VideoMetaTags 
 *   title="Proyecto Casa Moderna"
 *   description="Recorrido 3D arquitectónico"
 *   videoUrl="https://..."
 *   thumbnailUrl="https://..."
 *   duration={120}
 *   uploadDate="2026-04-09T00:00:00Z"
 * />
 */

import { useEffect } from 'react';

export function VideoMetaTags({
    title = "AI Design Arquitectónicos",
    description = "Visualización arquitectónica 3D",
    videoUrl = null,
    thumbnailUrl = "https://aidesignarquitectonicos.github.io/arquitectura/thumbnail.jpg",
    duration = null,
    uploadDate = new Date().toISOString(),
    width = 1280,
    height = 720,
    type = "video/mp4",
    siteUrl = "https://aidesignarquitectonicos.github.io/arquitectura/",
}) {
    useEffect(() => {
        // Actualizar etiquetas Open Graph de video
        updateMetaTag('og:title', title);
        updateMetaTag('og:description', description);
        updateMetaTag('og:type', 'video.other');
        updateMetaTag('og:url', window.location.href);
        updateMetaTag('og:image', thumbnailUrl);
        updateMetaTag('og:image:width', '1280');
        updateMetaTag('og:image:height', '720');

        // Etiquetas específicas para video en Open Graph
        if (videoUrl) {
            updateMetaTag('og:video', videoUrl);
            updateMetaTag('og:video:url', videoUrl);
            updateMetaTag('og:video:secure_url', videoUrl);
            updateMetaTag('og:video:type', type);
            updateMetaTag('og:video:width', width.toString());
            updateMetaTag('og:video:height', height.toString());
        }

        // Twitter Card para video
        updateMetaTag('twitter:card', 'player');
        updateMetaTag('twitter:title', title);
        updateMetaTag('twitter:description', description);
        updateMetaTag('twitter:image', thumbnailUrl);
        if (videoUrl) {
            updateMetaTag('twitter:player', videoUrl);
            updateMetaTag('twitter:player:width', width.toString());
            updateMetaTag('twitter:player:height', height.toString());
        }

        // Etiqueta canonical actualizada
        updateCanonical(window.location.href);

        // Schema.org VideoObject (JSON-LD)
        if (videoUrl) {
            updateVideoSchema({
                name: title,
                description: description,
                thumbnailUrl: thumbnailUrl,
                uploadDate: uploadDate,
                contentUrl: videoUrl,
                embedUrl: siteUrl,
                duration: duration,
                interactionCount: 0, // Se actualiza con datos reales si disponible
                width: width,
                height: height,
            });
        }

        // Actualizar título de la página
        document.title = title + " | AI Design Arquitectónicos";

    }, [title, description, videoUrl, thumbnailUrl, duration, uploadDate, width, height, type, siteUrl]);

    return null;
}

/**
 * Utilidad: Actualizar metaetiqueta
 */
function updateMetaTag(name, content) {
    let element = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`);

    if (!element) {
        element = document.createElement('meta');
        if (name.startsWith('og:') || name === 'twitter:card') {
            element.setAttribute('property', name);
        } else {
            element.setAttribute('name', name);
        }
        document.head.appendChild(element);
    }

    element.setAttribute('content', content);
}

/**
 * Utilidad: Actualizar etiqueta canonical
 */
function updateCanonical(url) {
    let canonical = document.querySelector('link[rel="canonical"]');

    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }

    canonical.setAttribute('href', url);
}

/**
 * Utilidad: Actualizar esquema VideoObject en JSON-LD
 * Debe estar en el head para que Google lo detecte correctamente
 */
function updateVideoSchema(videoData) {
    // Calcular duración en formato ISO 8601 (PT...)
    let duration = videoData.duration ? `PT${videoData.duration}S` : undefined;

    const videoObject = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": videoData.name,
        "description": videoData.description,
        "thumbnailUrl": videoData.thumbnailUrl,
        "uploadDate": videoData.uploadDate,
        "contentUrl": videoData.contentUrl,
        "embedUrl": videoData.embedUrl,
        ...(duration && { "duration": duration }),
        "width": videoData.width,
        "height": videoData.height,
        "interactionCount": videoData.interactionCount || 0,
    };

    // Buscar script existente de VideoObject
    let script = document.querySelector('script[data-video-schema="true"]');

    if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-video-schema', 'true');
        document.head.appendChild(script);
    }

    script.innerHTML = JSON.stringify(videoObject, null, 2);
}

export default VideoMetaTags;
