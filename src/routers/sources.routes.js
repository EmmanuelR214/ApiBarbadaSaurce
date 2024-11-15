import {Router} from 'express'
import {validateSchema} from '../middlewares/validator.middleware.js'
import { CargarPago, CrearVenta, DeleteCarrito, DescripcionPlatillo, getCategorias, getMenu, getMenuPorCategoria, getMenuPorNombre, GetShoppingCar, InsertShoppinCar, InteraccionWhatsApp, ObtenerDetallesXprecio, ObtenerPrecio, UpdateShoppingCar, VerificarTransaccion } from '../controllers/sources.controllers.js'
import { Subscribe } from '../middlewares/notification.js'
import { createPaymentIntent } from '../controllers/payment.controller.js'

const router = Router()

router.get('/menu', getMenu)

router.get('/categorias', getCategorias)

router.get('/menu-categoria/:categoriaId', getMenuPorCategoria)

router.get('/menu-nombre', getMenuPorNombre)

//Platillos
router.get('/descripcion-platillo/:descPro', DescripcionPlatillo)

router.get('/precio-platillo', ObtenerPrecio)

router.get('/detalle-precio', ObtenerDetallesXprecio)

router.post('/shoppingcar', InsertShoppinCar)

router.get('/get-shoppingCar/:idUser', GetShoppingCar)

router.delete('/delete-shoppingcar/:id_car', DeleteCarrito)

router.put('/update-shoppingcar', UpdateShoppingCar)

router.post('/pago-tarjeta', CargarPago)

router.get('/verificar-transaccion/:transactionId', VerificarTransaccion)

router.post('/venta', CrearVenta)

router.post('/whatsapp-webhook', InteraccionWhatsApp)

router.post('/subscribe', Subscribe)


router.post('/create-payment-stripe', createPaymentIntent)


export default router
