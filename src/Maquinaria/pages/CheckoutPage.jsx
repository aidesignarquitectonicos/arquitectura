import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Typography, Paper, Divider, TextField, Button,
    Alert, Stepper, Step, StepLabel, Chip, CircularProgress,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import Navbar from "../../Presentation/Components/Navbar/Navbar";
import { useCotizacion, calcularItem } from "../context/CotizacionContext";
import { useCheckout } from "../context/CheckoutContext";
import { generatePDF } from "../utils/pdfGenerator";

// ─── Configura tu clave pública de Stripe ─────────────────────────────────────
// Crea la variable REACT_APP_STRIPE_PUBLIC_KEY en tu .env
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || "pk_test_XXXXXXXXXXXXXXXXXXXXXXXX");

const STEPS = ["Resumen", "Datos del cliente", "Pago"];

// ─── Formulario interno de Stripe ─────────────────────────────────────────────

function StripePaymentForm({ clienteNombre, clienteEmail, onSuccess, total }) {
    const stripe = useStripe();
    const elements = useElements();
    const [paying, setPaying] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setPaying(true);
        setErrorMsg(null);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (error) {
            setErrorMsg(error.message);
            setPaying(false);
        } else if (paymentIntent?.status === "succeeded") {
            onSuccess(paymentIntent.id);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
                <PaymentElement />
            </Box>
            {errorMsg && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMsg}
                </Alert>
            )}
            <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={!stripe || paying}
                startIcon={paying ? <CircularProgress size={16} color="inherit" /> : <LockIcon />}
                sx={{ py: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 700, fontSize: 16 }}
            >
                {paying ? "Procesando pago..." : `Pagar $${total.toFixed(2)}`}
            </Button>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mt: 1.5 }}>
                <LockIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                    Pago seguro procesado por Stripe
                </Typography>
            </Box>
        </Box>
    );
}

// ─── Página principal de Checkout ─────────────────────────────────────────────

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { items, totales, clearCart } = useCotizacion();
    const { iniciarPago, confirmarOrden, processing, error } = useCheckout();

    const [step, setStep] = useState(0);
    const [clienteNombre, setClienteNombre] = useState("");
    const [clienteEmail, setClienteEmail] = useState("");
    const [clientSecret, setClientSecret] = useState(null);
    const [formError, setFormError] = useState(null);

    // Redirigir si no hay items
    useEffect(() => {
        if (items.length === 0) navigate("/maquinaria");
    }, [items, navigate]);

    const handleConfirmarDatos = async () => {
        if (!clienteNombre.trim() || !clienteEmail.trim()) {
            setFormError("Por favor completa nombre y correo electrónico.");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(clienteEmail)) {
            setFormError("Ingresa un correo electrónico válido.");
            return;
        }
        setFormError(null);
        const secret = await iniciarPago({
            items,
            ...totales,
            cliente: { nombre: clienteNombre, email: clienteEmail },
        });
        if (secret) {
            setClientSecret(secret);
            setStep(2);
        }
    };

    const handlePaymentSuccess = async (stripePaymentId) => {
        const enrichedItems = items.map((i) => ({ ...i, ...calcularItem(i) }));
        const id = await confirmarOrden({
            cliente: { nombre: clienteNombre, email: clienteEmail },
            items: enrichedItems,
            ...totales,
            metodoPago: "tarjeta",
            stripePaymentId,
        });
        clearCart();
        navigate(`/ordenes/${id}`);
    };

    const stripeOptions = clientSecret
        ? { clientSecret, appearance: { theme: "stripe" } }
        : null;

    return (
        <>
            <Navbar variant="back" title="Checkout" onBack={() => navigate("/maquinaria")} />
            <Box sx={{ pt: 10, pb: 10, px: { xs: 2, sm: 4 }, maxWidth: 760, mx: "auto" }}>
                <Stepper activeStep={step} sx={{ mb: 4 }}>
                    {STEPS.map((label) => (
                        <Step key={label}><StepLabel>{label}</StepLabel></Step>
                    ))}
                </Stepper>

                <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>

                    {/* ── Panel izquierdo — resumen ── */}
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, flex: 1 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            Resumen del pedido
                        </Typography>
                        {items.map((item) => {
                            const calc = calcularItem(item);
                            return (
                                <Box key={item.maquinaId} sx={{ mb: 1.5 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>{item.nombre}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {item.cantidad} {item.unidad}(s)
                                                {item.operador ? " · Con operador" : ""}
                                                {item.transporte ? " · Con transporte" : ""}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight={600}>
                                            ${calc.total.toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                            <Typography variant="body2">Subtotal</Typography>
                            <Typography variant="body2">${totales.subtotal.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                            <Typography variant="body2">IVA (12%)</Typography>
                            <Typography variant="body2">${totales.iva.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography fontWeight={700}>TOTAL</Typography>
                            <Typography fontWeight={700} color="primary" fontSize={18}>
                                ${totales.total.toFixed(2)}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                            <Chip label="Visa" size="small" variant="outlined" />
                            <Chip label="Mastercard" size="small" variant="outlined" />
                            <Chip label="Solo débito" size="small" variant="outlined" />
                        </Box>
                    </Paper>

                    {/* ── Panel derecho — formulario ── */}
                    <Box sx={{ flex: 1 }}>

                        {/* STEP 0 — Continuar */}
                        {step === 0 && (
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    Confirmar pedido
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mb={2}>
                                    Revisa el resumen y continúa para ingresar tus datos.
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => setStep(1)}
                                    sx={{ py: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                                >
                                    Continuar al pago
                                </Button>
                            </Paper>
                        )}

                        {/* STEP 1 — Datos del cliente */}
                        {step === 1 && (
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    Datos del cliente
                                </Typography>
                                {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
                                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <TextField
                                        label="Nombre completo *"
                                        size="small"
                                        fullWidth
                                        value={clienteNombre}
                                        onChange={(e) => setClienteNombre(e.target.value)}
                                    />
                                    <TextField
                                        label="Correo electrónico *"
                                        size="small"
                                        fullWidth
                                        type="email"
                                        value={clienteEmail}
                                        onChange={(e) => setClienteEmail(e.target.value)}
                                    />
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={handleConfirmarDatos}
                                        disabled={processing}
                                        startIcon={processing ? <CircularProgress size={16} color="inherit" /> : null}
                                        sx={{ py: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                                    >
                                        {processing ? "Iniciando pago..." : "Ir al pago"}
                                    </Button>
                                    <Button variant="text" onClick={() => setStep(0)} sx={{ textTransform: "none" }}>
                                        ← Volver al resumen
                                    </Button>
                                </Box>
                            </Paper>
                        )}

                        {/* STEP 2 — Pago con Stripe */}
                        {step === 2 && stripeOptions && (
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    Datos de pago
                                </Typography>
                                <Elements stripe={stripePromise} options={stripeOptions}>
                                    <StripePaymentForm
                                        clienteNombre={clienteNombre}
                                        clienteEmail={clienteEmail}
                                        onSuccess={handlePaymentSuccess}
                                        total={totales.total}
                                    />
                                </Elements>
                            </Paper>
                        )}
                    </Box>
                </Box>
            </Box>
        </>
    );
}
