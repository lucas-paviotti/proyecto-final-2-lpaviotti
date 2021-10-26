import express from 'express';
import productoRouter from './routes/producto.route.js';
import carritoRouter from './routes/carrito.route.js';
import { PORT } from './config/config.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/productos', productoRouter);
app.use('/carrito', carritoRouter);

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${PORT}`);
});

server.on("error", error => console.log(`Error en servidor ${error}`));