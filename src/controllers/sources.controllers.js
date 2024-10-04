import { Coonexion } from "../db.js";
import Openpay from "openpay";
import Twilio  from "twilio";
import { sendPurchaseReceipt } from "../middlewares/authMail.js";

export const getCategorias = async (req, res) => {
  try {
    const [[category]] = await Coonexion.execute('CALL ObtenerCategorias()')
    res.status(200).json(category)
  } catch (error) {
    res.status(500).json(['Error al obtener las categorías'])
  }
}

export const getMenu = async (req, res) => {
  try {
    const [[result]] = await Coonexion.execute('CALL ObtenerMenu()')
    res.status(200).json([result])
  } catch (error) {
    console.error(error)
    res.status(500).json(['Error al obtener el menú'])
  }
}

export const getMenuPorCategoria = async(req, res) =>{
  try {
    const { categoriaId } = req.params
    const [[result]] = await Coonexion.execute('CALL ObtenerMenuPorCategoria(?)', [categoriaId])
    res.status(200).json([result])
  } catch (error) {
    console.log(error)
    res.status(500).json(['Error al filtrar el menú'])	
  }
}

export const getMenuPorNombre = async(req, res) =>{
  try {
    const {nombre } = req.query
    const [[result]] = await Coonexion.execute('CALL ObtenerMenuPorNombre(?)', [nombre])
    res.status(200).json([result])
  } catch (error) {
    res.status(500).json(['Error al filtrar el menú por nombre'])
  }
}

export const DescripcionPlatillo = async(req, res) =>{
  try {
    const descPro = req.params.descPro;
    const [[result]] = await Coonexion.execute('CALL ObtenerDetallePlatillo(?)', [descPro])
    
    if (!result[0]) res.status(400).json(['No se pudo obtener el platillo'])
    
    const [[result2]] = await Coonexion.execute('CALL ObtenerRecomendaciones(?)', [descPro])
    console.log([result[0], result2])
    
    if (!result2) res.status(400).json(['No se pudo obtener las recomendaciones'])
    
    res.status(200).json([result[0], result2])
  } catch (error) {
    console.log(error);
    res.status(500).json(['error al obtener el detalle del platillo']);
  }
}

export const ObtenerPrecio = async(req,res) =>{
  try {
    const {id,tam,pre} = req.query
    
    const [[precio]] = await Coonexion.execute('CALL ObtenerPrecioPlatillo(?,?,?)',[id, pre, tam])
    
    if(!precio[0]) return res.status(400).json(['No se pudo obtener el precio'])
    
    res.status(200).json([precio[0]])
  } catch (error) {
    console.log(error);
    res.status(500).json(['error al obtener el precio']);
  }
}

export const ObtenerDetallesXprecio = async(req,res) =>{
  try {
    const {id,pre} = req.query
    
    const [[precio]] = await Coonexion.execute('CALL ObtenerDetallePlatilloPrecio(?,?)',[id, pre])
    
    if(!precio[0]) return res.status(400).json(['No se pudo obtener el precio'])
    
    res.status(200).json([precio[0]])
  } catch (error) {
    console.log(error);
    res.status(500).json(['error al obtener el precio']);
  }
}

export const InsertShoppinCar = async (req, res) => {
  try {
    const { id_platillo, id_usuario, cantidad, total } = req.body;
    console.log(id_usuario, id_platillo)
    const [[searchPlatillo]] = await Coonexion.execute('CALL ObtenerCarritoPorIDUsuarioYPlatillo(?, ?)', [id_usuario, id_platillo]);
    console.log('busqueda',searchPlatillo)
    if (searchPlatillo && searchPlatillo.length > 0) {
      let id_car = searchPlatillo[0].id_carrito;
      let cant = searchPlatillo[0].cantidad;
      let canti = cant + cantidad;
      let sub = parseFloat(searchPlatillo[0].subtotal);
      let tot = sub + total;
      
      const [result] = await Coonexion.execute('CALL ActualizarCarrito(?, ?, ?)', [id_car, canti, tot]);
      
      if (result.affectedRows === 0) {
        return res.status(400).json({ message: 'Ocurrió un error al actualizar el carrito' });
      }
      
      res.status(200).json({ message: 'Producto agregado y actualizado en el carrito' });
    } else {
      const [result] = await Coonexion.execute('CALL InsertarCarrito(?, ?, ?, ?)', [id_platillo, id_usuario, cantidad, total]);
      console.log(result)
      if (result.affectedRows === 0) {
        
        return res.status(400).json({ message: 'Ocurrió un error al agregar al carrito' });
      }
      console.log('se agrego el carrito')
      res.status(200).json({ message: 'Producto agregado al carrito' });
    }
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ message: 'Error al agregar al carrito', error: error.message });
  }
};

export const GetShoppingCar = async(req,res) =>{
  try {
    const id = req.params.idUser
    const [[result]] = await Coonexion.execute('CALL ObtenerCarrito(?)', [id])
    res.status(200).json([result])
  } catch (error) {
    console.log(error)
    res.status(500).json(['Error al traer el carrito'])
  }
}

export const DeleteCarrito = async(req, res) =>{
  try {
    const id_carrito = req.params.id_car
    console.log(id_carrito)
    const [delet] = await Coonexion.execute('CALL EliminarItemCarrito(?)', [id_carrito]) 
    if(delet.affectedRows === 0) return res.status(400).json(['Ocurrio un error al eliminar del carrito'])
    res.status(200).json(['Se elimino del carrito'])
  } catch (error) {
    console.log(error)
    res.status(500).json(['Error al eliminar el carrito'])
  }
}

export const UpdateShoppingCar = async(req, res) =>{
  try {
    const {id_carrito, cantidad, subtotal} = req.body
    console.log(id_carrito, cantidad, subtotal)
    if(cantidad < 1) return res.status(400).json(['No se actualizo la cantidad'])
    const [result] = await Coonexion.execute('CALL ActualizarCarrito(?,?,?)',[id_carrito, cantidad, subtotal])
    if(result.affectedRows === 0) return res.status(400).json(['Ocurrio un error al agregar al carrito'])
    res.status(200).json(['Se actualizo la cantidad'])
  } catch (error) {
    console.log(error)
    res.status(500).json(['Error al actualizar el carrito'])
  }
}

export const CrearVenta = async(req, res) =>{
  try {
    const { id_usuario, sumaSubtotales, id_direccion, metodoPago, precio, cambio, carrito, email, telefono } = req.body;
    sendPurchaseReceipt(email, carrito, sumaSubtotales, metodoPago)
    const mensaje = [];
    console.log('carrito',carrito)
    const fechaActual = new Date();
    const estado = 'Pendiente';
    const [ventaResult] = await Coonexion.execute('INSERT INTO ventas (id_usuario, total, estado_pedido, fecha_venta, id_direccion, id_metodo_pago, monto_pagado, cambio_devuelto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [id_usuario, sumaSubtotales, estado, fechaActual, id_direccion, metodoPago, precio, cambio]);
    const ventaId = ventaResult.insertId;
    for (const item of carrito) {
      const { id_relacion, cantidad, subtotal } = item;
      await Coonexion.execute('INSERT INTO descripcion_ventas (id_venta, id_relacion, cantidad, subtotal) VALUES (?, ?, ?, ?)', [ventaId, id_relacion, cantidad, subtotal]);
      const [[rows]] = await Coonexion.execute('CALL ObtenerPlatillosID(?)', [id_relacion])
      const { nombre_platillo, tamaño, presentacion } = rows[0];
      let platilloTexto = `- ${nombre_platillo}`;
      if (tamaño.toLowerCase() !== 'ninguno') {
        platilloTexto += `, ${tamaño}`;
      }
      if (presentacion.toLowerCase() !== 'unica') {
        platilloTexto += `, ${presentacion}`;
      }
    
      mensaje.push(platilloTexto);
    }
    for (const item of carrito) {
      const { id_carrito } = item;
      await Coonexion.execute('DELETE FROM carrito WHERE id_carrito = ?', [id_carrito]);
    }
    
    const [result2] = await Coonexion.execute('SELECT * FROM direcciones WHERE id_direccion = ?', [id_direccion]);
    const coordenadas = {lat: result2[0].latitud, lng: result2[0].longitud}
    const mensajeFinal = `
    Ubicación para el pedido de ${email}
    *Pedido*
    ${mensaje.join('\n')}
    `;
    const men = 'Tu pedido ha sido recibido y está en proceso de entrega. Gracias por tu compra!'
    MensajeUbicacion(mensajeFinal, coordenadas)
    MensajeCliente(men, telefono)
    
    res.status(200).json(['Compra realizada exitosamente']);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la compra' });
  }
}

export const CargarPago = async(req, res) => {
  try {
    const {token_id, device_session_id, amount, description, name, last_name, email} = req.body
    const idKey = process.env.MERCHANT_ID
    const keyPrivate = process.env.PRIVATE_KEY
    const openpay = new Openpay(idKey, keyPrivate, false); 
    
    const customer = {
      name,
      last_name,
      email
    }
    
    const chargeRequest = {
      method: 'card',
      source_id: token_id,
      amount,
      description,
      device_session_id,
      customer,
      use_3d_secure: true,
      // redirect_url: 'http://localhost:5173/success-pay?method=openpay'
      redirect_url: 'https://labarbada.store/success-pay?method=openpay'
    };
    
    openpay.charges.create(chargeRequest, (error, charge) => {
      if (error) {
        console.log('error interno: ', error);
        return res.status(500).send(error);
      }
      
      if (charge && charge.payment_method && charge.payment_method.type === 'redirect') {
        res.status(200).send({
          requires_action: true,
          payment_method: {
            url: charge.payment_method.url
          }
        });
      } else {
        res.status(200).send(charge);
      }
    });
  } catch (error) {
    console.log('error de servidor',error)
    res.status(500).json(['Error al cargar el pago'])
  }
}

// Ejemplo en el backend
export const VerificarTransaccion = async (req, res) => {
  const transactionId = req.params.transactionId;
  try {
    const openpay = new Openpay(process.env.MERCHANT_ID, process.env.PRIVATE_KEY, false);
    openpay.charges.get(transactionId, (error, charge) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      res.status(200).send(charge);
    });
  } catch (error) {
    res.status(500).send({ error: 'Error al verificar la transacción' });
  }
};


// Ejemplo en el backend
// export const VerificarTransaccion = async (req, res) => {
//   const transactionId = req.params.transactionId;
//   console.log(transactionId)
//   try {
//     const openpay = new Openpay(process.env.MERCHANT_ID, process.env.PRIVATE_KEY, false);
//     openpay.charges.get(transactionId, (error, charge) => {
//       if (error) {
//         return res.status(500).send({ error: error });
//       }
//       res.status(200).send(charge);
//     });
//   } catch (error) {
//     res.status(500).send({ error: 'Error al verificar la transacción' });
//   }
// };


//---Mensajes de whatsapp---//

const accountSid = 'ACde858911459b13f40a546f82ce08baa7'
const authToken = '240755142ef90b4ab55a02a110375efa'
const client = new Twilio(accountSid, authToken);


const MensajeUbicacion = ( message, coordinates) =>{
  try {
    client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886', // Número de Twilio para WhatsApp
      to: `whatsapp:+527712144870`,
      persistentAction: coordinates ? [`geo:${coordinates.lat},${coordinates.lng}|${message}`] : undefined
    })
    .then(message => console.log(`Mensaje enviado: ${message.sid}`))
    .catch(error => console.log(`Error al enviar mensaje: ${error.message}`));
  } catch (error) {
    return ['Error al enviar el mensaje']
  }
}

const MensajeCliente = (message, telefono) =>{
  try {
    client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886', // Número de Twilio para WhatsApp
      to: `whatsapp:+52${telefono}`
    })
    .then(message => console.log(`Mensaje de confirmación enviado: ${message.sid}`))
    .catch(error => console.log(`Error al enviar mensaje de confirmación: ${error.message}`));
  } catch (error) {
    return ['Error al enviar el mensaje']
  }
}


function getRandomNumberBetween24And30() {
  const min = 24;
  const max = 30;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const InteraccionWhatsApp = async(req, res) =>{
  try {
    const twilioSignature = req.headers['x-twilio-signature'];
    const requestBody = req.body;
  
    // Verificar la firma de Twilio para asegurarse de que la solicitud es legítima
    const isValidRequest = Twilio.validateRequest(
      authToken,
      twilioSignature,
      `https://api-barbada-saurce.vercel.app/api/whatsapp-webhook`,
      requestBody
    );
  
    if (!isValidRequest) {
      return res.status(403).send('Invalid request');
    }
  
    const from = requestBody.From;
    const body = requestBody.Body.trim().toLowerCase();
  
    if (body === 'recibir') {
      // Actualizar la base de datos para marcar el pedido como recibido
      // Enviar confirmación al cliente
      const randomNumber = getRandomNumberBetween24And30();
      client.messages.create({
        body: `Su pedido esta en preparación y estará listo para ser entregado en ${randomNumber} minutos .`,
        from: 'whatsapp:+14155238886',
        to: from
      });
    } else if (body === 'cancelar') {
      // Actualizar la base de datos para marcar el pedido como cancelado
      // Enviar confirmación al cliente
      client.messages.create({
        body: 'Su pedido ha sido cancelado.',
        from: 'whatsapp:+14155238886',
        to: from
      });
    }
  
    res.status(200).send('Webhook received');
  } catch (error) {
    console.log(error)
  }
}