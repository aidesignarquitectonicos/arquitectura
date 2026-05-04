const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

// ─── Variables de entorno (definir con: firebase functions:config:set) ─────────
// stripe.secret_key, sendgrid.api_key, app.admin_email, app.fcm_topic

// ─── Proxy para imágenes de Google Drive ──────────────────────────────────────
exports.driveImageProxy = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        const axios = require("axios");
        const fileId = req.query.id;
        if (!fileId) return res.status(400).send("Missing id");
        const url = `https://drive.google.com/uc?export=view&id=${fileId}`;
        const response = await axios.get(url, { responseType: "stream" });
        res.setHeader("Content-Type", response.headers["content-type"]);
        response.data.pipe(res);
    });
});

// ─── Proxy para videos de Google Drive ────────────────────────────────────────
exports.driveVideoProxy = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        const axios = require("axios");
        const fileId = req.query.id;
        if (!fileId) return res.status(400).send("Missing id");
        const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
        const response = await axios.get(url, { responseType: "stream" });
        res.setHeader("Content-Type", response.headers["content-type"] || "video/mp4");
        response.data.pipe(res);
    });
});

// ─── Crear PaymentIntent de Stripe ────────────────────────────────────────────
exports.crearPaymentIntent = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

        const stripeSecretKey = functions.config().stripe?.secret_key;
        if (!stripeSecretKey) {
            return res.status(500).json({ error: "Stripe secret key no configurada." });
        }

        const Stripe = require("stripe");
        const stripe = Stripe(stripeSecretKey);

        const { amount, currency = "usd" } = req.body;
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: "Monto inválido." });
        }

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount),
                currency,
                automatic_payment_methods: { enabled: true },
            });
            return res.json({ clientSecret: paymentIntent.client_secret });
        } catch (err) {
            console.error("Stripe error:", err.message);
            return res.status(500).json({ error: "Error al crear el PaymentIntent." });
        }
    });
});

// ─── Enviar correo + notificación FCM al confirmar una orden ──────────────────
exports.onOrdenCreada = functions.database
    .ref("/ordenes/{ordenId}")
    .onCreate(async (snapshot, context) => {
        const orden = snapshot.val();
        const { ordenId } = context.params;

        const adminEmail = functions.config().app?.admin_email;
        const sgApiKey   = functions.config().sendgrid?.api_key;
        const fcmTopic   = functions.config().app?.fcm_topic || "maquinaria_admin";

        // ── 1. Enviar correos con SendGrid ───────────────────────────────────
        if (sgApiKey && adminEmail) {
            try {
                const sgMail = require("@sendgrid/mail");
                sgMail.setApiKey(sgApiKey);

                const itemsHtml = (orden.items || [])
                    .map((i) =>
                        `<tr>
                            <td>${i.nombre}</td>
                            <td>${i.cantidad} ${i.unidad}</td>
                            <td>$${Number(i.total ?? 0).toFixed(2)}</td>
                        </tr>`
                    )
                    .join("");

                const bodyHtml = `
                    <h2>✅ Confirmación de pago — AIDesign Maquinaria</h2>
                    <p><strong>Orden:</strong> ${ordenId}</p>
                    <p><strong>Cliente:</strong> ${orden.cliente?.nombre}</p>
                    <p><strong>Fecha:</strong> ${new Date(orden.fecha).toLocaleString("es-EC")}</p>
                    <table border="1" cellpadding="6" cellspacing="0">
                        <thead><tr><th>Máquina</th><th>Cantidad</th><th>Total</th></tr></thead>
                        <tbody>${itemsHtml}</tbody>
                    </table>
                    <p><strong>Subtotal:</strong> $${Number(orden.subtotal).toFixed(2)}</p>
                    <p><strong>IVA (12%):</strong> $${Number(orden.iva).toFixed(2)}</p>
                    <h3>TOTAL PAGADO: $${Number(orden.total).toFixed(2)}</h3>
                `;

                // Correo al cliente
                if (orden.cliente?.email) {
                    await sgMail.send({
                        to: orden.cliente.email,
                        from: adminEmail,
                        subject: `✅ Confirmación de tu orden #${ordenId} — AIDesign`,
                        html: bodyHtml,
                    });
                }

                // Correo al administrador
                await sgMail.send({
                    to: adminEmail,
                    from: adminEmail,
                    subject: `🔔 Nueva orden #${ordenId} — ${orden.cliente?.nombre}`,
                    html: bodyHtml,
                });
            } catch (mailErr) {
                console.error("SendGrid error:", mailErr.message);
            }
        }

        // ── 2. Enviar notificación push FCM al topic de admin ────────────────
        try {
            const message = {
                topic: fcmTopic,
                notification: {
                    title: "🔔 Nueva orden confirmada",
                    body: `${orden.cliente?.nombre} — $${Number(orden.total).toFixed(2)}`,
                },
                data: {
                    ordenId,
                    tipo: "nueva_orden",
                },
            };
            await admin.messaging().send(message);
        } catch (fcmErr) {
            console.error("FCM error:", fcmErr.message);
        }

        console.log(`onOrdenCreada procesada: ${ordenId}`);
        return null;
    });
