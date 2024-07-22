import { transporter } from "../libs/mailConfig.js";

export const sendPurchaseReceipt = async (email, carrito, sumaSubtotales,paymentMethod) => {
  const productosHTML = carrito.map(item => `
    <tr>
      <td>${item.nombre_platillo}</td>
      <td>${item.cantidad}</td>
      <td>${item.subtotal}</td>
    </tr>
  `).join('');
  const metodoDePago = paymentMethod === 1 ? 'Efectivo' : 'Tarjeta';
  await new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: '"La Barbada" <labarbada23@gmail.com>', // Dirección del remitente
        to: email, // Lista de destinatarios
        subject: "Ticket de Compra", // Asunto del correo
        html: `
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ticket de Compra</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: rgb(32, 31, 31);
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #101010;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding: 20px 0;
                }
                .header img {
                    max-width: 100px;
                }
                .content {
                    text-align: center;
                    padding: 20px 0;
                    color: #aaaaaa;
                }
                .content h1 {
                    font-size: 24px;
                }
                .content p {
                    font-size: 16px;
                }
                .purchase-details {
                    text-align: left;
                    color: #ffffff;
                    margin: 20px 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                table, th, td {
                    border: 1px solid #aaaaaa;
                }
                th, td {
                    padding: 10px;
                    text-align: left;
                }
                th {
                    background-color: #333333;
                    color: #ffffff;
                }
                .footer {
                    text-align: center;
                    padding: 20px 0;
                    font-size: 14px;
                    color: #aaaaaa;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://labarbada.store/imagenes/emblema.png" alt="Logo">
                </div>
                <div class="content">
                    <h1>Ticket de Compra</h1>
                    <p>Hola ${email}, gracias por tu compra. Aquí están los detalles de tu transacción:</p>
                    <div class="purchase-details">
                        <table>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${productosHTML}
                            </tbody>
                        </table>
                        <p><strong>Total:</strong> ${sumaSubtotales}</p>
                        <p><strong>Fecha de compra:</strong> ${new Date().toLocaleDateString()}</p>
                        <p><strong>Metodo de pago:</strong> ${metodoDePago}</p>
                        <p>Gracias por tu compra.</p>
                    </div>
                    <p>Si tienes alguna pregunta, no dudes en <a href="https://api.whatsapp.com/send?phone=7712451795" style="color: #E20714;" >contactarnos</a>.</p>
                    <p>Esperamos que disfrutes tu compra y te invitamos a visitarnos de nuevo para más productos deliciosos.</p>
                </div>
                <div class="footer">
                  <p>&copy; 2024 La Barbada. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        `, // Cuerpo del correo en formato HTML
      },
      (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        } else {
          console.log(info);
          resolve(info);
        }
      }
    );
  });
};