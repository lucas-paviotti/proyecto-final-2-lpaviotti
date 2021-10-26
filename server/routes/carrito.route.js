import { Router } from "express";
import { getCarrito, addCarrito, deleteCarrito } from "../controllers/carrito.controller.js";

const carritoRouter = Router();

carritoRouter.get('/listar/:id?', getCarrito);
carritoRouter.post('/agregar/:id_producto', addCarrito);
carritoRouter.delete('/borrar/:id', deleteCarrito);

export default carritoRouter;