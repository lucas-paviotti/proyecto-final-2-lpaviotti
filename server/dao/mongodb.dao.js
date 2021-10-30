import mongoose from 'mongoose';
import ProductoSchema from '../persistence/schemas/productos.js';
import CarritoSchema from '../persistence/schemas/carrito.js';

export default class mongodbDAO {
    constructor(url, options) {
        this.connection = mongoose.connect(url, options);
    }
    async createProducto(nombre, descripcion, codigo, foto, precio, stock) {
        try {            
            const nuevoProducto = new ProductoSchema({
                nombre: nombre,
                descripcion: descripcion,
                codigo: codigo,
                foto: foto,
                precio: precio,
                stock: stock
            });
            await nuevoProducto.save();
            return nuevoProducto;
        }
        catch(e) {
            throw `Error al agregar documento: ${e}`;
        }
    }
    async readProducto(id) {
        try {
            if (id) {
                const producto = await ProductoSchema.find({ _id: id });
                if (producto.length) {
                    return producto;
                } else {
                    return 'not found';
                }
            } else {
                const productos = await ProductoSchema.find({});
                if (productos.length) {
                    return productos;
                } else {
                    return 'empty';
                }
            }
        }
        catch(e) {
            throw `Error al buscar documentos: ${e}`;
        }
    }
    async updateProducto(id, nombre, descripcion, codigo, foto, precio, stock) {
        try {
            const producto = await ProductoSchema.find({ _id: id });
            if (producto.length) {
                await ProductoSchema.updateOne({ _id: id }, { nombre: nombre, descripcion: descripcion, codigo: codigo, foto: foto, precio: precio, stock: stock });
                return await ProductoSchema.find({ _id: id });
            } else {
                return 'not found';
            }
        }
        catch(e) {
            throw `Error al editar documento: ${e}`;
        }
    }
    async deleteProducto(id) {
        try {
            const producto = await ProductoSchema.find({ _id: id });
            if (producto.length) {
                await ProductoSchema.deleteOne({ _id: id });
                return producto;
            } else {
                return 'not found';
            }
        }
        catch(e) {
            throw `Error al eliminar documento: ${e}`;
        }
    }
    async createCarrito(id, usuario) {
        try {
            const producto = await ProductoSchema.find({ _id: id });
            if (producto.length) {
                await CarritoSchema.findOneAndUpdate({ usuario: usuario }, { $push: { productos: producto } }, { upsert: true });
                const carrito = await CarritoSchema.findOne({ usuario: usuario }).populate('productos');
                return carrito.productos; 
            } else {
                return 'not found';
            }
        }
        catch(e) {
            throw `Error al agregar documento: ${e}`;
        }
    }
    async readCarrito(usuario) {
        try {
            const carrito = await CarritoSchema.findOne({ usuario: usuario }).populate('productos');
            if (carrito) {
                return carrito;
            } else {
                return 'empty';
            }
        }
        catch(e) {
            throw `Error al buscar documentos: ${e}`;
        }
    }
    async deleteCarrito(id, usuario) {
        try {
            const carrito = await CarritoSchema.findOne({ usuario: usuario }).populate('productos');
            if (carrito.productos.length) {
                carrito.productos.pull({ _id: id });
                await carrito.save();
                return carrito.productos;
            } else {
                return 'empty'
            }
        }
        catch(e) {
            throw `Error al eliminar documento: ${e}`;
        }
    }
}