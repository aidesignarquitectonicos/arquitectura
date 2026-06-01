/**
 * EJEMPLO DE USO: Navbar Premium Rediseñado
 * Copia este código en tu componente principal (App.jsx o donde uses Navbar)
 */

import React, { useState } from 'react';
import Navbar from './Presentation/Components/Navbar/Navbar';

// ============================================
// EJEMPLO 1: Navbar en página Home
// ============================================
function HomePage() {
    const [qrOpen, setQrOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const handleSignOut = () => {
        setIsAuthenticated(false);
        setUser(null);
        // Tu lógica de logout aquí
    };

    return (
        <>
            <Navbar
                variant="home"
                isAuthenticated={isAuthenticated}
                user={user}
                onSignOut={handleSignOut}
                openQr={qrOpen}
                setOpenQr={setQrOpen}
                url="https://aidesignarquitectonicos.github.io/arquitectura/"
                simpleMenu={false}
            />
            {/* Tu contenido aquí */}
        </>
    );
}

// ============================================
// EJEMPLO 2: Navbar en página de detalles
// ============================================
function DetailPage() {
    const handleBack = () => {
        window.history.back();
    };

    return (
        <>
            <Navbar
                variant="back"
                title="Detalles del Proyecto"
                onBack={handleBack}
            />
            {/* Tu contenido aquí */}
        </>
    );
}

// ============================================
// EJEMPLO 3: Navbar con menú simple (sin auth)
// ============================================
function TermsPage() {
    const [qrOpen, setQrOpen] = useState(false);

    return (
        <>
            <Navbar
                variant="home"
                simpleMenu={true}
                openQr={qrOpen}
                setOpenQr={setQrOpen}
                url="https://aidesignarquitectonicos.github.io/arquitectura/"
            />
            {/* Tu contenido aquí */}
        </>
    );
}

// ============================================
// EJEMPLO 4: Navbar con usuario autenticado
// ============================================
function DashboardPage() {
    const [qrOpen, setQrOpen] = useState(false);
    const [user, setUser] = useState({
        email: 'usuario@ejemplo.com',
        name: 'Juan Pérez'
    });

    const handleSignOut = () => {
        // Llamar a tu servicio de autenticación
        localStorage.removeItem('authToken');
        setUser(null);
        window.location.href = '/SignIn';
    };

    return (
        <>
            <Navbar
                variant="home"
                isAuthenticated={true}
                user={user}
                onSignOut={handleSignOut}
                url="https://aidesignarquitectonicos.github.io/arquitectura/"
                simpleMenu={false}
            />
            {/* Tu contenido del dashboard aquí */}
        </>
    );
}

// ============================================
// EJEMPLO 5: Integración en App.jsx
// ============================================
function App() {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        user: null
    });

    const handleSignOut = () => {
        setAuthState({
            isAuthenticated: false,
            user: null
        });
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <Navbar
                                variant="home"
                                isAuthenticated={authState.isAuthenticated}
                                user={authState.user}
                                onSignOut={handleSignOut}
                                simpleMenu={false}
                            />
                            <Home />
                        </>
                    }
                />
                <Route
                    path="/Gallery"
                    element={
                        <>
                            <Navbar
                                variant="back"
                                title="Galería de Proyectos"
                                onBack={() => navigate('/')}
                            />
                            <Gallery />
                        </>
                    }
                />
                <Route path="/maquinaria" element={<Maquinaria />} />
                {/* ... más rutas ... */}
            </Routes>
        </Router>
    );
}

// ============================================
// PROPS DISPONIBLES
// ============================================

/**
 * VARIANTE: "home"
 * 
 * Props:
 * - variant: "home" | "back" (default: "home")
 * - isAuthenticated: boolean (default: undefined)
 * - user: { email: string, name?: string } (default: undefined)
 * - onSignOut: () => void (function)
 * - openQr: boolean (default: undefined)
 * - setOpenQr: (open: boolean) => void (function)
 * - url: string (default: "https://aidesignarquitectonicos.github.io/arquitectura/")
 * - simpleMenu: boolean (default: false)
 * 
 * Ejemplo:
 * <Navbar
 *     variant="home"
 *     isAuthenticated={true}
 *     user={{ email: 'user@example.com' }}
 *     onSignOut={handleSignOut}
 *     url="https://midominio.com"
 *     simpleMenu={false}
 * />
 */

/**
 * VARIANTE: "back"
 * 
 * Props:
 * - variant: "back"
 * - title: string (required)
 * - onBack: () => void (required)
 * - rightAction: React.ReactNode (optional)
 * 
 * Ejemplo:
 * <Navbar
 *     variant="back"
 *     title="Detalles"
 *     onBack={() => navigate(-1)}
 *     rightAction={<IconButton>...</IconButton>}
 * />
 */

// ============================================
// NOTAS IMPORTANTES
// ============================================

/**
 * 1. ESTILO GLASSMORPHISM
 *    - Automático en el drawer
 *    - Usa blur(20px) y overlay oscuro
 *    - Compatible con navegadores modernos
 * 
 * 2. ANIMACIONES
 *    - Entrada/salida del drawer: 300ms
 *    - Hover effects en elementos: 250ms
 *    - Easing: cubic-bezier(0.4, 0, 0.2, 1)
 * 
 * 3. RESPONSIVE
 *    - Mobile: Drawer 100% de ancho
 *    - Tablet/Desktop: Máximo 400px
 *    - Scrollbar personalizado
 * 
 * 4. ICONOS
 *    - De Material-UI (@mui/icons-material)
 *    - Cada sección tiene iconos descriptivos
 *    - Cambios de opacidad en hover
 * 
 * 5. NAVEGACIÓN
 *    - Mantiene todas las rutas existentes
 *    - NavLink para navegación interna
 *    - Cierre automático del menú al navegar
 * 
 * 6. AUTENTICACIÓN
 *    - Muestra email del usuario en drawer
 *    - Botón de cerrar sesión al pie
 *    - Opciones de admin solo para usuarios autenticados
 *    - Opción de iniciar sesión para no autenticados
 */

export { HomePage, DetailPage, TermsPage, DashboardPage, App };
