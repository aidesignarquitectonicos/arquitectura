#!/usr/bin/env node

/**
 * Video Sitemap Generator para Google Video Search
 * 
 * Genera un sitemap.xml con TODOS los videos del sitio
 * incluyendo videos de proyectos en Firebase
 * 
 * Uso:
 *   node scripts/generate-video-sitemap.js
 * 
 * Requisitos:
 *   - Variables de entorno de Firebase en .env.local
 *   - Base de datos Firebase con estructura: Projects/{uuid}/videos
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuración base
const BASE_URL = 'https://aidesignarquitectonicos.github.io/arquitectura';
const FIREBASE_URL = 'https://aidesign-9022b-default-rtdb.firebaseio.com';
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap-videos.xml');

/**
 * Estructura de entrada de video para sitemap
 */
function createVideoEntry(videoData, projectUuid) {
  const {
    url: contentUrl,
    title,
    description,
    thumbnailUrl,
    duration,
    publicationDate,
  } = videoData;

  if (!contentUrl) return null;

  // Asegurar URLs completas
  const fullContentUrl = contentUrl.startsWith('http') ? contentUrl : `${BASE_URL}/${contentUrl}`;
  const fullThumbnailUrl = thumbnailUrl?.startsWith('http') ? thumbnailUrl : `${BASE_URL}/thumbnail.jpg`;

  return {
    loc: `${BASE_URL}/#/project/${projectUuid}`,
    video: {
      thumbnail_loc: fullThumbnailUrl,
      title: title || 'Video de Proyecto Arquitectónico',
      description: description || 'Visualización arquitectónica 3D',
      content_loc: fullContentUrl,
      player_loc: {
        text: `${BASE_URL}/#/project/${projectUuid}`,
        '@allow_embed': 'yes',
      },
      duration: duration || 120,
      publication_date: publicationDate || new Date().toISOString(),
    },
  };
}

/**
 * Fetch de datos desde Firebase
 */
function fetchFirebaseData(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${FIREBASE_URL}${endpoint}.json`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          resolve(null);
        }
      });
    }).on('error', (err) => {
      console.warn(`⚠️  Firebase fetch error para ${endpoint}:`, err.message);
      resolve(null);
    });
  });
}

/**
 * Convertir objeto de proyectos a array
 */
function projectsToArray(projectsObj) {
  if (!projectsObj) return [];
  if (Array.isArray(projectsObj)) return projectsObj;
  
  return Object.entries(projectsObj).map(([uuid, data]) => ({
    uuid,
    ...data,
  }));
}

/**
 * Convertir array de videos a array indexado
 */
function videosToArray(videosObj) {
  if (!videosObj) return [];
  if (Array.isArray(videosObj)) return videosObj;
  
  return Object.entries(videosObj)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([, video]) => video);
}

/**
 * Generar XML del sitemap
 */
function generateSitemapXml(videoEntries) {
  const validEntries = videoEntries.filter(e => e !== null);
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
>
`;

  validEntries.forEach(entry => {
    const video = entry.video;
    
    xml += `  <url>
    <loc>${entry.loc}</loc>
    <video:video>
      <video:thumbnail_loc>${video.thumbnail_loc}</video:thumbnail_loc>
      <video:title>${escapeXml(video.title)}</video:title>
      <video:description>${escapeXml(video.description)}</video:description>
      <video:content_loc>${video.content_loc}</video:content_loc>
      <video:player_loc allow_embed="yes">${video.player_loc.text}</video:player_loc>
      <video:duration>${video.duration}</video:duration>
      <video:publication_date>${video.publication_date}</video:publication_date>
    </video:video>
  </url>
`;
  });

  xml += `</urlset>`;
  
  return xml;
}

/**
 * Escapar caracteres especiales XML
 */
function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Función principal
 */
async function generateSitemap() {
  console.log('📹 Generando Video Sitemap...\n');

  try {
    // 1. Obtener todos los proyectos desde Firebase
    console.log('📥 Obteniendo proyectos desde Firebase...');
    const projectsData = await fetchFirebaseData('/Projects');
    const projects = projectsToArray(projectsData);
    console.log(`✅ Se encontraron ${projects.length} proyectos\n`);

    // 2. Recopilar todas las entradas de video
    const videoEntries = [];
    
    projects.forEach(project => {
      const { uuid, field1, field2, videos } = project;
      
      if (!videos) return; // Saltar proyectos sin videos

      const videosArray = videosToArray(videos);
      
      videosArray.forEach((video, index) => {
        // Crear entrada de video mejorada
        const entry = createVideoEntry(
          {
            url: video.url || video,
            title: `${field1 || 'Proyecto'} - Video ${index + 1}`,
            description: field2 || 'Visualización arquitectónica 3D de proyecto',
            thumbnailUrl: `${BASE_URL}/thumbnail-${uuid}-${index}.jpg`,
            duration: 120,
            publicationDate: new Date().toISOString(),
          },
          uuid
        );
        
        if (entry) {
          videoEntries.push(entry);
        }
      });
    });

    // 3. Agregar video de la página principal
    const homeVideoEntry = createVideoEntry(
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/aidesign-9022b.appspot.com/o/images%2FDatavideo%2Fd12ca586-7284-45b8-b625-5da34a56011b%2FWhatsApp%20Video%202024-06-18%20at%205.52.10%20PM.mp4?alt=media&token=3345c4f2-6968-402a-870d-5642bb90825d',
        title: 'Recorrido Arquitectónico 3D',
        description: 'Visualización arquitectónica 3D realizada con Twinmotion y React Three Fiber',
        thumbnailUrl: `${BASE_URL}/thumbnail.jpg`,
        duration: 120,
        publicationDate: '2026-04-09T12:00:00+00:00',
      },
      ''
    );

    if (homeVideoEntry) {
      // Cambiar la URL para que sea la página principal
      homeVideoEntry.loc = BASE_URL;
      videoEntries.unshift(homeVideoEntry);
    }

    console.log(`✅ Se encontraron ${videoEntries.length} entradas de video\n`);

    // 4. Generar XML
    console.log('⚙️  Generando XML del sitemap...');
    const sitemapXml = generateSitemapXml(videoEntries);

    // 5. Guardar archivo
    console.log(`💾 Guardando en ${SITEMAP_PATH}`);
    fs.writeFileSync(SITEMAP_PATH, sitemapXml, 'utf8');

    console.log(`\n✅ ¡Video Sitemap generado exitosamente!`);
    console.log(`   📄 Archivo: ${SITEMAP_PATH}`);
    console.log(`   📹 Videos indexados: ${videoEntries.length}`);
    console.log(`\n📌 Próximos pasos:`);
    console.log(`   1. Ejecuta: npm run build`);
    console.log(`   2. Sube sitemap-videos.xml a Google Search Console`);
    console.log(`   3. URL del sitemap: ${BASE_URL}/sitemap-videos.xml`);

  } catch (error) {
    console.error('❌ Error generando sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
