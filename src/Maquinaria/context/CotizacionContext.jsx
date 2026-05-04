import React, { createContext, useContext, useReducer, useCallback } from "react";

const IVA = 0.12;

const CotizacionContext = createContext(null);

const initialState = { items: [] };

function reducer(state, action) {
    switch (action.type) {
        case "ADD_ITEM": {
            const existe = state.items.find((i) => i.maquinaId === action.payload.maquinaId);
            if (existe) {
                return {
                    items: state.items.map((i) =>
                        i.maquinaId === action.payload.maquinaId ? { ...i, ...action.payload } : i
                    ),
                };
            }
            return { items: [...state.items, action.payload] };
        }
        case "REMOVE_ITEM":
            return { items: state.items.filter((i) => i.maquinaId !== action.payload) };
        case "CLEAR":
            return initialState;
        default:
            return state;
    }
}

/**
 * Calcula el costo de un ítem.
 * @param {{precio:number, cantidad:number, unidad:'hora'|'dia'|'semana', operador:bool, transporte:bool}} item
 */
export function calcularItem(item) {
    const { precio = 0, cantidad = 1, unidad = "hora", operador = false, transporte = false } = item;
    const multiplicador = unidad === "hora" ? 1 : unidad === "dia" ? 8 : 40;
    const base = precio * multiplicador * cantidad;
    const extras = (operador ? precio * 0.3 * multiplicador * cantidad : 0) + (transporte ? 50 : 0);
    const subtotal = base + extras;
    const iva = subtotal * IVA;
    return { base, extras, subtotal, iva, total: subtotal + iva };
}

export function calcularTotales(items) {
    const subtotal = items.reduce((acc, i) => acc + calcularItem(i).subtotal, 0);
    const iva = subtotal * IVA;
    return { subtotal, iva, total: subtotal + iva };
}

export function CotizacionProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const addItem = useCallback((item) => dispatch({ type: "ADD_ITEM", payload: item }), []);
    const removeItem = useCallback((maquinaId) => dispatch({ type: "REMOVE_ITEM", payload: maquinaId }), []);
    const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

    const totales = calcularTotales(state.items);

    return (
        <CotizacionContext.Provider value={{ items: state.items, addItem, removeItem, clearCart, totales }}>
            {children}
        </CotizacionContext.Provider>
    );
}

export function useCotizacion() {
    const ctx = useContext(CotizacionContext);
    if (!ctx) throw new Error("useCotizacion debe usarse dentro de CotizacionProvider");
    return ctx;
}
