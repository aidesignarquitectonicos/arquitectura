/**
 * Genera y descarga una proforma en PDF usando la API nativa del navegador (print).
 * Para producción se recomienda instalar jspdf + jspdf-autotable para un PDF más profesional.
 */
export function generatePDF({ cliente, items, subtotal, iva, total }) {
    const fecha = new Date().toLocaleDateString("es-EC", {
        year: "numeric", month: "long", day: "numeric",
    });

    const rows = items
        .map(
            (i) =>
                `<tr>
          <td>${i.nombre} (${i.marca})</td>
          <td>${i.cantidad} ${i.unidad}(s)</td>
          <td>$${Number(i.precio).toFixed(2)}</td>
          <td>${i.operador ? "Sí" : "No"}</td>
          <td>${i.transporte ? "Sí" : "No"}</td>
          <td>$${Number(i.subtotal ?? 0).toFixed(2)}</td>
        </tr>`
        )
        .join("");

    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8"/>
      <title>Proforma — AIDesign</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 32px; color: #222; }
        h1 { color: #1565c0; margin-bottom: 4px; }
        .sub { color: #666; font-size: 14px; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th { background: #1565c0; color: white; padding: 8px 12px; text-align: left; }
        td { padding: 8px 12px; border-bottom: 1px solid #eee; }
        tr:nth-child(even) { background: #f5f5f5; }
        .totals { text-align: right; margin-top: 16px; }
        .totals p { margin: 4px 0; }
        .total-final { font-size: 18px; font-weight: bold; color: #1565c0; }
        .footer { margin-top: 40px; font-size: 12px; color: #aaa; }
      </style>
    </head>
    <body>
      <h1>AIDesign Arquitectónicos</h1>
      <p class="sub">PROFORMA DE ALQUILER DE MAQUINARIA</p>
      <p><strong>Cliente:</strong> ${cliente}</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <table>
        <thead>
          <tr>
            <th>Máquina</th><th>Tiempo</th><th>Precio unitario</th>
            <th>Operador</th><th>Transporte</th><th>Subtotal</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="totals">
        <p>Subtotal: <strong>$${Number(subtotal).toFixed(2)}</strong></p>
        <p>IVA (12%): <strong>$${Number(iva).toFixed(2)}</strong></p>
        <p class="total-final">TOTAL: $${Number(total).toFixed(2)}</p>
      </div>
      <p class="footer">Documento generado automáticamente — AIDesign Arquitectónicos</p>
    </body>
    </html>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
}
