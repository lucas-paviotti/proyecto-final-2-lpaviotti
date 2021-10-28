import knex from 'knex';
import { v4 } from "uuid";

export default class mysqlDAO {
    constructor(options) {
        this.connection = knex(options);
        this.initProductos = this.connection.schema.hasTable('productos').then(exists => {
            if (!exists) {
                return this.connection.schema.createTable('productos', table => {
                    table.string('id').primary().notNullable(),
                    table.timestamp('timestamp'),
                    table.string('nombre'),
                    table.string('descripcion'),
                    table.string('codigo'),
                    table.string('foto'),
                    table.decimal('precio', 10, 2),
                    table.integer('stock');
                })
                .then(()=>{
                    console.log('Tabla productos creada!');
                    this.connection.destroy();
                })
                .catch(e=>{
                    console.log('Error en creación de tabla productos:', e);
                    this.connection.destroy();
                });
            }
        });
        this.initCarrito = this.connection.schema.hasTable('carrito').then(exists => {
            if (!exists) {
                return this.connection.schema.createTable('carrito', table => {
                    table.string('id').notNullable().primary(),
                    table.timestamp('timestamp'),
                    table.integer('usuario'),
                    table.json('productos');
                })
                .then(()=>{
                    console.log('Tabla carrito creada!');
                    this.connection.destroy();
                })
                .catch(e=>{
                    console.log('Error en creación de tabla carrito:', e);
                    this.connection.destroy();
                });
            }
        });
    }
    createProducto(nombre, descripcion, codigo, foto, precio, stock) {
        const id = v4();
        return this.connection.insert({id: id, nombre: nombre, descripcion: descripcion, codigo: codigo, foto: foto, precio: precio, stock: stock}).into('productos')
        .then( () => {
            return {
                id: id, 
                nombre: nombre, 
                descripcion: descripcion, 
                codigo: codigo, 
                foto: foto,
                precio: precio, 
                stock: stock
            };
        })
        .catch( (e) => {
            console.log(`Error al insertar en tabla: ${e}`);
            throw `Error al insertar en tabla: ${e}`;
        });
    }
    readProducto(id) {
        if (id) {
            return this.connection.from('productos').select('*').where('id', id)
            .then( (producto) => {
                if (producto.length) {
                    return producto;
                } else {
                    return 'not found';
                }
            })
            .catch( (e) => {
                console.log(`Error al leer tabla: ${e}`);
                throw `Error al leer tabla: ${e}`;
            });
        } else {
            return this.connection.from('productos').select('*')
        }
    }
    updateProducto(id, nombre, descripcion, codigo, foto, precio, stock) {
        return this.connection.from('productos').where('id', id).update({nombre: nombre, descripcion: descripcion, codigo: codigo, foto: foto, precio: precio, stock: stock})
        .then( () => {
            return {
                nombre: nombre, 
                descripcion: descripcion, 
                codigo: codigo, 
                foto: foto,
                precio: precio, 
                stock: stock
            };
        })
        .catch( (e) => {
            console.log(`Error al editar tabla: ${e}`);
            throw `Error al editar tabla: ${e}`;
        });
    }
    deleteProducto(id) {
        this.connection.from('productos').where('id', id).del()
        .then( (producto) => {
            if (producto) {
                return producto;
            } else {
                return 'not found';
            }
        })
        .catch( (e) => {
            console.log(`Error al eliminar de tabla: ${e}`);
            throw `Error al eliminar de tabla: ${e}`;
        });
    }
}