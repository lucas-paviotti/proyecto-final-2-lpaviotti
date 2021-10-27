import Producto from '../models/Producto.js';
import Carrito from '../models/Carrito.js';
import * as fs from 'fs';

export default class fsDAO {
    constructor() {
        this.productos = JSON.parse(fs.readFileSync('./content/producto.content.json', 'utf8'));
        this.carrito = JSON.parse(fs.readFileSync('./content/carrito.content.json', 'utf8'));
    }
    createProducto(nombre, descripcion, codigo, foto, precio, stock) {
        const producto = new Producto(nombre, descripcion, codigo, foto, precio, stock);
        this.productos.push(producto.getParsedObject());
        fs.promises.writeFile(`./content/producto.content.json`, JSON.stringify(this.productos, null, 4)).catch( error => { console.log(`Error al escribir archivo de productos: ${error}`) } );
        return producto;
    }
    readProducto(id) {
        if (id) {
            const filteredArray = this.productos.find(obj => obj.id == id);
            if (filteredArray) {
                return filteredArray;
            } else {
                return 'not found';
            }
        } else {
            return this.productos;
        }
    }
    updateProducto(id, nombre, descripcion, codigo, foto, precio, stock) {
        const filteredArray = this.productos.find(obj => obj.id == id);
        if (filteredArray) {
            filteredArray.nombre = nombre;
            filteredArray.descripcion = descripcion;
            filteredArray.codigo = codigo;
            filteredArray.foto = foto;
            filteredArray.precio = precio;
            filteredArray.stock = stock;
            fs.promises.writeFile(`./content/producto.content.json`, JSON.stringify(this.productos, null, 4)).catch( error => { console.log(`Error al escribir archivo de productos: ${error}`) } );
            return filteredArray;
        } else {
            return 'not found';
        }
    }
    deleteProducto(id) {
        const filteredArray = this.productos.find(obj => obj.id == id);
        if (filteredArray) {
            this.productos.splice(this.productos.indexOf(filteredArray), 1);
            fs.promises.writeFile(`./content/producto.content.json`, JSON.stringify(this.productos, null, 4))
                .catch( error => { 
                    console.log(`Error al escribir archivo de productos: ${error}`) 
                });
            return filteredArray;
        } else {
            return 'not found';
        }
    }
    createCarrito(id, usuario) {
        const filteredArray = this.productos.find(obj => obj.id == id);
        const productosCarrito = this.carrito.productos;

        if (filteredArray) {
            if (!productosCarrito || productosCarrito.length == 0) {
                const nuevoCarrito = new Carrito(usuario, filteredArray);
                fs.promises.writeFile(`./content/carrito.content.json`, JSON.stringify(nuevoCarrito, null, 4)).catch( error => { console.log(`Error al escribir archivo de productos: ${error}`) } );
                return this.carrito.productos;
            }
            productosCarrito.push(filteredArray);
            fs.promises.writeFile(`./content/carrito.content.json`, JSON.stringify(this.carrito, null, 4)).catch( error => { console.log(`Error al escribir archivo de productos: ${error}`) } );
            return this.carrito.productos;
        } else {
            return 'not found';
        }
    }
    readCarrito(usuario) {
        const filteredArray = this.carrito.find(obj => obj.usuario == usuario);
        
        if (filteredArray) {
            return filteredArray;
        } else {
            return 'not found';
        }
    }
    deleteCarrito(id) {
        const filteredArray = this.carrito.productos.find(obj => obj.id == id);
        const productosCarrito = this.carrito.productos;

        if (!productosCarrito || productosCarrito.length == 0) {
            return 'empty';
        }

        if (filteredArray) {
            productosCarrito.splice(productosCarrito.indexOf(filteredArray), 1);
            fs.promises.writeFile(`./content/carrito.content.json`, JSON.stringify(this.carrito, null, 4)).catch( error => { console.log(`Error al escribir archivo de productos: ${error}`) } );
            return filteredArray;
        } else {
            return 'not found';
        }
    }
}