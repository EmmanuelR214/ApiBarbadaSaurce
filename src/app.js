import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import indexRoutes from './routers/sources.routes.js'
import bodyParser from 'body-parser';


const app = express()

const allowedOrigins = ['http://localhost:5173', 'https://labarbada.store', 'https://app.labarbada.com']
app.use(cors({
    origin: allowedOrigins,
    credentials: true  
}))

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json());

app.use("/api",indexRoutes)

app.get("/api", (req, res) => {
    res.send('Bienvenido a la Api platillos')
})

app.get('/', (req, res) => {
    res.send('¡El API está en funcionamiento platillos!')
})

app.use((req,res, next)=>{
    res.status(404).json({
        message:"ruta no encontrada"
    })
})

export default app

/*
    origin: 'http://localhost:5173',
    // origin: 'http://localhost:5174',
    //origin: 'https://la-barbada2.vercel.app',
*/
