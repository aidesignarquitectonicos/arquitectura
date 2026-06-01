import React, { useState } from "react";
import {
    AppBar,
    Box,
    Card,
    CardActionArea,
    CardContent,
    Dialog,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";
import { useSpring, animated } from "react-spring";
import { NavLink } from "react-router-dom";
import {
    MenuOutlined,
    ArrowBack,
    Close,
    Image,
    Home,
    Construction,
    Info,
    Lock,
    Article,
    QrCode2,
    Upload,
    Settings,
    History,
    Code,
    Logout,
    Login,
} from "@mui/icons-material";
import QRCode from "qrcode.react";

// Estilos globales para el menú premium
const menuStyles = `
  .navbar-drawer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1200;
    transition: opacity 0.3s ease;
  }

  .navbar-drawer-overlay.active {
    opacity: 1;
  }

  .navbar-drawer-overlay.inactive {
    opacity: 0;
    pointer-events: none;
  }

  .navbar-menu-section {
    margin-bottom: 2.5rem;
  }

  .navbar-menu-section-title {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 1rem;
    padding: 0 1.25rem;
  }

  .navbar-menu-item {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 0.875rem 1.25rem;
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 0.75rem;
    font-size: 0.95rem;
    font-weight: 500;
    border: 1px solid transparent;
  }

  .navbar-menu-item:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: #fff;
    transform: translateX(4px);
  }

  .navbar-menu-item:active {
    background: rgba(255, 255, 255, 0.15);
  }

  .navbar-menu-item svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    opacity: 0.8;
    transition: opacity 0.25s ease;
  }

  .navbar-menu-item:hover svg {
    opacity: 1;
  }

  .navbar-menu-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
    margin: 1.5rem 0;
  }

  .navbar-user-section {
    padding: 1.25rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .navbar-user-email {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
    word-break: break-all;
  }

  @media (max-width: 768px) {
    .navbar-menu-container {
      width: 100%;
    }
  }
`;

// Inyectar estilos
if (typeof document !== "undefined") {
    const styleElement = document.createElement("style");
    styleElement.textContent = menuStyles;
    document.head.appendChild(styleElement);
}


/**
 * Navbar centralizado para todo el proyecto con diseño premium glassmorphism.
 *
 * variant="home"
 *   Muestra "AIDesign" + botón de menú con navegación completa.
 *   Props opcionales:
 *     - isAuthenticated {bool}
 *     - user {object}
 *     - onSignOut {function}
 *     - openQr {bool}
 *     - setOpenQr {function}
 *     - url {string}
 *     - simpleMenu {bool} - si true, muestra solo Inicio/Proyectos/Acerca de/QR (sin auth)
 *
 * variant="back"
 *   Muestra flecha de regreso + título + acción derecha opcional.
 *   Props:
 *     - title {string}
 *     - onBack {function}
 *     - rightAction {node}
 */
function Navbar({
    variant = "home",
    // home props
    isAuthenticated,
    user,
    onSignOut,
    openQr,
    setOpenQr,
    url = "https://aidesignarquitectonicos.github.io/arquitectura/",
    simpleMenu = false,
    // back props
    title,
    onBack,
    rightAction,
}) {
    const [internalMenuOpen, setInternalMenuOpen] = useState(false);
    const [internalOpenQr, setInternalOpenQr] = useState(false);

    const qrOpen = openQr !== undefined ? openQr : internalOpenQr;
    const setQrOpen = setOpenQr !== undefined ? setOpenQr : setInternalOpenQr;

    const [scrolled, setScrolled] = useState(false);

    React.useEffect(() => {
        if (variant !== "home") return;
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [variant]);

    // Animación del drawer desde la derecha
    const drawerAnimation = useSpring({
        transform: internalMenuOpen ? "translateX(0%)" : "translateX(100%)",
        config: { tension: 300, friction: 30 },
    });

    const overlayAnimation = useSpring({
        opacity: internalMenuOpen ? 1 : 0,
        pointerEvents: internalMenuOpen ? "auto" : "none",
        config: { tension: 300, friction: 30 },
    });

    const appBarSx = variant === "home" && !scrolled
        ? {
            background: "transparent",
            color: "#fff",
            boxShadow: "none",
            zIndex: (t) => t.zIndex.drawer + 1,
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
            transition: "background 0.3s, color 0.3s",
        }
        : {
            background: "#f4f4f4",
            color: "#000",
            zIndex: (t) => t.zIndex.drawer + 1,
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
            transition: "background 0.3s, color 0.3s",
        };

    if (variant === "back") {
        return (
            <AppBar position="fixed" sx={appBarSx}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <IconButton onClick={onBack} aria-label="Regresar" edge="start">
                        <ArrowBack sx={{ color: "black" }} fontSize="32px" />
                    </IconButton>
                    <Typography
                        sx={{
                            fontFamily: "'Poppins', sans-serif",
                            color: "#000",
                            fontWeight: "bold",
                            fontSize: "1.3rem",
                            flexGrow: 1,
                            textAlign: "center",
                        }}
                    >
                        {title}
                    </Typography>
                    {rightAction ? (
                        rightAction
                    ) : (
                        <Box sx={{ width: 48 }} />
                    )}
                </Toolbar>
            </AppBar>
        );
    }

    // Función para renderizar un elemento de menú
    const MenuItem = ({
        icon: Icon,
        label,
        to,
        onClick,
        isSignOut = false,
    }) => {
        const content = (
            <Box
                as={to ? "div" : "span"}
                className="navbar-menu-item"
                component={to ? "a" : "span"}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.875rem",
                    padding: "0.875rem 1.25rem",
                    color: "rgba(255, 255, 255, 0.9)",
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    borderRadius: "0.75rem",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    border: "1px solid transparent",
                    "&:hover": {
                        background: "rgba(255, 255, 255, 0.1)",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        color: "#fff",
                        transform: "translateX(4px)",
                    },
                    "&:active": {
                        background: "rgba(255, 255, 255, 0.15)",
                    },
                }}
            >
                <Icon
                    sx={{
                        width: "1.25rem",
                        height: "1.25rem",
                        flexShrink: 0,
                        opacity: 0.8,
                        transition: "opacity 0.25s ease",
                    }}
                />
                <span>{label}</span>
            </Box>
        );

        if (to) {
            return (
                <NavLink
                    to={to}
                    onClick={() => {
                        setInternalMenuOpen(false);
                        onClick?.();
                    }}
                    style={{ textDecoration: "none" }}
                >
                    {content}
                </NavLink>
            );
        }

        return (
            <span
                onClick={() => {
                    setInternalMenuOpen(false);
                    if (isSignOut) {
                        onSignOut?.();
                    }
                    onClick?.();
                }}
                style={{ textDecoration: "none" }}
            >
                {content}
            </span>
        );
    };

    // Sección del menú
    const MenuSection = ({ title, items }) => (
        <Box className="navbar-menu-section">
            {title && (
                <Typography
                    className="navbar-menu-section-title"
                    sx={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(255, 255, 255, 0.4)",
                        marginBottom: "1rem",
                        padding: "0 1.25rem",
                    }}
                >
                    {title}
                </Typography>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {items.map((item, idx) => (
                    <MenuItem key={idx} {...item} />
                ))}
            </Box>
        </Box>
    );

    // variant="home"
    return (
        <>
            <AppBar position="fixed" sx={appBarSx}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Typography
                        variant="h6"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            lineHeight: 1,
                            color: variant === "home" && !scrolled && !simpleMenu ? "#fff" : "#000",
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: "bold",
                        }}
                    >
                        <span style={{ fontWeight: "bold" }}>AID</span>esign
                    </Typography>

                    <IconButton
                        onClick={() => setInternalMenuOpen(!internalMenuOpen)}
                        sx={{
                            color: variant === "home" && !scrolled && !simpleMenu ? "#fff" : "#000",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.1)",
                            },
                        }}
                    >
                        <MenuOutlined />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Overlay oscuro */}
            <animated.div
                style={{
                    ...overlayAnimation,
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    zIndex: 1199,
                    backdropFilter: "blur(4px)",
                }}
                onClick={() => setInternalMenuOpen(false)}
            />

            {/* Drawer premium desde la derecha */}
            <animated.div
                style={{
                    ...drawerAnimation,
                    position: "fixed",
                    top: 0,
                    right: 0,
                    width: "min(100%, 400px)",
                    height: "100vh",
                    zIndex: 1300,
                    overflowY: "auto",
                    overscrollBehavior: "contain",
                    WebkitOverflowScrolling: "touch",
                }}
            >
                <Box
                    sx={{
                        background: "rgba(15, 15, 15, 0.85)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "24px",
                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        padding: "1.5rem 0",
                    }}
                >
                    {/* Header del drawer */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingX: "1.5rem",
                            marginBottom: "1.5rem",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                            paddingBottom: "1.5rem",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "1.25rem",
                                fontWeight: 700,
                                color: "#fff",
                                fontFamily: "'Poppins', sans-serif",
                            }}
                        >
                            <span style={{ fontWeight: "bold" }}>AID</span>esign
                        </Typography>
                        <IconButton
                            onClick={() => setInternalMenuOpen(false)}
                            sx={{
                                color: "rgba(255, 255, 255, 0.7)",
                                transition: "all 0.25s ease",
                                "&:hover": {
                                    color: "#fff",
                                    background: "rgba(255, 255, 255, 0.1)",
                                },
                            }}
                        >
                            <Close />
                        </IconButton>
                    </Box>

                    {/* Sección del usuario */}
                    {!simpleMenu && isAuthenticated && (
                        <Box
                            sx={{
                                padding: "1.25rem",
                                marginBottom: "1.5rem",
                                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.85rem",
                                    color: "rgba(255, 255, 255, 0.6)",
                                    wordBreak: "break-all",
                                    fontWeight: 500,
                                }}
                            >
                                {user?.email || "Usuario"}
                            </Typography>
                        </Box>
                    )}

                    {/* Contenido scrollable */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            paddingX: "0.5rem",
                            paddingBottom: "1rem",
                            "&::-webkit-scrollbar": {
                                width: "6px",
                            },
                            "&::-webkit-scrollbar-track": {
                                background: "transparent",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                background: "rgba(255, 255, 255, 0.1)",
                                borderRadius: "3px",
                                "&:hover": {
                                    background: "rgba(255, 255, 255, 0.2)",
                                },
                            },
                        }}
                    >
                        {/* SECCIÓN EXPLORAR */}
                        <MenuSection
                            title="Explorar"
                            items={[
                                ...(simpleMenu
                                    ? [
                                        {
                                            icon: Home,
                                            label: "Inicio",
                                            to: "/",
                                        },
                                    ]
                                    : []),
                                {
                                    icon: Image,
                                    label: "Proyectos",
                                    to: "/Gallery",
                                },
                                {
                                    icon: Construction,
                                    label: "Alquiler de Maquinaria",
                                    to: "/maquinaria",
                                },
                                {
                                    icon: Info,
                                    label: "Acerca de",
                                    to: "/About",
                                },
                                {
                                    icon: Code,
                                    label: "Desarrollador",
                                    to: "/Developer",
                                },
                            ]}
                        />

                        {/* SECCIÓN HERRAMIENTAS */}
                        <MenuSection
                            title="Herramientas"
                            items={[
                                {
                                    icon: QrCode2,
                                    label: "Código QR",
                                    onClick: () => setQrOpen(true),
                                },
                                ...(isAuthenticated && !simpleMenu
                                    ? [
                                        {
                                            icon: Upload,
                                            label: "Upload",
                                            to: "/Upload",
                                        },
                                    ]
                                    : []),
                            ]}
                        />

                        {/* SECCIÓN ADMINISTRACIÓN (solo si autenticado) */}
                        {!simpleMenu && isAuthenticated && (
                            <MenuSection
                                title="Administración"
                                items={[
                                    {
                                        icon: Settings,
                                        label: "Admin Maquinaria",
                                        to: "/admin/maquinaria",
                                    },
                                    {
                                        icon: History,
                                        label: "Historial de Órdenes",
                                        to: "/ordenes",
                                    },
                                ]}
                            />
                        )}

                        {/* SECCIÓN LEGAL (solo menú completo) */}
                        {!simpleMenu && (
                            <MenuSection
                                title="Legal"
                                items={[
                                    {
                                        icon: Lock,
                                        label: "Política de Privacidad",
                                        to: "/PrivacyPolicy",
                                    },
                                    {
                                        icon: Article,
                                        label: "Términos de Servicio",
                                        to: "/TermsOfService",
                                    },
                                ]}
                            />
                        )}
                    </Box>

                    {/* Footer del drawer - Autenticación */}
                    {!simpleMenu && (
                        <Box
                            sx={{
                                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                                padding: "1rem 0.5rem",
                            }}
                        >
                            {isAuthenticated ? (
                                <MenuItem
                                    icon={Logout}
                                    label="Cerrar sesión"
                                    isSignOut={true}
                                />
                            ) : (
                                <MenuItem
                                    icon={Login}
                                    label="Iniciar sesión"
                                    to="/SignIn"
                                />
                            )}
                        </Box>
                    )}
                </Box>
            </animated.div>

            {/* QR Dialog - Menú completo */}
            {!simpleMenu && (
                <Dialog
                    open={qrOpen}
                    onClose={() => setQrOpen(false)}
                    PaperProps={{
                        sx: {
                            background: "rgba(15, 15, 15, 0.95)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            borderRadius: "24px",
                            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
                        },
                    }}
                    fullWidth={true}
                    maxWidth="sm"
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "2rem",
                        }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "flex-end",
                                marginBottom: "1rem",
                            }}
                        >
                            <IconButton
                                onClick={() => setQrOpen(false)}
                                sx={{
                                    color: "rgba(255, 255, 255, 0.7)",
                                    transition: "all 0.25s ease",
                                    "&:hover": {
                                        color: "#fff",
                                        background: "rgba(255, 255, 255, 0.1)",
                                    },
                                }}
                            >
                                <Close />
                            </IconButton>
                        </Box>
                        <Typography
                            sx={{
                                color: "rgba(255, 255, 255, 0.9)",
                                marginBottom: "1.5rem",
                                fontSize: "1rem",
                                fontWeight: 500,
                            }}
                        >
                            Escanea el código QR
                        </Typography>
                        <Card
                            sx={{
                                background: "rgba(255, 255, 255, 0.95)",
                                borderRadius: "16px",
                                padding: "1rem",
                            }}
                        >
                            <CardActionArea>
                                <CardContent>
                                    <QRCode
                                        value={url}
                                        size={Math.min(window.innerWidth * 0.6, 200)}
                                        level={"L"}
                                        includeMargin={true}
                                    />
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Box>
                </Dialog>
            )}

            {/* QR Modal - Menú simple */}
            {simpleMenu && qrOpen && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1400,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(4px)",
                    }}
                    onClick={() => setQrOpen(false)}
                >
                    <Box
                        sx={{
                            background: "rgba(15, 15, 15, 0.95)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "2rem",
                            borderRadius: "24px",
                            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "flex-end",
                                marginBottom: "1rem",
                            }}
                        >
                            <IconButton
                                onClick={() => setQrOpen(false)}
                                sx={{
                                    color: "rgba(255, 255, 255, 0.7)",
                                    transition: "all 0.25s ease",
                                    "&:hover": {
                                        color: "#fff",
                                        background: "rgba(255, 255, 255, 0.1)",
                                    },
                                }}
                            >
                                <Close />
                            </IconButton>
                        </Box>
                        <Typography
                            sx={{
                                color: "rgba(255, 255, 255, 0.9)",
                                marginBottom: "1.5rem",
                                fontSize: "1rem",
                                fontWeight: 500,
                            }}
                        >
                            Escanea el código QR
                        </Typography>
                        <Card
                            sx={{
                                background: "rgba(255, 255, 255, 0.95)",
                                borderRadius: "16px",
                                padding: "1rem",
                            }}
                        >
                            <CardActionArea>
                                <CardContent>
                                    <QRCode
                                        value={url}
                                        size={Math.min(window.innerWidth * 0.6, 200)}
                                        level={"L"}
                                        includeMargin={true}
                                    />
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Box>
                </Box>
            )}
        </>
    );
}
export default Navbar;