import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentStripe = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    stripe.checkout.sessions.create({
      amount,
      currency,
    })
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}