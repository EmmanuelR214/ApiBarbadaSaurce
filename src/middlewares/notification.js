import { Coonexion } from "../db.js";

// Ruta para recibir y almacenar la suscripción en la base de datos
export const Subscribe = async (req, res) => {
  const {token} = req.body;
  try {    
    
    await Coonexion.execute(
      `INSERT INTO suscripciones (token)
      VALUES (?) 
      ON DUPLICATE KEY UPDATE fecha_suscripcion = CURRENT_TIMESTAMP`, 
      [token]
    );    
    
    res.status(201).json(['Suscripción guardada en la base de datos.']);
  } catch (error) {
    console.log(error)
    res.status(500).json(['Error al guardar la suscripción.', error, subscription]);
  }
}