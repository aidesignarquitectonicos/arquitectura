import React, { createContext, useContext, useState, useCallback } from "react";
import { saveOrden } from "../model/OrdenModel";

const CheckoutContext = createContext(null);

export function CheckoutProvider({ children }) {
    const [orden, setOrden] = useState(null);           // orden confirmada post-pago
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Persiste la orden en Firebase y actualiza el estado local.
     * Llama a la Cloud Function /crearPaymentIntent para obtener el clientSecret.
     */
    const iniciarPago = useCallback(async ({ items, subtotal, iva, total, cliente }) => {
        setProcessing(true);
        setError(null);
        try {
            // Llamar a la Cloud Function para crear el PaymentIntent
            const fnUrl = process.env.REACT_APP_FUNCTIONS_URL;
            const res = await fetch(`${fnUrl}/crearPaymentIntent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: Math.round(total * 100), currency: "usd" }),
            });
            if (!res.ok) throw new Error("No se pudo iniciar el pago.");
            const { clientSecret } = await res.json();
            return clientSecret;
        } catch (e) {
            setError(e.message);
            return null;
        } finally {
            setProcessing(false);
        }
    }, []);

    const confirmarOrden = useCallback(async (datosOrden) => {
        const id = await saveOrden(datosOrden);
        setOrden({ id, ...datosOrden });
        return id;
    }, []);

    const limpiarOrden = useCallback(() => setOrden(null), []);

    return (
        <CheckoutContext.Provider value={{ orden, processing, error, iniciarPago, confirmarOrden, limpiarOrden }}>
            {children}
        </CheckoutContext.Provider>
    );
}

export function useCheckout() {
    const ctx = useContext(CheckoutContext);
    if (!ctx) throw new Error("useCheckout debe usarse dentro de CheckoutProvider");
    return ctx;
}
