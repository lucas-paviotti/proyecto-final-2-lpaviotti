import mongoose from 'mongoose';
import Productos from '../persistence/schemas/productos.js';
import Carrito from '../persistence/schemas/carrito.js';

export default class mongodbDAO {
    constructor(url, options) {
        this.connection = mongoose.connect(url, options);
    }
    createProducto(nombre, descripcion, codigo, foto, precio, stock) {
        
    }
    readProducto(id) {

    }
    updateProducto(id, nombre, descripcion, codigo, foto, precio, stock) {

    }
    deleteProducto(id) {

    }
    createCarrito(id) {

    }
    readCarrito(id) {

    }
    deleteCarrito(id) {

    }
}