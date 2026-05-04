import React, { useState } from "react";
import { ThemeProvider } from "@emotion/react";
import { Box, CssBaseline, Container } from "@mui/material";
import { useSpring, animated } from "react-spring";
import theme from "../../Themes/theme";
import Footer from "../Footer/Footer";
import Navbar from "../../Components/Navbar/Navbar";
import "./PrivacyPolicy.css";

function PrivacyPolicy() {
    const url = "https://aidesignarquitectonicos.github.io/arquitectura/";


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <animated.div>
                <Navbar
                    variant="home"
                    simpleMenu={true}
                    url={url}
                />

                {/* QR Dialog */}

                {/* MainContent */}
                <Box sx={{ marginTop: "80px", minHeight: "calc(100vh - 80px)" }}>
                    <Container maxWidth="lg">
                        <div className="privacy-policy-content">
                            <div className="privacy-header">
                                <h1>📄 POLÍTICA DE PRIVACIDAD</h1>
                                <h2>AI Design</h2>
                            </div>

                            <section className="privacy-section">
                                <h3>1. Introducción</h3>
                                <p>
                                    AI Design se compromete a proteger la privacidad y los datos personales de sus usuarios.
                                    Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos la información cuando utilizas nuestro sitio web y servicios relacionados con arquitectura, diseño de interiores, planos estructurales, construcción y alquiler de maquinaria.
                                </p>
                            </section>

                            <section className="privacy-section">
                                <h3>2. Información que recopilamos</h3>

                                <div className="subsection">
                                    <h4>2.1 Datos personales</h4>
                                    <p>Podemos recopilar la siguiente información:</p>
                                    <ul>
                                        <li>Nombre completo</li>
                                        <li>Correo electrónico</li>
                                        <li>Número de teléfono</li>
                                        <li>Ubicación aproximada</li>
                                        <li>Información proporcionada en formularios de contacto o cotización</li>
                                    </ul>
                                </div>

                                <div className="subsection">
                                    <h4>2.2 Datos técnicos</h4>
                                    <ul>
                                        <li>Dirección IP</li>
                                        <li>Tipo de navegador</li>
                                        <li>Dispositivo utilizado</li>
                                        <li>Sistema operativo</li>
                                        <li>Datos de navegación dentro del sitio</li>
                                    </ul>
                                </div>

                                <div className="subsection">
                                    <h4>2.3 Datos proporcionados voluntariamente</h4>
                                    <ul>
                                        <li>Información enviada para cotizaciones</li>
                                        <li>Archivos, planos o imágenes compartidas por el usuario</li>
                                        <li>Mensajes o consultas</li>
                                    </ul>
                                </div>
                            </section>

                            <section className="privacy-section">
                                <h3>3. Finalidad del tratamiento de datos</h3>
                                <p>Utilizamos la información recopilada para:</p>
                                <ul>
                                    <li>Brindar servicios de arquitectura y diseño</li>
                                    <li>Elaborar presupuestos y cotizaciones</li>
                                    <li>Contactar a los usuarios</li>
                                    <li>Mejorar la experiencia del sitio web</li>
                                    <li>Analizar el uso de la plataforma</li>
                                    <li>Cumplir obligaciones legales</li>
                                </ul>
                            </section>

                            <section className="privacy-section">
                                <h3>4. Uso de tecnologías (cookies y similares)</h3>
                                <p>Utilizamos cookies y tecnologías similares para:</p>
                                <ul>
                                    <li>Recordar preferencias del usuario</li>
                                    <li>Analizar tráfico web</li>
                                    <li>Mejorar el rendimiento del sitio</li>
                                </ul>
                                <p className="note">El usuario puede configurar su navegador para rechazar cookies.</p>
                            </section>

                            <section className="privacy-section">
                                <h3>5. Compartición de datos</h3>
                                <p>No vendemos ni alquilamos datos personales.
                                    Podemos compartir información únicamente en los siguientes casos:</p>
                                <ul>
                                    <li>Proveedores de servicios tecnológicos (ej: hosting, analítica)</li>
                                    <li>Cumplimiento de obligaciones legales</li>
                                    <li>Protección de derechos y seguridad</li>
                                </ul>
                            </section>

                            <section className="privacy-section">
                                <h3>6. Seguridad de la información</h3>
                                <p>Implementamos medidas de seguridad técnicas y organizativas para proteger los datos, incluyendo:</p>
                                <ul>
                                    <li>Cifrado de información</li>
                                    <li>Accesos restringidos</li>
                                    <li>Protección contra accesos no autorizados</li>
                                </ul>
                                <p className="note">Sin embargo, ningún sistema es completamente seguro.</p>
                            </section>

                            <section className="privacy-section">
                                <h3>7. Derechos del usuario</h3>
                                <p>El usuario tiene derecho a:</p>
                                <ul>
                                    <li>Acceder a sus datos personales</li>
                                    <li>Rectificar información incorrecta</li>
                                    <li>Solicitar la eliminación de sus datos</li>
                                    <li>Oponerse al tratamiento de sus datos</li>
                                    <li>Solicitar la portabilidad de datos</li>
                                </ul>
                                <p className="note">Para ejercer estos derechos puede contactarnos.</p>
                            </section>

                            <section className="privacy-section">
                                <h3>8. Retención de datos</h3>
                                <p>Los datos serán almacenados únicamente durante el tiempo necesario para cumplir con las finalidades descritas o según lo requerido por la ley.</p>
                            </section>

                            <section className="privacy-section">
                                <h3>9. Propiedad intelectual</h3>
                                <p>Todo el contenido de la plataforma, incluyendo pero no limitado a:</p>
                                <ul>
                                    <li>Diseños</li>
                                    <li>Planos estructurales</li>
                                    <li>Modelos 3D</li>
                                    <li>Renderizados</li>
                                    <li>Textos, imágenes y logotipos</li>
                                </ul>
                                <p>es propiedad de AI Design y está protegido por leyes de propiedad intelectual.</p>

                                <div className="subsection">
                                    <h4>Restricciones:</h4>
                                    <ul>
                                        <li>No se permite copiar, reproducir o distribuir sin autorización</li>
                                        <li>Los diseños entregados al cliente son para uso específico acordado</li>
                                        <li>El uso indebido puede generar acciones legales</li>
                                    </ul>
                                </div>
                            </section>

                            <section className="privacy-section">
                                <h3>10. Uso de información del cliente</h3>
                                <p>Los materiales proporcionados por el cliente (planos, ideas, referencias):</p>
                                <ul>
                                    <li>Se utilizan exclusivamente para el desarrollo del proyecto</li>
                                    <li>No serán compartidos sin autorización</li>
                                    <li>Siguen siendo propiedad del cliente, salvo acuerdos contractuales</li>
                                </ul>
                            </section>

                            <section className="privacy-section">
                                <h3>11. Servicios de terceros</h3>
                                <p>Nuestro sitio puede integrar servicios de terceros (ej: Firebase, herramientas analíticas), los cuales pueden recopilar información conforme a sus propias políticas de privacidad.</p>
                            </section>

                            <section className="privacy-section">
                                <h3>12. Cambios en la política</h3>
                                <p>Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento.
                                    Los cambios serán publicados en esta misma sección.</p>
                            </section>

                            <section className="privacy-section contact-section">
                                <h3>13. Contacto</h3>
                                <p>Para consultas sobre esta política o el tratamiento de datos:</p>
                                <div className="contact-info">
                                    <p><strong>AI Design</strong></p>
                                    <p>Correo electrónico: <a href="mailto:arquitecturaaidesign@gmail.com">arquitecturaaidesign@gmail.com</a></p>
                                    <p>Ubicación: Ecuador</p>
                                </div>
                            </section>

                            <div className="privacy-footer">
                                <p>✅ Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
                            </div>
                        </div>
                    </Container>
                </Box>

                <Footer />
            </animated.div>
        </ThemeProvider>
    );
}

export default PrivacyPolicy;
