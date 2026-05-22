/**
 * GLB OPTIMIZER PRO – ARQUITECTURA WEB PREMIUM
 * Ejecutar: NODE_OPTIONS="--max-old-space-size=16384" node scripts/optimize-glb.mjs
 */
import { NodeIO, Logger } from '@gltf-transform/core';
import {
    dedup, flatten, weld, resample, prune, sparse,
    textureCompress, simplify, meshopt, reorder, join, palette,
} from '@gltf-transform/functions';
import {
    ALL_EXTENSIONS, EXTMeshoptCompression, EXTTextureWebP,
} from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import { existsSync, mkdirSync, statSync } from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

const INPUT = '/Volumes/SATECHI/GitHub/arquitectura/src/Presentation/Assets/model3d/casa1.glb';
const OUTPUT_DIR = '/Volumes/SATECHI/GitHub/arquitectura/src/Presentation/Assets/model3d/optimized';
const OUTPUT = path.join(OUTPUT_DIR, 'casa1_optimized.glb');

const fmt = (b) => { const s = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(b) / Math.log(1024)); return `${(b / 1024 ** i).toFixed(2)} ${s[i]}`; };
const fpsBenchmark = (mb) => mb < 20 ? '55-60 FPS ✅' : mb < 40 ? '45-60 FPS desktop/30-45 móvil ✅' : mb < 80 ? '30-50 FPS desktop/20-30 móvil ⚠️' : '<30 FPS ❌';
const vramEst = (mb) => `~${(mb * 3.5).toFixed(0)} MB`;

async function main() {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  GLB OPTIMIZER PRO – ARQUITECTURA PREMIUM   ║');
    console.log('╚══════════════════════════════════════════════╝\n');

    if (!existsSync(INPUT)) { console.error(`❌ No encontrado: ${INPUT}`); process.exit(1); }
    if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

    const inputSize = statSync(INPUT).size;
    const inMB = inputSize / 1024 / 1024;
    console.log(`📦 INPUT  : ${INPUT}`);
    console.log(`📊 Tamaño : ${fmt(inputSize)}`);
    console.log(`⚡ FPS SIN opt: ${fpsBenchmark(inMB)}`);
    console.log(`🎮 VRAM SIN opt: ${vramEst(inMB)}\n`);

    const t0 = performance.now();
    console.log('🔧 Inicializando Draco + Meshopt decoders...');
    await MeshoptDecoder.ready;
    await MeshoptEncoder.ready;
    await MeshoptSimplifier.ready;

    const io = new NodeIO()
        .registerExtensions(ALL_EXTENSIONS)
        .registerDependencies({
            'draco3d.decoder': await draco3d.createDecoderModule(),
            'draco3d.encoder': await draco3d.createEncoderModule(),
            'meshopt.decoder': MeshoptDecoder,
            'meshopt.encoder': MeshoptEncoder,
        });
    io.setLogger(new Logger(Logger.Verbosity.WARN));

    console.log('📖 Leyendo GLB (1-3 min para archivos grandes)...');
    let t1 = performance.now();
    const doc = await io.read(INPUT);
    console.log(`   ✓ Cargado en ${((performance.now() - t1) / 1000).toFixed(1)}s\n`);

    const root = doc.getRoot();
    const preMeshes = root.listMeshes().length;
    const preTex = root.listTextures().length;
    const preMat = root.listMaterials().length;
    let preVerts = 0, preTris = 0;
    for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
        const pos = p.getAttribute('POSITION'); if (pos) preVerts += pos.getCount();
        const idx = p.getIndices(); if (idx) preTris += Math.floor(idx.getCount() / 3);
    }

    console.log(`📊 PRE:  Meshes=${preMeshes}  Vértices=${preVerts.toLocaleString()}  Tri=${preTris.toLocaleString()}  Tex=${preTex}  Mat=${preMat}\n`);

    console.log('🧹 [1/8] Prune – eliminar datos sin uso...');
    await doc.transform(prune({ keepAttributes: false, keepLeaves: false }));
    console.log('   ✓');

    // NOTA: dedup de materiales OMITIDO — SketchUp generó 346K materiales (O(n²) inmanejable)
    // Usamos palette para colapsar materiales de color sólido en una texture atlas
    console.log('🎨 [2/8] Palette – colapsar materiales de color a texture atlas...');
    await doc.transform(palette({ blockSize: 4, min: 2 }));
    console.log('   ✓');

    console.log('🔁 [3/8] Dedup – fusionar texturas/meshes duplicados (sin materiales)...');
    await doc.transform(dedup({ propertyTypes: ['Mesh', 'Texture', 'Accessor'] }));
    console.log('   ✓');

    console.log('🔗 [4/8] Flatten + Join – reducir draw calls...');
    await doc.transform(flatten(), join());
    console.log('   ✓');

    console.log('🔩 [5/8] Weld – fusionar vértices duplicados...');
    await doc.transform(weld({ tolerance: 0.0001 }));
    console.log('   ✓');

    console.log('✂️  [6/8] Simplify – reducir polígonos 25%...');
    await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio: 0.75, error: 0.001 }));
    console.log('   ✓');

    console.log('⚡ [7/8] Reorder + Meshopt compression...');
    await doc.transform(
        reorder({ encoder: MeshoptEncoder }),
        meshopt({ encoder: MeshoptEncoder }),
        resample(),
        sparse(),
        prune(),
    );
    console.log('   ✓');

    console.log('🖼️  [8/8] Texturas → WebP 2048px (calidad 85)...');
    doc.createExtension(EXTTextureWebP);
    await doc.transform(
        textureCompress({ targetFormat: 'webp', resize: [2048, 2048], quality: 85 })
    );
    console.log('   ✓\n');

    console.log('💾 Escribiendo archivo...');
    t1 = performance.now();
    await io.write(OUTPUT, doc);
    console.log(`   ✓ Escrito en ${((performance.now() - t1) / 1000).toFixed(1)}s`);

    const outputSize = statSync(OUTPUT).size;
    const outMB = outputSize / 1024 / 1024;
    const redPct = ((1 - outputSize / inputSize) * 100).toFixed(1);
    let postVerts = 0, postTris = 0;
    for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
        const pos = p.getAttribute('POSITION'); if (pos) postVerts += pos.getCount();
        const idx = p.getIndices(); if (idx) postTris += Math.floor(idx.getCount() / 3);
    }

    console.log(`\n╔═══════════════════════════════════════════════════════════╗`);
    console.log(`║                  REPORTE DE OPTIMIZACIÓN                 ║`);
    console.log(`╠═══════════════════╦══════════════════╦════════════════════╣`);
    console.log(`║ MÉTRICA           ║ ANTES            ║ DESPUÉS            ║`);
    console.log(`╠═══════════════════╬══════════════════╬════════════════════╣`);
    console.log(`║ Tamaño            ║ ${fmt(inputSize).padEnd(16)}║ ${fmt(outputSize).padEnd(18)}║`);
    console.log(`║ Reducción         ║                  ║ -${redPct}%`.padEnd(62) + '║');
    console.log(`║ Vértices          ║ ${preVerts.toLocaleString().padEnd(16)}║ ${postVerts.toLocaleString().padEnd(18)}║`);
    console.log(`║ Triángulos        ║ ${preTris.toLocaleString().padEnd(16)}║ ${postTris.toLocaleString().padEnd(18)}║`);
    console.log(`║ Texturas          ║ ${preTex.toString().padEnd(16)}║ ${root.listTextures().length.toString().padEnd(18)}║`);
    console.log(`╠═══════════════════╩══════════════════╩════════════════════╣`);
    console.log(`║ ⚡ FPS ANTES  : ${fpsBenchmark(inMB)}`);
    console.log(`║ ⚡ FPS DESPUÉS: ${fpsBenchmark(outMB)}`);
    console.log(`║ 🎮 VRAM ANTES  : ${vramEst(inMB)} → DESPUÉS: ${vramEst(outMB)}`);
    console.log(`║ ⏱️  Tiempo total: ${((performance.now() - t0) / 1000).toFixed(0)}s`);
    console.log(`╠═══════════════════════════════════════════════════════════╣`);
    console.log(`║ 📁 ${OUTPUT}`);
    console.log(`╚═══════════════════════════════════════════════════════════╝`);

    console.log(`
  INTEGRACIÓN REACT THREE FIBER:
  ───────────────────────────────
  // 1. Preload en componente padre
  useGLTF.preload("/models/casa1_optimized.glb");
  
  // 2. Componente
  function Casa() {
    const { scene } = useGLTF("/models/casa1_optimized.glb");
    return <primitive object={scene} />;
  }
  
  // 3. Canvas optimizado
  <Canvas
    gl={{ antialias: true, powerPreference: "high-performance" }}
    dpr={[1, 2]}
    performance={{ min: 0.5 }}
  >
    <Suspense fallback={<LoadingScreen />}>
      <Casa />
      <Preload all />
    </Suspense>
  </Canvas>
  `);

    console.log('✅ Pipeline completado.\n');
}

main().catch(err => {
    console.error('\n❌ Error:', err.message);
    if (err.message.includes('heap')) console.error('💡 Usa: NODE_OPTIONS="--max-old-space-size=16384"');
    process.exit(1);
});
