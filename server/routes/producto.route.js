import { Router } from "express";
import { addProducto, getProductos, updateProducto, deleteProducto } from "../controllers/producto.controller.js";

const productoRouter = Router();

productoRouter.get('/listar/:id?', getProductos);
productoRouter.post('/agregar', addProducto);
productoRouter.put('/actualizar/:id', updateProducto);
productoRouter.delete('/borrar/:id', deleteProducto);

export default productoRouter;