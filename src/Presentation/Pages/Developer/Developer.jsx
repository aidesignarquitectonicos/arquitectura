import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Container,
    Box,
    Link,
    Avatar,
} from "@mui/material";
import { ArrowBack, LinkedIn, Mail, Facebook, Instagram, GitHub } from "@mui/icons-material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import logo from "../../Assets/Anth.png";

// Utilidad para convertir hex a RGB
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "0, 0, 0";
};


const Developer = () => {
    const [personalInfo] = useState({
        name: "Anthony Cordova",
        subtitle: "Ingeniero en Sistemas",
        role: "Full Stack Engineer",
        description: "Arquitecto de la infraestructura tecnológica detrás de esta plataforma. Especializado en el desarrollo de soluciones web, móviles y cloud orientadas a la gestión, visualización y almacenamiento de proyectos arquitectónicos de forma segura, escalable y eficiente.",
        technologies: [
            { label: "React", category: "Frontend" },
            { label: "Flutter", category: "Mobile" },
            { label: "Node.js", category: "Backend" },
            { label: "Firebase", category: "Cloud" },
            { label: "MySQL", category: "Database" },
            { label: "Java", category: "Backend" },
            { label: "Python", category: "AI/ML" },
            { label: "Cloud Computing", category: "Infrastructure" },
            { label: "Artificial Intelligence", category: "AI/ML" },
        ],
        metrics: {
            projects: 15,
            categories: ["Web", "Mobile", "Cloud"],
            approach: "Arquitectura Escalable"
        },
        socialLinks: {
            linkedin: {
                label: "LinkedIn",
                handle: "Anthony Córdova",
                url: "https://www.linkedin.com/in/anthony-c-a12928111",
                color: "#0A66C2",
                icon: "linkedin",
            },
            facebook: {
                label: "Facebook",
                handle: "Anthony Córdova",
                url: "https://www.facebook.com/profile.php?id=100095502885829",
                color: "#1877F2",
                icon: "facebook",
            },
            instagram: {
                label: "Instagram",
                handle: "@thony_cm_18",
                url: "https://www.instagram.com/thony_cm_18/",
                color: "#E1306C",
                icon: "instagram",
            },
            whatsapp: {
                label: "WhatsApp",
                handle: "Enviar mensaje",
                url: "https://api.whatsapp.com/qr/FNSLSZHWS3CFM1?autoload=1&app_absent=0",
                color: "#25D366",
                icon: "whatsapp",
            },
            github: {
                label: "GitHub",
                handle: "18-anth",
                url: "https://github.com/18-anth",
                color: "#000000",
                icon: "github",
            },
            email: {
                label: "Email",
                handle: "Contacto",
                url: "mailto:anthony@example.com",
                color: "#000000",
                icon: "email",
            }
        }
    });

    // Animaciones sutiles tipo Apple
    const pageAnimation = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 800 },
    });

    const contentAnimation = useSpring({
        from: { opacity: 0, transform: "translateY(8px)" },
        to: { opacity: 1, transform: "translateY(0px)" },
        delay: 200,
        config: { tension: 280, friction: 60 },
    });

    const avatarAnimation = useSpring({
        from: { opacity: 0, transform: "scale(0.95)" },
        to: { opacity: 1, transform: "scale(1)" },
        delay: 400,
        config: { tension: 260, friction: 50 },
    });

    const techAnimation = useSpring({
        from: { opacity: 0, transform: "translateY(4px)" },
        to: { opacity: 1, transform: "translateY(0px)" },
        delay: 600,
        config: { tension: 280, friction: 60 },
    });

    const handleBack = () => {
        window.location.href = "https://aidesignarquitectonicos.github.io/arquitectura/";
    };

    return (
        <animated.div style={pageAnimation}>
            {/* Header Minimalista */}
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    background: "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 100%)",
                    backdropFilter: "blur(4px)",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
                    color: "#000000",
                    zIndex: 100,
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 2,
                        px: { xs: 2, md: 4 },
                    }}
                >
                    <IconButton
                        onClick={handleBack}
                        aria-label="Regresar"
                        sx={{
                            color: "#000000",
                            "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                    >
                        <ArrowBack sx={{ fontSize: "24px" }} />
                    </IconButton>
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontWeight: 500,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "rgba(0, 0, 0, 0.5)",
                            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                        }}
                    >
                        Desarrollo e Innovación
                    </Typography>
                    <Box sx={{ width: "40px" }} /> {/* Espaciador para simetría */}
                </Toolbar>
            </AppBar>

            {/* Hero Section */}
            <Box
                sx={{
                    background: "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(250,250,250,0.5) 100%)",
                    minHeight: "calc(100vh - 64px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    py: { xs: 6, md: 10 },
                }}
            >
                {/* Gradiente de fondo muy sutil */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.02) 0%, transparent 50%)",
                        pointerEvents: "none",
                    }}
                />

                <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
                    <animated.div style={contentAnimation}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                                gap: 4,
                            }}
                        >
                            {/* Avatar */}
                            <animated.div style={avatarAnimation}>
                                <Avatar
                                    src={logo}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
                                        border: "1px solid rgba(0, 0, 0, 0.04)",
                                    }}
                                />
                            </animated.div>

                            {/* Nombre - Tipografía Destacada */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                <Typography
                                    sx={{
                                        fontSize: { xs: "32px", md: "48px" },
                                        fontWeight: 700,
                                        letterSpacing: "-0.02em",
                                        color: "#000000",
                                        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                                        lineHeight: 1.1,
                                    }}
                                >
                                    {personalInfo.name}
                                </Typography>

                                {/* Subtítulo - Roles */}
                                <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap" }}>
                                    <Typography
                                        sx={{
                                            fontSize: "14px",
                                            fontWeight: 500,
                                            color: "rgba(0, 0, 0, 0.6)",
                                            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                                            letterSpacing: "0.01em",
                                        }}
                                    >
                                        {personalInfo.subtitle}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: "14px",
                                            fontWeight: 500,
                                            color: "rgba(0, 0, 0, 0.6)",
                                            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                                            letterSpacing: "0.01em",
                                        }}
                                    >
                                        •
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: "14px",
                                            fontWeight: 500,
                                            color: "rgba(0, 0, 0, 0.6)",
                                            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                                            letterSpacing: "0.01em",
                                        }}
                                    >
                                        {personalInfo.role}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Descripción - Máximo ancho de lectura */}
                            <Typography
                                sx={{
                                    fontSize: "16px",
                                    lineHeight: 1.6,
                                    color: "rgba(0, 0, 0, 0.7)",
                                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                                    maxWidth: "560px",
                                    fontWeight: 400,
                                    letterSpacing: "0.005em",
                                }}
                            >
                                {personalInfo.description}
                            </Typography>

                            {/* Métricas Visuales */}
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                                    gap: 2,
                                    width: "100%",
                                    maxWidth: "500px",
                                    mt: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        background: "rgba(255, 255, 255, 0.5)",
                                        backdropFilter: "blur(8px)",
                                        border: "1px solid rgba(0, 0, 0, 0.05)",
                                        borderRadius: "12px",
                                        p: 3,
                                        textAlign: "center",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "28px",
                                            fontWeight: 700,
                                            color: "#000000",
                                            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                                        }}
                                    >
                                        +{personalInfo.metrics.projects}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: "12px",
                                            color: "rgba(0, 0, 0, 0.5)",
                                            mt: 0.5,
                                            fontWeight: 500,
                                            letterSpacing: "0.05em",
                                        }}
                                    >
                                        PROYECTOS
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        background: "rgba(255, 255, 255, 0.5)",
                                        backdropFilter: "blur(8px)",
                                        border: "1px solid rgba(0, 0, 0, 0.05)",
                                        borderRadius: "12px",
                                        p: 3,
                                        textAlign: "center",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "14px",
                                            fontWeight: 600,
                                            color: "#000000",
                                            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                                        }}
                                    >
                                        {personalInfo.metrics.categories.join(" • ")}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: "12px",
                                            color: "rgba(0, 0, 0, 0.5)",
                                            mt: 0.5,
                                            fontWeight: 500,
                                            letterSpacing: "0.05em",
                                        }}
                                    >
                                        {personalInfo.metrics.approach}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Tecnologías - Badges Minimalistas */}
                            <animated.div style={techAnimation}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 1.5,
                                        justifyContent: "center",
                                        mt: 3,
                                    }}
                                >
                                    {personalInfo.technologies.map((tech, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                background: "rgba(59, 130, 246, 0.06)",
                                                border: "1px solid rgba(59, 130, 246, 0.15)",
                                                borderRadius: "20px",
                                                px: 3,
                                                py: 1.25,
                                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                cursor: "default",
                                                "&:hover": {
                                                    background: "rgba(59, 130, 246, 0.12)",
                                                    borderColor: "rgba(59, 130, 246, 0.25)",
                                                    transform: "translateY(-2px)",
                                                },
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: "13px",
                                                    fontWeight: 500,
                                                    color: "rgba(0, 0, 0, 0.7)",
                                                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                                                    letterSpacing: "0.01em",
                                                }}
                                            >
                                                {tech.label}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </animated.div>

                            {/* Redes Sociales - Diseño Premium */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                    width: "100%",
                                    maxWidth: "500px",
                                    mt: 2,
                                }}
                            >
                                {/* Grid de Redes Sociales - 2 columnas */}
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(2, 1fr)",
                                        gap: 2,
                                        width: "100%",
                                    }}
                                >
                                    {[
                                        { key: "linkedin", icon: LinkedIn, data: personalInfo.socialLinks.linkedin },
                                        { key: "github", icon: GitHub, data: personalInfo.socialLinks.github },
                                        { key: "facebook", icon: Facebook, data: personalInfo.socialLinks.facebook },
                                        { key: "instagram", icon: Instagram, data: personalInfo.socialLinks.instagram },
                                        { key: "whatsapp", icon: WhatsAppIcon, data: personalInfo.socialLinks.whatsapp },
                                        { key: "email", icon: Mail, data: personalInfo.socialLinks.email },
                                    ].map(({ key, icon: Icon, data }) => (
                                        <IconButton
                                            key={key}
                                            component={Link}
                                            href={data.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={data.label}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 1,
                                                background: "rgba(255, 255, 255, 0.4)",
                                                backdropFilter: "blur(8px)",
                                                border: `1px solid rgba(0, 0, 0, 0.05)`,
                                                borderRadius: "12px",
                                                p: 2,
                                                height: "100%",
                                                minHeight: "120px",
                                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                "&:hover": {
                                                    background: "rgba(255, 255, 255, 0.6)",
                                                    borderColor: `rgba(${data.color.includes("#") ? hexToRgb(data.color) : data.color}, 0.3)`,
                                                    transform: "translateY(-4px)",
                                                    boxShadow: `0 12px 24px rgba(${data.color.includes("#") ? hexToRgb(data.color) : data.color}, 0.1)`,
                                                },
                                            }}
                                        >
                                            <Icon
                                                sx={{
                                                    fontSize: "28px",
                                                    color: data.color,
                                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                }}
                                            />
                                            <Typography
                                                sx={{
                                                    fontSize: "12px",
                                                    fontWeight: 600,
                                                    color: "#000000",
                                                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {data.label}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: "11px",
                                                    color: "rgba(0, 0, 0, 0.5)",
                                                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                                                    textAlign: "center",
                                                    textOverflow: "ellipsis",
                                                    overflow: "hidden",
                                                    whiteSpace: "nowrap",
                                                    maxWidth: "100%",
                                                }}
                                            >
                                                {data.handle}
                                            </Typography>
                                        </IconButton>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </animated.div>
                </Container>
            </Box>
        </animated.div>
    );
};

export default Developer;
