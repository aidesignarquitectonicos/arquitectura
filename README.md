# AIDesign — Plataforma de Registro y Almacenamiento Audiovisual de Proyectos Arquitectónicos

## Descripción General

Plataforma web desarrollada para **AIDesign Arquitectónicos** que centraliza el registro, organización y almacenamiento audiovisual de proyectos arquitectónicos mediante la integración de **Google Drive** y **Firebase**. El sistema centraliza imágenes, videos, documentos técnicos y avances de obra en un entorno seguro, accesible y escalable, facilitando la gestión digital de cada proyecto arquitectónico desde cualquier dispositivo.

**URL de producción:** [https://aidesignarquitectonicos.github.io/arquitectura/](https://aidesignarquitectonicos.github.io/arquitectura/)

**Periodo de desarrollo:** Junio 2024 – Octubre 2024

---

## Problema que Resuelve

Centraliza el almacenamiento y gestión de imágenes, videos y documentación de proyectos arquitectónicos, evitando la pérdida de archivos y facilitando el acceso remoto y organizado para equipos de trabajo y clientes.

---

## Stack Tecnológico

- **React** (Create React App) con enrutamiento `HashRouter`
- **Firebase** — Auth, Realtime Database, Storage, Analytics
- **Google Drive API v3** (OAuth2 / Google Identity Services) — almacenamiento multimedia masivo
- **Material UI (MUI)** — componentes de interfaz
- **Framer Motion / React Spring** — animaciones
- **Firebase Cloud Functions** — lógica serverless

---

## Arquitectura y Flujo de Datos

### Estructura de datos en Firebase Realtime DB

```bash
Projects/
  └── {uuid}/
        ├── name, description, roles, date...
        ├── images[]  → URLs CDN de Google Drive
        └── videos[]  → URLs CDN de Google Drive
```

### Flujo principal

1. **Lectura:** `HomeModel.js` carga proyectos desde `localStorage` (caché) o Firebase. Los datos incluyen URLs de archivos almacenados en Google Drive.
2. **Escritura (Upload):** El usuario autenticado crea un proyecto → se genera un UUID → se crea carpeta en Google Drive → imágenes y videos se suben vía Drive API v3 con OAuth2 → las URLs públicas se guardan en Firebase Realtime DB.
3. **Autenticación:** Firebase Auth con `PrivateRoute` que bloquea `/Upload` y `/Developer` a usuarios no autenticados.

### Integración Google Drive (`googleDriveService.js`)

- Carga dinámica de Google Identity Services (OAuth2)
- Solicitud de token con scope `drive.file`
- Creación de carpetas por proyecto en Drive
- Upload multipart de imágenes y videos
- Asignación de permisos públicos (`anyone → reader`)
- Retorna URLs CDN: `https://drive.usercontent.google.com/download?id={FILE_ID}`

---

## Pantallas y Rutas

| Ruta              | Descripción                                   | Acceso        |
| ----------------- | --------------------------------------------- | ------------- |
| `/`               | Home — video aleatorio + proyectos destacados | Público       |
| `/Gallery`        | Galería completa de proyectos                 | Público       |
| `/project/:uuid`  | Detalle de proyecto (imágenes, videos, info)  | Público       |
| `/About`          | Información del estudio                       | Público       |
| `/SignIn`         | Autenticación con Firebase                    | Público       |
| `/Upload`         | Subida de proyectos multimedia                | **Protegida** |
| `/Developer`      | Panel de administración                       | **Protegida** |
| `/PrivacyPolicy`  | Política de privacidad                        | Público       |
| `/TermsOfService` | Términos de servicio                          | Público       |

---

## Variables de Entorno Requeridas

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Firebase
REACT_APP_API_KEY=
REACT_APP_AUTH_DOMAIN=
REACT_APP_DATABASE_URL=
REACT_APP_PROJECT_ID=
REACT_APP_STORAGE_BUCKET=
REACT_APP_MESSAGING_SENDER_ID=
REACT_APP_APP_ID=
REACT_APP_MEASUREMENT_ID=

# Google Drive OAuth2
REACT_APP_GOOGLE_CLIENT_ID=
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=
```

---

## Responsabilidades del Desarrollador

Diseño y desarrollo completo de la plataforma web, integración con Firebase y Google Drive, desarrollo del sistema de autenticación, almacenamiento multimedia, estructura de base de datos y optimización de la experiencia de usuario.

---

## Desafíos Técnicos

Uno de los principales desafíos fue manejar grandes volúmenes de archivos multimedia sin afectar el rendimiento de la plataforma. Se implementó integración con Firebase y Google Drive para optimizar el almacenamiento, sincronización y acceso seguro a los archivos en tiempo real.

---

## Resultado

> "La plataforma permitió mejorar la organización y seguimiento de proyectos arquitectónicos, reduciendo tiempos de búsqueda y facilitando la gestión audiovisual de cada obra."

---

## 🏗️ Módulo: Alquiler de Maquinaria

### 🔹 1. Catálogo de Maquinaria (Listado)

Listado de todas las máquinas disponibles. Cada tarjeta incluye:

- Imagen principal
- Nombre de la máquina
- Marca
- Precio base (por hora / día / semana)
- Botón: **Ver detalles**
- Estado: `Disponible` / `Ocupado`

---

### 🔹 2. Detalle de la Máquina

#### 📌 Información básica

- Nombre completo (Ej: Excavadora CAT 320D)
- Marca (Caterpillar, Komatsu, etc.)
- Modelo
- Año (opcional)
- Estado

#### 📌 Descripción

- Uso de la máquina
- Aplicaciones (obra civil, excavación, etc.)

#### 📌 Especificaciones técnicas

Almacenadas como JSON en Firebase:

```json
"specs": {
  "peso": "20 toneladas",
  "potencia": "150 HP",
  "capacidad": "1.2 m3",
  "consumo": "...",
  "dimensiones": "..."
}
```

#### 🎥 Videos

- Video demostrativo (YouTube o Drive)
- Uso correcto
- Seguridad

> Reutiliza el sistema actual de URLs de Google Drive.

#### 🖼️ Galería

- Múltiples imágenes
- Zoom opcional

#### 💬 Comentarios / Reseñas

- Usuario
- Calificación ⭐⭐⭐⭐⭐
- Comentario

Estructura en Firebase:

```bash
maquinas/{id}/reviews/
```

---

### 🔹 3. Sistema de Cotización (PROFORMA) 💰

Núcleo del negocio. Permite:

- Seleccionar máquina
- Elegir: Horas / Días / Semanas + Cantidad
- Extras: Operador (sí/no), Transporte (sí/no)

**Cálculo automático:**

$$\text{Total} = (\text{precio} \times \text{tiempo} \times \text{cantidad}) + \text{extras}$$

**Resultado:**

- Subtotal
- IVA
- Total final
- Botón: **Descargar PDF** (proforma)
- Botón: **Enviar por WhatsApp / correo**

---

### 🔹 4. Carrito de Cotización

- Varias máquinas en una sola cotización
- Totales combinados
- Generar una sola proforma

---

### 🔹 5. Filtros y Búsqueda

- Por tipo: Excavadoras / Retroexcavadoras / Volquetas
- Por precio
- Por disponibilidad

---

### 🔹 6. Panel Admin

Permite al cliente gestionar:

- Crear maquinaria
- Subir imágenes y videos
- Editar precios
- Ver cotizaciones

---

### 🔹 7. Extras

- 🔔 **Disponibilidad en tiempo real** — Calendario (ocupado/libre)
- 📍 **Ubicación** — Dónde está la máquina
- 📞 **Contacto rápido** — Botón WhatsApp directo
- 🧾 **Historial de cotizaciones** — Guardado en Firebase

---

### 🧠 Estructura en Firebase

```bash
maquinas/
  └── {id}/
        ├── nombre
        ├── marca
        ├── precioHora
        ├── precioDia
        ├── descripcion
        ├── specs {}
        ├── imagenes[]
        ├── videos[]
        └── reviews[]

cotizaciones/
  └── {id}/
        ├── cliente
        ├── items[]
        ├── total
        └── fecha
```

### ⚠️ Nota de arquitectura

No mezclar este módulo con la lógica de proyectos arquitectónicos. Mantener rutas separadas:

```bash
/maquinaria
/cotizacion
```

---

### PROXIMAMENTE

Puedes agregar:

- IA que recomiende maquinaria según el proyecto
- Simulación de costos
- Comparador de máquinas

---

## 🔔 Módulo Adicional: Pagos, Notificaciones y Confirmaciones

### 🔹 1. Flujo completo

1. Cliente arma cotización
2. Cliente confirma → pasa a checkout
3. Cliente paga (tarjeta débito)
4. Sistema:
   - Guarda la compra
   - Notifica en la app 🔔
   - Envía correos ✉️
   - Genera resumen (tipo factura/proforma final)

---

### 💳 2. Métodos de Pago

> ⚠️ No implementar pagos manualmente. Usar una pasarela certificada.

**Opciones recomendadas:**

| Pasarela | Descripción |
| --- | --- |
| **Stripe** | La más fácil de integrar, documentación excelente |
| **PayPal** | Amplio reconocimiento internacional |
| **PayPhone** | Muy usado en Ecuador, soporta tarjetas locales |

**Soporte de tarjetas:** Visa · Mastercard · Solo débito (configurable en la pasarela)

#### 🔧 Flujo técnico (ejemplo con Stripe)

```text
Frontend (React)  →  Captura datos de tarjeta (Stripe Elements)
Backend (Cloud Function)  →  Crea PaymentIntent con Stripe API
Webhook de Stripe  →  Confirma pago → guarda orden en Firebase
```

---

### 🔔 3. Notificaciones en la App

#### 📱 Tipos de notificación

- Compra realizada
- Pago exitoso
- Nueva cotización (para admin)

#### 🔧 Implementación con Firebase Cloud Messaging (FCM)

```json
{
  "title": "Compra realizada",
  "body": "Se ha registrado una nueva orden",
  "sound": "default",
  "vibrate": true
}
```

**Características:** Vibración · Sonido · Notificación push

---

### ✉️ 4. Envío de Correos Automáticos

#### 📩 Correo al cliente (post-pago)

- Nombre del cliente
- Máquinas alquiladas
- Tiempo: horas / días / semanas / meses
- Total pagado
- Fecha
- Resumen tipo factura

#### 📩 Correo al vendedor/admin

- Quién compró
- Qué compró
- Cuánto pagó
- Tiempo de alquiler
- Método de pago

#### 🔧 Implementación recomendada: Firebase Cloud Functions + SendGrid / Nodemailer

```js
exports.enviarCorreo = functions.database
  .ref('/ordenes/{id}')
  .onCreate((snapshot, context) => {
    const data = snapshot.val();
    // enviar correo cliente
    // enviar correo admin
  });
```

---

### 📊 5. Estructura en Firebase — Órdenes

```bash
ordenes/
  └── {id}/
        ├── cliente/
        │     ├── nombre
        │     └── email
        ├── items[]
        │     ├── maquina
        │     ├── cantidad
        │     └── tiempo (horas/días/semanas)
        ├── total
        ├── metodoPago (visa/debito)
        ├── estado (pagado/pendiente/fallido)
        └── fecha
```

---

### 🧾 6. Resumen de compra (post-pago)

Pantalla final después de pagar:

- ✅ Confirmación de pago exitoso
- 📄 Resumen detallado de la orden
- 📥 Botón: Descargar PDF
- 📤 Botón: Enviar por WhatsApp

---

### ⚠️ Consideraciones importantes

| Categoría | Detalle |
| --- | --- |
| **Seguridad** | Nunca procesar tarjetas directamente — usar siempre Stripe/PayPhone |
| **Validaciones** | No permitir compra sin seleccionar tiempo · Validar disponibilidad |
| **Errores** | Manejar pago fallido, conexión caída y reintentos |

---

### 🚀 Resultado final del sistema completo

| Módulo | Ruta | Estado |
| --- | --- | --- |
| Catálogo de maquinaria | `/maquinaria` | ✅ Implementado |
| Cotizador (proforma) | `/maquinaria/:id` → tab Cotizar | ✅ Implementado |
| Carrito de cotización | FAB flotante | ✅ Implementado |
| Panel admin | `/admin/maquinaria` | ✅ Implementado |
| Checkout con pago real | `/checkout` | 🔜 Próximamente |
| Notificaciones push (FCM) | — | 🔜 Próximamente |
| Correos automáticos | Cloud Functions | 🔜 Próximamente |
| Historial de órdenes | `/ordenes` | 🔜 Próximamente |
