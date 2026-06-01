#!/usr/bin/env bash

# =============================================================================
# Script de Verificación - Video Indexing Fixes
# =============================================================================
# Verifica que todas las soluciones estén correctamente implementadas
# 
# Uso: bash verify-video-fixes.sh
# =============================================================================

set -e

echo "════════════════════════════════════════════════════════════════════════"
echo "🎬 Video Indexing Fixes - Verificación Completa"
echo "════════════════════════════════════════════════════════════════════════"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_DIR="."
BUILD_DIR="build"

# Función para verificar y reportar
check() {
    local description=$1
    local condition=$2
    
    if eval "$condition"; then
        echo -e "${GREEN}✅${NC} $description"
        return 0
    else
        echo -e "${RED}❌${NC} $description"
        return 1
    fi
}

# Variable para rastrear fallos
CHECKS_FAILED=0

echo ""
echo -e "${BLUE}1️⃣  Verificando archivos creados/modificados${NC}"
echo "──────────────────────────────────────────────────────────────────────"

check "VideoMetaTags.jsx existe" "[ -f '$PROJECT_DIR/src/Presentation/Components/VideoMetaTags.jsx' ]" || ((CHECKS_FAILED++))
check "Script de sitemap existe" "[ -f '$PROJECT_DIR/scripts/generate-video-sitemap.js' ]" || ((CHECKS_FAILED++))
check "Documentación exists" "[ -f '$PROJECT_DIR/VIDEO_INDEXING_FIXES.md' ]" || ((CHECKS_FAILED++))

echo ""
echo -e "${BLUE}2️⃣  Verificando contenido de archivos${NC}"
echo "──────────────────────────────────────────────────────────────────────"

check "VideoMetaTags contiene VideoObject" \
    "grep -q 'updateVideoSchema' '$PROJECT_DIR/src/Presentation/Components/VideoMetaTags.jsx'" || ((CHECKS_FAILED++))

check "ProjectDetails importa VideoMetaTags" \
    "grep -q 'VideoMetaTags' '$PROJECT_DIR/src/Presentation/Pages/ProjectDetails/ProjectDetails.jsx'" || ((CHECKS_FAILED++))

check "index.html contiene og:video tags" \
    "grep -q 'og:video' '$PROJECT_DIR/public/index.html'" || ((CHECKS_FAILED++))

check "index.html contiene VideoObject schema" \
    "grep -q '\"@type\": \"VideoObject\"' '$PROJECT_DIR/public/index.html'" || ((CHECKS_FAILED++))

check "robots.txt referencia video sitemaps" \
    "grep -q 'sitemap-videos.xml' '$PROJECT_DIR/public/robots.txt'" || ((CHECKS_FAILED++))

check "package.json build script genera sitemap" \
    "grep -q 'generate-video-sitemap' '$PROJECT_DIR/package.json'" || ((CHECKS_FAILED++))

echo ""
echo -e "${BLUE}3️⃣  Verificando script de generación${NC}"
echo "──────────────────────────────────────────────────────────────────────"

check "Script de sitemap es ejecutable" \
    "[ -x '$PROJECT_DIR/scripts/generate-video-sitemap.js' ] || file '$PROJECT_DIR/scripts/generate-video-sitemap.js' | grep -q 'JavaScript'" || ((CHECKS_FAILED++))

check "Script contiene XML schema" \
    "grep -q 'video:video' '$PROJECT_DIR/scripts/generate-video-sitemap.js'" || ((CHECKS_FAILED++))

check "Script maneja Firebase" \
    "grep -q 'firebaseio.com' '$PROJECT_DIR/scripts/generate-video-sitemap.js'" || ((CHECKS_FAILED++))

echo ""
echo -e "${BLUE}4️⃣  Verificando build y deployments previos${NC}"
echo "──────────────────────────────────────────────────────────────────────"

if [ -d "$BUILD_DIR" ]; then
    check "Carpeta build existe" "true" || ((CHECKS_FAILED++))
    check "sitemap-videos.xml en build" "[ -f '$BUILD_DIR/sitemap-videos.xml' ]" || ((CHECKS_FAILED++))
    check "robots.txt en build" "[ -f '$BUILD_DIR/robots.txt' ]" || ((CHECKS_FAILED++))
else
    echo -e "${YELLOW}⏭️  Build directory no existe (normal, ejecuta 'npm run build' primero)${NC}"
fi

echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo "📋 PRÓXIMOS PASOS"
echo "════════════════════════════════════════════════════════════════════════"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Todas las verificaciones pasaron!${NC}"
    echo ""
    echo "Ahora ejecuta:"
    echo "  1. npm run build          # Genera sitemap-videos.xml"
    echo "  2. npm run deploy         # Sube cambios a GitHub Pages"
    echo ""
    echo "Espera 2 minutos, luego verifica:"
    echo "  curl https://aidesignarquitectonicos.github.io/arquitectura/sitemap-videos.xml"
    echo ""
    echo "Finalmente, en Google Search Console:"
    echo "  1. Ve a Sitemaps"
    echo "  2. Añade: sitemap-videos.xml"
    echo ""
else
    echo -e "${RED}❌ Se encontraron $CHECKS_FAILED problemas${NC}"
    echo ""
    echo "Revisa los archivos indicados arriba."
    echo "Todos deberían mostrar ✅ antes de compilar."
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════════════════"
