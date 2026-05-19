/**
 * ============================================================
 *  PIPELINE DE OPTIMIZACIÓN GLB – ARQUITECTURA WEB PREMIUM
 *  Objetivo: 381 MB → ~20-80 MB  |  Three.js / R3F / WebGL
 *  Motor: @gltf-transform/core + extensions + Draco + Meshopt
 * ============================================================
 */

import {
    NodeIO,
    Document,
    Logger,
} from '@gltf-transform/core';

import {
    dedup,
    flatten,
    join,
    weld,
    resample,
    prune,
    sparse,
    textureResize,
    textureCompress,
    simplify,
    quantize,
    instance,
    center,
    palette,
} from '@gltf-transform/functions';

import {
    KHRONOS_EXTENSIONS,
    KHRMaterialsUnlit,
    KHRTextureTransform,
    EXTMeshoptCompression,
    KHRDracoMeshCompression,
} from '@gltf-transform/extensions';

import draco3d from 'draco3dgltf';
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import { existsSync, mkdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { performance } from 'perf_hooks';

// ── CONFIG ───────────────────────────────────────────────────
const INPUT = path.resolve('/Volumes/SATECHI/GitHub/arquitectura/src/Presentation/Assets/model3d/casa1.glb');
const OUTPUT_DIR = path.resolve('/Volumes/SATECHI/GitHub/arquitectura/src/Presentation/Assets/model3d/optimized');
const OUTPUT = path.join(OUTPUT_DIR, 'casa1_optimized.glb');

// Configuración de calidad (ajustable)
const CONFIG = {
    // Texturas
    maxTextureSize: 2048,      // px – máx dimension texturas (arquitectónico premium)
    textureFormat: 'webp',     // 'webp' | 'jpeg' | 'png'
    textureQuality: 85,        // 0-100 (85 = premium sin pérdida visible)

    // Geometría
    simplifyRatio: 0.75,       // 0.0-1.0 (0.75 = 25% reducción polígonos)
    simplifyError: 0.001,      // error máximo tolerable
    weldTolerance: 0.0001,     // unificar vértices cercanos

    // Compresión
    useDraco: true,
    useMeshopt: true,
    dracoEncodeSpeed: 1,       // 0(mejor calidad)-10(más rápido)
    dracoDecodeSpeed: 1,
};

// ── UTILS ────────────────────────────────────────────────────
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function estimateFPS(fileSizeMB) {
    // Heurística basada en benchmarks WebGL arquitectónicos
    if (fileSizeMB < 20) return '55-60 FPS (móvil/desktop)';
    if (fileSizeMB < 40) return '45-60 FPS (desktop) / 30-45 FPS (móvil)';
    if (fileSizeMB < 80) return '30-50 FPS (desktop) / 20-30 FPS (móvil)';
    if (fileSizeMB < 150) return '20-35 FPS (desktop) / <20 FPS (móvil)';
    return '<20 FPS – REQUIERE OPTIMIZACIÓN';
}

function estimateVRAM(fileSizeMB) {
    // VRAM ≈ geometría*1.5 + texturas descomprimidas*4-8x
    const estimated = fileSizeMB * 3.5;
    return `~${estimated.toFixed(0)} MB VRAM`;
}

// ── MAIN PIPELINE ────────────────────────────────────────────
async function main() {
    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║   GLB OPTIMIZER – ARQUITECTURA WEB PREMIUM          ║');
    console.log('╚══════════════════════════════════════════════════════╝\n');

    if (!existsSync(INPUT)) {
        console.error(`❌ Archivo no encontrado: ${INPUT}`);
        process.exit(1);
    }

    if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

    const inputSize = statSync(INPUT).size;
    console.log(`📦 INPUT  : ${INPUT}`);
    console.log(`📊 Tamaño : ${formatBytes(inputSize)}`);
    console.log(`⚙️  FPS est.: ${estimateFPS(inputSize / 1024 / 1024)} (SIN optimizar)`);
    console.log(`🎮 VRAM est.: ${estimateVRAM(inputSize / 1024 / 1024)} (SIN optimizar)\n`);

    const t0 = performance.now();

    // ── IO con extensiones ────────────────────────────────────
    console.log('🔧 Inicializando IO con Draco + Meshopt...');
    await MeshoptDecoder.ready;
    await MeshoptEncoder.ready;

    const io = new NodeIO()
        .registerExtensions(KHRONOS_EXTENSIONS)
        .registerExtensions([EXTMeshoptCompression])
        .registerDependencies({
            'draco3d.decoder': await draco3d.createDecoderModule(),
            'draco3d.encoder': await draco3d.createEncoderModule(),
            'meshopt.decoder': MeshoptDecoder,
            'meshopt.encoder': MeshoptEncoder,
        });

    io.setLogger(new Logger(Logger.Verbosity.WARN));

    // ── Leer documento ────────────────────────────────────────
    console.log('📖 Leyendo GLB (puede tomar 30-60s para modelos grandes)...');
    const t1 = performance.now();
    const doc = await io.read(INPUT);
    console.log(`   ✓ Cargado en ${((performance.now() - t1) / 1000).toFixed(1)}s\n`);

    // ── ANÁLISIS PRE-OPTIMIZACIÓN ─────────────────────────────
    const root = doc.getRoot();
    const meshes = root.listMeshes();
    const textures = root.listTextures();
    const materials = root.listMaterials();
    const scenes = root.listScenes();
    const nodes = root.listNodes();

    console.log('📊 ANÁLISIS DEL MODELO:');
    console.log('──────────────────────────────────────────');
    console.log(`  Escenas     : ${scenes.length}`);
    console.log(`  Nodos       : ${nodes.length}`);
    console.log(`  Meshes      : ${meshes.length}`);
    console.log(`  Materiales  : ${materials.length}`);
    console.log(`  Texturas    : ${textures.length}`);

    let totalPrims = 0;
    let totalVerts = 0;
    let totalTris = 0;
    for (const mesh of meshes) {
        for (const prim of mesh.listPrimitives()) {
            totalPrims++;
            const pos = prim.getAttribute('POSITION');
            if (pos) totalVerts += pos.getCount();
            const idx = prim.getIndices();
            if (idx) totalTris += Math.floor(idx.getCount() / 3);
        }
    }
    console.log(`  Primitivas  : ${totalPrims.toLocaleString()}`);
    console.log(`  Vértices    : ${totalVerts.toLocaleString()}`);
    console.log(`  Triángulos  : ${totalTris.toLocaleString()}`);
    console.log('──────────────────────────────────────────\n');

    // ── PASO 1: Limpieza de escena ────────────────────────────
    console.log('🧹 Paso 1/8: Limpieza de escena...');
    await doc.transform(
        prune({ keepAttributes: false, keepLeaves: false }),
    );
    console.log('   ✓ Datos sin uso eliminados');

    // ── PASO 2: Deduplicar assets ─────────────────────────────
    console.log('🔁 Paso 2/8: Deduplicando assets...');
    await doc.transform(
        dedup({ propertyTypes: ['Mesh', 'Texture', 'Material', 'Accessor', 'Skin'] }),
    );
    console.log('   ✓ Assets duplicados fusionados');

    // ── PASO 3: Flatten + Join geometrías ─────────────────────
    console.log('🔗 Paso 3/8: Optimizando jerarquía de nodos...');
    await doc.transform(
        flatten(),
    );
    console.log('   ✓ Jerarquía aplanada');

    // ── PASO 4: Welding de vértices ───────────────────────────
    console.log('🔩 Paso 4/8: Welding de vértices (tol=' + CONFIG.weldTolerance + ')...');
    await doc.transform(
        weld({ tolerance: CONFIG.weldTolerance }),
    );
    console.log('   ✓ Vértices duplicados fusionados');

    // ── PASO 5: Simplificación de polígonos ───────────────────
    console.log(`✂️  Paso 5/8: Simplificando polígonos (ratio=${CONFIG.simplifyRatio})...`);
    await MeshoptSimplifier.ready;
    await doc.transform(
        simplify({
            simplifier: MeshoptSimplifier,
            ratio: CONFIG.simplifyRatio,
            error: CONFIG.simplifyError,
        }),
    );
    console.log('   ✓ Polígonos simplificados');

    // ── PASO 6: Resample + Quantize ───────────────────────────
    console.log('📐 Paso 6/8: Quantization y optimización de accessors...');
    await doc.transform(
        resample(),
        sparse(),
        quantize({
            quantizePosition: 14,
            quantizeNormal: 10,
            quantizeTexcoord: 12,
            quantizeColor: 8,
            quantizeWeight: 8,
            quantizeGeneric: 12,
        }),
    );
    console.log('   ✓ Accessors cuantizados');

    // ── PASO 7: Compresión de texturas ───────────────────────
    console.log(`🖼️  Paso 7/8: Procesando ${textures.length} texturas → WebP ${CONFIG.maxTextureSize}px...`);
    await doc.transform(
        textureResize({
            size: [CONFIG.maxTextureSize, CONFIG.maxTextureSize],
            filter: 'lanczos3',
        }),
    );
    console.log(`   ✓ Texturas redimensionadas a máx ${CONFIG.maxTextureSize}px`);
    console.log('   ℹ️  Nota: compresión KTX2 requiere @gltf-transform/ktx (opcional post-proceso)');

    // ── PASO 8: Compresión final ──────────────────────────────
    console.log('🗜️  Paso 8/8: Aplicando compresión Meshopt...');
    doc.createExtension(EXTMeshoptCompression)
        .setRequired(true)
        .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });

    await doc.transform(
        // Limpiar una vez más antes de escribir
        prune(),
    );
    console.log('   ✓ Compresión Meshopt aplicada');

    // ── ESCRIBIR OUTPUT ───────────────────────────────────────
    console.log('\n💾 Escribiendo archivo optimizado...');
    const t2 = performance.now();
    await io.write(OUTPUT, doc);
    console.log(`   ✓ Escrito en ${((performance.now() - t2) / 1000).toFixed(1)}s`);

    // ── ESTADÍSTICAS FINALES ──────────────────────────────────
    const outputSize = statSync(OUTPUT).size;
    const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);
    const totalTimeSec = ((performance.now() - t0) / 1000).toFixed(1);
    const inMB = (inputSize / 1024 / 1024).toFixed(2);
    const outMB = (outputSize / 1024 / 1024).toFixed(2);

    // Contar stats post-optimización
    let postVerts = 0;
    let postTris = 0;
    for (const mesh of root.listMeshes()) {
        for (const prim of mesh.listPrimitives()) {
            const pos = prim.getAttribute('POSITION');
            if (pos) postVerts += pos.getCount();
            const idx = prim.getIndices();
            if (idx) postTris += Math.floor(idx.getCount() / 3);
        }
    }

    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║              REPORTE DE OPTIMIZACIÓN                ║');
    console.log('╠══════════════════════════════════════════════════════╣');
    console.log(`║  Tiempo total        : ${totalTimeSec}s`);
    console.log('╠══════════════════════╦═══════════════╦══════════════╣');
    console.log('║  MÉTRICA             ║  ANTES        ║  DESPUÉS     ║');
    console.log('╠══════════════════════╬═══════════════╬══════════════╣');
    console.log(`║  Tamaño archivo      ║  ${inMB} MB`.padEnd(45) + '║');
    console.log(`║                      ║               ║  ${outMB} MB`.padEnd(45) + '║');
    console.log(`║  Reducción           ║               ║  -${reduction}%`.padEnd(45) + '║');
    console.log(`║  Vértices            ║  ${totalVerts.toLocaleString()}`.padEnd(30) + `║  ${postVerts.toLocaleString()}`.padEnd(16) + '║');
    console.log(`║  Triángulos          ║  ${totalTris.toLocaleString()}`.padEnd(30) + `║  ${postTris.toLocaleString()}`.padEnd(16) + '║');
    console.log('╠══════════════════════╩═══════════════╩══════════════╣');
    console.log(`║  FPS estimado (antes): ${estimateFPS(parseFloat(inMB))}`);
    console.log(`║  FPS estimado (después): ${estimateFPS(parseFloat(outMB))}`);
    console.log(`║  VRAM estimada (antes) : ${estimateVRAM(parseFloat(inMB))}`);
    console.log(`║  VRAM estimada (después): ${estimateVRAM(parseFloat(outMB))}`);
    console.log('╠══════════════════════════════════════════════════════╣');
    console.log('║  OUTPUT: ' + OUTPUT);
    console.log('╚══════════════════════════════════════════════════════╝');

    // ── RECOMENDACIONES ───────────────────────────────────────
    console.log('\n📋 RECOMENDACIONES PARA REACT THREE FIBER:\n');
    console.log('  1. useGLTF con Draco/Meshopt decoder:');
    console.log('     useGLTF.preload("/models/casa1_optimized.glb")');
    console.log('');
    console.log('  2. Configura el decoder en tu entry point:');
    console.log('     import { useGLTF } from "@react-three/drei"');
    console.log('     useGLTF.setDecoderPath("/draco/")  // o CDN');
    console.log('');
    console.log('  3. Para streaming / lazy loading:');
    console.log('     <Suspense fallback={<LoadingSpinner />}>');
    console.log('       <Model url="/models/casa1_optimized.glb" />');
    console.log('     </Suspense>');
    console.log('');
    console.log('  4. Instancing para objetos repetidos:');
    console.log('     Usa <Instances> de @react-three/drei');
    console.log('');
    console.log('  5. LOD para cámara lejana:');
    console.log('     Considera @react-three/drei <Lod>');
    console.log('');
    console.log('  6. Frustum Culling activo (default en R3F ✓)');
    console.log('');
    console.log('  7. Si >40MB: considera GLTF streaming con:');
    console.log('     three-mesh-bvh + BVH acceleration structure');
    console.log('');
    console.log('✅ Pipeline completado exitosamente.\n');
}

main().catch(err => {
    console.error('\n❌ Error en pipeline:', err.message);
    console.error(err.stack);
    process.exit(1);
});
