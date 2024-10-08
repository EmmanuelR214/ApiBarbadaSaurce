import { Coonexion } from "../db.js";

let subscription

// Ruta para recibir y almacenar la suscripción en la base de datos
export const Subscribe = async (req, res) => {
  subscription = req.body;
  try {    
    const endpoint = subscription.endpoint;
    const p256dh = subscription.keys.p256dh;
    const auth = subscription.keys.auth;
    
    await Coonexion.execute(
      `INSERT INTO suscripciones (endpoint, p256dh, auth) 
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE p256dh = ?, auth = ?`, 
      [endpoint, p256dh, auth, p256dh, auth]
    );    
    
    res.status(201).json(['Suscripción guardada en la base de datos.']);
  } catch (error) {
    console.log(error)
    res.status(500).json(['Error al guardar la suscripción.', error, subscription]);
  }
}