import React, { useState } from "react";
import {
    AppBar,
    Avatar,
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
import { MenuOutlined, ArrowBack } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import QRCode from "qrcode.react";
import logo from "../../Assets/icono.png";
import theme from "../../Themes/theme";

/**
 * Navbar centralizado para todo el proyecto.
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

    // Si el padre controla openQr, usa esos; si no, maneja estado interno
    const qrOpen = openQr !== undefined ? openQr : internalOpenQr;
    const setQrOpen = setOpenQr !== undefined ? setOpenQr : setInternalOpenQr;

    const menuAnimation = useSpring({
        transform: internalMenuOpen ? "translateX(0%)" : "translateX(-100%)",
    });

    const appBarSx = {
        background: "#f4f4f4",
        color: "#000",
        zIndex: (t) => t.zIndex.drawer + 1,
        borderBottomLeftRadius: "20px",
        borderBottomRightRadius: "20px",
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
                        <Box sx={{ width: 48 }} /> // espacio para alinear el título al centro
                    )}
                </Toolbar>
            </AppBar>
        );
    }

    // variant="home"
    return (
        <>
            <AppBar position="fixed" sx={appBarSx}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Typography variant="h6">AIDesign</Typography>

                    {/* Botón menú: avatar si está autenticado, hamburguesa si no */}
                    {isAuthenticated ? (
                        <IconButton onClick={() => setInternalMenuOpen(!internalMenuOpen)}>
                            <Avatar src={logo} />
                        </IconButton>
                    ) : (
                        <IconButton onClick={() => setInternalMenuOpen(!internalMenuOpen)}>
                            <MenuOutlined />
                        </IconButton>
                    )}

                    {/* Menú deslizante */}
                    <animated.div
                        style={{
                            ...menuAnimation,
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 5, 0.8)",
                            zIndex: theme.zIndex.drawer + 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            padding: "20px",
                        }}
                        onClick={() => setInternalMenuOpen(false)}
                    >
                        <nav
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                width: "auto",
                                borderRadius: "20px",
                            }}
                        >
                            <ul
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    padding: "20px",
                                    listStyleType: "none",
                                    margin: 0,
                                }}
                            >
                                {/* Email de usuario (solo menú completo con auth) */}
                                {!simpleMenu && isAuthenticated && (
                                    <li style={{ borderBottom: "1px solid #8887875E", padding: "20px" }}>
                                        <span>{user?.email || "Usuario"}</span>
                                    </li>
                                )}

                                {/* Inicio (solo menú simple) */}
                                {simpleMenu && (
                                    <li style={{ borderBottom: "1px solid #8887875E", padding: "20px" }}>
                                        <NavLink to="/" onClick={() => setInternalMenuOpen(false)}>
                                            Inicio
                                        </NavLink>
                                    </li>
                                )}

                                <li style={{ borderBottom: "1px solid #8887875E", padding: "20px" }}>
                                    <NavLink to="/Gallery" onClick={() => setInternalMenuOpen(false)}>
                                        Proyectos
                                    </NavLink>
                                </li>

                                <li style={{ borderBottom: "1px solid #8887875E", padding: "20px" }}>
                                    <NavLink to="/About" onClick={() => setInternalMenuOpen(false)}>
                                        Acerca de
                                    </NavLink>
                                </li>

                                {/* Links adicionales (solo menú completo) */}
                                {!simpleMenu && (
                                    <>
                                        <li style={{ borderBottom: "1px solid #8887875E", padding: "20px" }}>
                                            <NavLink to="/PrivacyPolicy" onClick={() => setInternalMenuOpen(false)}>
                                                Política de Privacidad
                                            </NavLink>
                                        </li>
                                        <li style={{ borderBottom: "1px solid #8887875E", padding: "20px" }}>
                                            <NavLink to="/TermsOfService" onClick={() => setInternalMenuOpen(false)}>
                                                Términos de Servicio
                                            </NavLink>
                                        </li>
                                    </>
                                )}

                                {/* QR */}
                                <li style={{ borderBottom: "1px solid #8887875E", padding: "20px" }}>
                                    <NavLink
                                        onClick={() => {
                                            setQrOpen(true);
                                            setInternalMenuOpen(false);
                                        }}
                                    >
                                        Codigo Qr
                                    </NavLink>
                                </li>

                                {/* Developer (solo menú completo) */}
                                {!simpleMenu && (
                                    <li style={{ borderBottom: "1px solid #8887875E", padding: "20px" }}>
                                        <NavLink to="/Developer" onClick={() => setInternalMenuOpen(false)}>
                                            Desarrollador de Software
                                        </NavLink>
                                    </li>
                                )}

                                {/* Upload (solo menú completo, solo auth) */}
                                {!simpleMenu && isAuthenticated && (
                                    <li style={{ borderBottom: "1px solid #8887875E", padding: "20px" }}>
                                        <NavLink to="/Upload" onClick={() => setInternalMenuOpen(false)}>
                                            Upload
                                        </NavLink>
                                    </li>
                                )}

                                {/* SignIn / SignOut (solo menú completo) */}
                                {!simpleMenu && (
                                    isAuthenticated ? (
                                        <li style={{ borderBottom: "1px solid #8887875E", padding: "20px" }}>
                                            <span
                                                onClick={() => {
                                                    setInternalMenuOpen(false);
                                                    onSignOut && onSignOut();
                                                }}
                                                style={{ cursor: "pointer" }}
                                            >
                                                Cerrar sesión
                                            </span>
                                        </li>
                                    ) : (
                                        <li style={{ borderBottom: "1px solid #8887875E", padding: "20px" }}>
                                            <NavLink to="/SignIn" onClick={() => setInternalMenuOpen(false)}>
                                                Sign In
                                            </NavLink>
                                        </li>
                                    )
                                )}
                            </ul>
                        </nav>
                    </animated.div>

                    {/* QR Dialog (solo menú completo) */}
                    {!simpleMenu && (
                        <Dialog
                            open={qrOpen}
                            onClose={() => setQrOpen(false)}
                            aria-labelledby="qr-code-dialog-title"
                            fullWidth={true}
                            maxWidth="sm"
                            sx={{
                                background: "rgba(255,255,255, 0.5)",
                                borderBottomLeftRadius: "20px",
                                borderBottomRightRadius: "20px",
                            }}
                        >
                            <Box
                                sx={{
                                    background: "#f4f4f4",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    paddingBottom: "20px",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: "100%",
                                        background: "transparent",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <IconButton onClick={() => setQrOpen(false)} sx={{ background: "transparent" }}>
                                        <CloseIcon sx={{ color: "#000" }} />
                                    </IconButton>
                                </Box>
                                <Card>
                                    <CardActionArea>
                                        <CardContent>
                                            <QRCode
                                                value={url}
                                                size={Math.min(window.innerWidth * 0.6, 156)}
                                                level={"L"}
                                            />
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Box>
                        </Dialog>
                    )}
                </Toolbar>
            </AppBar>

            {/* QR simple (menú simple: PrivacyPolicy, TermsOfService) */}
            {simpleMenu && qrOpen && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 5, 0.8)",
                        zIndex: theme.zIndex.drawer + 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            background: "#f4f4f4",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            paddingBottom: "20px",
                            borderRadius: "20px",
                        }}
                    >
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                            <IconButton onClick={() => setQrOpen(false)}>
                                <CloseIcon sx={{ color: "#000" }} />
                            </IconButton>
                        </Box>
                        <Card>
                            <CardActionArea>
                                <CardContent>
                                    <QRCode
                                        value={url}
                                        size={Math.min(window.innerWidth * 0.6, 156)}
                                        level={"L"}
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
