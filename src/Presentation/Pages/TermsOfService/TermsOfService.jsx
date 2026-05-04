import React, { useState } from "react";
import { ThemeProvider } from "@emotion/react";
import { Box, CssBaseline, Container } from "@mui/material";
import { useSpring, animated } from "react-spring";
import theme from "../../Themes/theme";
import Footer from "../Footer/Footer";
import Navbar from "../../Components/Navbar/Navbar";
import "./TermsOfService.css";

function TermsOfService() {
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
                        <div className="terms-content">
                            <div className="terms-header">
                                <h1>📋 TÉRMINOS DE SERVICIO</h1>
                                <h2>AI Design</h2>
                            </div>

                            <section className="terms-section">
                                <h3>1. Aceptación de los Términos</h3>
                                <p>
                                    Al acceder y utilizar este sitio web (www.aidesign.com) y sus servicios, usted acepta estar legalmente vinculado por estos Términos de Servicio. Si no está de acuerdo con alguna parte de estos términos, le solicitamos que no utilice nuestro sitio web.
                                </p>
                            </section>

                            <section className="terms-section">
                                <h3>2. Descripción del Servicio</h3>
                                <p>AI Design proporciona servicios en línea incluyendo:</p>
                                <ul>
                                    <li>Consultoría en arquitectura y diseño de interiores</li>
                                    <li>Generación de planos estructurales</li>
                                    <li>Modelos y renderizados 3D</li>
                                    <li>Cotizaciones y presupuestos</li>
                                    <li>Información sobre construcción y alquiler de maquinaria</li>
                                </ul>
                            </section>

                            <section className="terms-section">
                                <h3>3. Uso Permitido</h3>
                                <p>El usuario se compromete a utilizar este sitio web únicamente para propósitos legales y de manera que no vulnere los derechos de terceros.</p>
                                <p>Está explícitamente prohibido:</p>
                                <ul>
                                    <li>Usar el sitio con fines ilícitos o no autorizados</li>
                                    <li>Reproducir, copiar o distribuir contenido sin autorización</li>
                                    <li>Acceder de manera no autorizada a sistemas o datos</li>
                                    <li>Transmitir virus, malware o código malicioso</li>
                                    <li>Realizar scraping o descarga masiva de contenido</li>
                                    <li>Interferir con el funcionamiento del sitio web</li>
                                </ul>
                            </section>

                            <section className="terms-section">
                                <h3>4. Cuenta de Usuario</h3>
                                <p>Si crea una cuenta en nuestro sitio web, usted es responsable de:</p>
                                <ul>
                                    <li>Mantener la confidencialidad de su contraseña</li>
                                    <li>Proporcionar información exacta y veraz</li>
                                    <li>Todas las actividades que ocurran bajo su cuenta</li>
                                    <li>Notificarnos inmediatamente de cualquier acceso no autorizado</li>
                                </ul>
                            </section>

                            <section className="terms-section">
                                <h3>5. Propiedad Intelectual</h3>
                                <p>Todo el contenido del sitio web, incluyendo:</p>
                                <ul>
                                    <li>Diseños arquitectónicos originales</li>
                                    <li>Planos y especificaciones técnicas</li>
                                    <li>Modelos 3D y renderizados</li>
                                    <li>Textos, imágenes y logotipos</li>
                                    <li>Software y código fuente</li>
                                </ul>
                                <p>está protegido por leyes de propiedad intelectual. No está permitido copiar, modificar, distribuir o usar este contenido sin autorización expresa.</p>
                            </section>

                            <section className="terms-section">
                                <h3>6. Servicios de Diseño</h3>
                                <p>Los trabajos encargados a AI Design deben cumplir con los siguientes términos:</p>
                                <ul>
                                    <li>El cliente proporciona información y referencias necesarias completas</li>
                                    <li>Los cambios solicitados después de la aceptación del presupuesto pueden incurrir en costos adicionales</li>
                                    <li>El pago debe realizarse según el acuerdo de contrato</li>
                                    <li>Los diseños finales son propiedad de AI Design hasta que se complete el pago</li>
                                    <li>El uso de los diseños se limita al proyecto acordado</li>
                                </ul>
                            </section>

                            <section className="terms-section">
                                <h3>7. Confidencialidad</h3>
                                <p>Ambas partes se comprometen a mantener la confidencialidad de la información compartida durante el proyecto, excepto cuando sea requerido por ley o autoridades competentes.</p>
                            </section>

                            <section className="terms-section">
                                <h3>8. Limitación de Responsabilidad</h3>
                                <p>AI Design no será responsable por:</p>
                                <ul>
                                    <li>Daños directos, indirectos o consecuentes del uso del sitio</li>
                                    <li>Pérdida de datos o información</li>
                                    <li>Interrupciones del servicio</li>
                                    <li>Errores en la información proporcionada</li>
                                </ul>
                                <p>El usuario utiliza el sitio bajo su propio riesgo.</p>
                            </section>

                            <section className="terms-section">
                                <h3>9. Exención de Garantías</h3>
                                <p>El sitio web se proporciona "tal cual" sin garantías de ningún tipo, ya sean explícitas o implícitas. AI Design no garantiza que el servicio sea ininterrumpido, oportuno, seguro o libre de errores.</p>
                            </section>

                            <section className="terms-section">
                                <h3>10. Indemnización</h3>
                                <p>El usuario acepta indemnizar y eximir de responsabilidad a AI Design, sus propietarios, empleados y agentes de cualquier reclamo, demanda, pérdida o gasto relacionado con su uso del sitio o violación de estos términos.</p>
                            </section>

                            <section className="terms-section">
                                <h3>11. Enlaces Externos</h3>
                                <p>Nuestro sitio web puede contener enlaces a sitios web de terceros. No somos responsables del contenido, precisión o prácticas de privacidad de sitios web externos. El acceso a sitios de terceros está bajo su propio riesgo.</p>
                            </section>

                            <section className="terms-section">
                                <h3>12. Terminación de Acceso</h3>
                                <p>AI Design se reserva el derecho de suspender o terminar el acceso a su cuenta en cualquier momento si detecta:</p>
                                <ul>
                                    <li>Violación de estos términos</li>
                                    <li>Conducta fraudulenta</li>
                                    <li>Amenaza a la seguridad del sitio</li>
                                    <li>Incumplimiento de pagos</li>
                                </ul>
                            </section>

                            <section className="terms-section">
                                <h3>13. Ley Aplicable</h3>
                                <p>Estos Términos de Servicio se rigen por las leyes de la República del Ecuador. Cualquier disputa será resuelta en los tribunales competentes de Ecuador.</p>
                            </section>

                            <section className="terms-section">
                                <h3>14. Cambios en los Términos</h3>
                                <p>AI Design se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos inmediatamente tras su publicación. Su uso continuado del sitio implica aceptación de los términos modificados.</p>
                            </section>

                            <section className="terms-section">
                                <h3>15. Integración Completa</h3>
                                <p>Estos Términos de Servicio constituyen el acuerdo completo entre usted y AI Design respecto al uso del sitio web y reemplazan todos los acuerdos previos.</p>
                            </section>

                            <section className="terms-section contact-section">
                                <h3>16. Contacto</h3>
                                <p>Para preguntas sobre estos términos o para reportar abuso:</p>
                                <div className="contact-info">
                                    <p><strong>AI Design</strong></p>
                                    <p>Correo electrónico: <a href="mailto:arquitecturaaidesign@gmail.com">arquitecturaaidesign@gmail.com</a></p>
                                    <p>Ubicación: Ecuador</p>
                                </div>
                            </section>

                            <div className="terms-footer">
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

export default TermsOfService;
