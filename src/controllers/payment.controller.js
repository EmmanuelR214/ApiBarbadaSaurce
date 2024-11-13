import Openpay from 'openpay';

const openpay = new Openpay(process.env.MERCHANT_ID, process.env.PRIVATE_KEY, false); // Cambia a true para producción

// Endpoint para crear el token
export const generarToken = async (req, res) => {
  try {
    const { card_number, holder_name, expiration_year, expiration_month, cvv2 } = req.body;

    openpay.tokens.create(
      {
        card_number,
        holder_name,
        expiration_year,
        expiration_month,
        cvv2,
      },
      (error, token) => {
        if (error) {
          console.error('Error al crear token:', error);
          return res.status(500).json({ message: 'Error al crear token', error });
        }
        res.status(200).json({ token_id: token.id });
      }
    );
  } catch (error) {
    console.error('Error del servidor al crear token:', error);
    res.status(500).json({ message: 'Error del servidor', error });
  }
};

// Endpoint para realizar el pago
export const realizarPago = async (req, res) => {
  try {
    const { token_id, amount, description, name, last_name, email } = req.body;

    const customer = {
      name,
      last_name,
      email,
    };

    const chargeRequest = {
      method: 'card',
      source_id: token_id,
      amount,
      description,
      customer,
      use_3d_secure: false, // Cambia a true si necesitas 3D Secure
    };

    openpay.charges.create(chargeRequest, (error, charge) => {
      if (error) {
        console.error('Error en el pago:', error);
        return res.status(500).json({ message: 'Error en el pago', error });
      }
      res.status(200).json(charge);
    });
  } catch (error) {
    console.error('Error del servidor en el pago:', error);
    res.status(500).json({ message: 'Error del servidor', error });
  }
};
