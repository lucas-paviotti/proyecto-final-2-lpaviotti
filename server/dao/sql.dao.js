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
                    table.integer('usuario');
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
        this.initCarritoItem = this.connection.schema.hasTable('carrito_item').then(exists => {
            if (!exists) {
                return this.connection.schema.createTable('carrito_item', table => {
                    table.string('id').notNullable().primary(),
                    table.string('id_carrito'),
                    table.string('id_producto'),
                    table.integer('cantidad');
                })
                .then(()=>{
                    console.log('Tabla carrito_item creada!');
                    this.connection.destroy();
                })
                .catch(e=>{
                    console.log('Error en creación de tabla carrito_item:', e);
                    this.connection.destroy();
                });
            }
        });
    }
    createProducto(nombre, descripcion, codigo, foto, precio, stock) {
        const id = v4();
        return this.connection.insert({id: id, nombre: nombre, descripcion: descripcion, codigo: codigo, foto: foto, precio: precio, stock: stock}).into('productos')
        .then( () => {
            return this.connection.from('productos').where('id', id);
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
            .then( (producto) => {
                if (producto.length) {
                    return producto;
                } else {
                    return 'empty';
                }
            })
            .catch( (e) => {
                console.log(`Error al leer tabla: ${e}`);
                throw `Error al leer tabla: ${e}`;
            });
        }
    }
    updateProducto(id, nombre, descripcion, codigo, foto, precio, stock) {
        return this.connection.from('productos').where('id', id).update({nombre: nombre, descripcion: descripcion, codigo: codigo, foto: foto, precio: precio, stock: stock})
        .then( (producto) => {
            if (producto) {
                return this.connection.from('productos').where('id', id);
            } else {
                return 'not found';
            }
        })
        .catch( (e) => {
            console.log(`Error al editar tabla: ${e}`);
            throw `Error al editar tabla: ${e}`;
        });
    }
    deleteProducto(id) {
        return this.connection.from('productos').select('*').where('id', id)
        .then( (producto) => {
            const productoBorrado = producto;
            if (productoBorrado.length) {
                return this.connection.from('productos').del().where('id', id)
                .then( () => {
                    return productoBorrado;
                })
                .catch( (e) => {
                    console.log(`Error al eliminar de tabla: ${e}`);
                    throw `Error al eliminar de tabla: ${e}`;
                });
            } else {
                return 'not found';
            }
        })
        .catch( (e) => {
            console.log(`Error al leer tabla: ${e}`);
            throw `Error al leer tabla: ${e}`;
        });
    }
    createCarrito(id, usuario) {
        return this.connection.from('productos').select('*').where('id', id)
        .then( (producto) => {
            const productoEncontrado = producto;
            if (producto.length) {
                // EXISTE PRODUCTO: BUSCAR CARRITO
                return this.connection.from('carrito').select('*').where('usuario', usuario)
                .then( (carrito) => {
                    const carritoEncontrado = carrito;
                    if (carrito.length) {
                        // EXISTE CARRITO: BUSCAR CARRITO_ITEM
                        return this.connection.from('carrito_item').select('*').where('id_carrito', carritoEncontrado[0].id).andWhere('id_producto', productoEncontrado[0].id)
                        .then( (carritoItem) => {
                            if (carritoItem.length) {
                                // EXISTE CARRITO_ITEM: AGREGAR +1 A CANTIDAD DE ITEM
                                return this.connection.from('carrito_item').increment('cantidad', 1).where('id_carrito', carritoEncontrado[0].id).andWhere('id_producto', productoEncontrado[0].id)
                                .then( () => {
                                    // RETORNAR JOIN
                                    return this.connection('carrito_item')
                                    .join('carrito', 'carrito.id', '=', 'carrito_item.id_carrito')
                                    .join('productos', 'productos.id', '=', 'carrito_item.id_producto')
                                    .select('*')
                                    .where('id_carrito', carritoEncontrado[0].id)
                                    .then( (join) => {
                                        return join;
                                    }).catch( (e) => {
                                        console.log(`Error en JOIN de tablas: ${e}`);
                                        throw `Error en JOIN de tablas: ${e}`;
                                    });
                                })
                                .catch( (e) => {
                                    console.log(`Error al editar tabla: ${e}`);
                                    throw `Error al editar tabla: ${e}`;
                                });
                            } else {
                                // NO EXISTE CARRITO_ITEM: AGREGAR NUEVO CARRITO_ITEM
                                const idCarritoItem = v4();
                                return this.connection.insert({id: idCarritoItem, id_carrito: carritoEncontrado[0].id, id_producto: productoEncontrado[0].id, cantidad: 1}).into('carrito_item')
                                .then( () => {
                                    // RETORNAR JOIN
                                    return this.connection('carrito_item')
                                    .join('carrito', 'carrito.id', '=', 'carrito_item.id_carrito')
                                    .join('productos', 'productos.id', '=', 'carrito_item.id_producto')
                                    .select('*')
                                    .where('id_carrito', carritoEncontrado[0].id)
                                    .then( (join) => {
                                        return join;
                                    }).catch( (e) => {
                                        console.log(`Error en JOIN de tablas: ${e}`);
                                        throw `Error en JOIN de tablas: ${e}`;
                                    });
                                })
                                .catch( (e) => {
                                    console.log(`Error al insertar en tabla: ${e}`);
                                    throw `Error al insertar en tabla: ${e}`;
                                });
                            }
                        })
                        .catch( (e) => {
                            console.log(`Error al leer tabla: ${e}`);
                            throw `Error al leer tabla: ${e}`;
                        });
                    } else {
                        // NO EXISTE CARRITO: AGREGAR CARRITO
                        const idCarrito = v4();
                        return this.connection.insert({id: idCarrito, usuario: usuario}).into('carrito')
                        .then( () => {
                            // AGREGAR NUEVO CARRITO_ITEM ASOCIADO A CARRITO
                            const idCarritoItem = v4();
                            return this.connection.insert({id: idCarritoItem, id_carrito: idCarrito, id_producto: productoEncontrado[0].id, cantidad: 1}).into('carrito_item')
                            .then( () => {
                                // RETORNAR JOIN
                                return this.connection('carrito_item')
                                .join('carrito', 'carrito.id', '=', 'carrito_item.id_carrito')
                                .join('productos', 'productos.id', '=', 'carrito_item.id_producto')
                                .select('*')
                                .where('id_carrito', idCarrito)
                                .then( (join) => {
                                    return join;
                                }).catch( (e) => {
                                    console.log(`Error en JOIN de tablas: ${e}`);
                                    throw `Error en JOIN de tablas: ${e}`;
                                });
                            })
                            .catch( (e) => {
                                console.log(`Error al insertar en tabla: ${e}`);
                                throw `Error al insertar en tabla: ${e}`;
                            });
                        })
                        .catch( (e) => {
                            console.log(`Error al insertar en tabla: ${e}`);
                            throw `Error al insertar en tabla: ${e}`;
                        });
                    }
                })
                .catch( (e) => {
                    console.log(`Error al leer tabla: ${e}`);
                    throw `Error al leer tabla: ${e}`;
                });
            } else {
                // NO EXISTE PRODUCTO:
                return 'not found';
            }
        })
        .catch( (e) => {
            console.log(`Error al leer tabla: ${e}`);
            throw `Error al leer tabla: ${e}`;
        });
    }
    readCarrito(usuario) {
        return this.connection.from('carrito').select('*').where('usuario', usuario)
        .then( (carrito) => {
            if (carrito.length) {
                return carrito;
            } else {
                return 'empty';
            }
        })
        .catch( (e) => {
            console.log(`Error al leer tabla: ${e}`);
            throw `Error al leer tabla: ${e}`;
        });
    }
    deleteCarrito(id, usuario) {
        return this.connection.from('productos').select('*').where('id', id)
        .then( (producto) => {
            const productoEncontrado = producto;
            if (producto.length) {
                // EXISTE PRODUCTO: BUSCAR CARRITO
                return this.connection.from('carrito').select('*').where('usuario', usuario)
                .then( (carrito) => {
                    const carritoEncontrado = carrito;
                    if (carrito.length) {
                        // EXISTE CARRITO: BUSCAR CARRITO_ITEM
                        return this.connection.from('carrito_item').select('*').where('id_carrito', carritoEncontrado[0].id).andWhere('id_producto', productoEncontrado[0].id)
                        .then( (carritoItem) => {
                            if (carritoItem.length) {
                                // EXISTE CARRITO_ITEM: REDUCIR -1 A CANTIDAD DE ITEM
                                return this.connection.from('carrito_item').decrement('cantidad', 1).where('id_carrito', carritoEncontrado[0].id).andWhere('id_producto', productoEncontrado[0].id)
                                .then( () => {
                                    // RETORNAR JOIN
                                    return this.connection('carrito_item')
                                    .join('carrito', 'carrito.id', '=', 'carrito_item.id_carrito')
                                    .join('productos', 'productos.id', '=', 'carrito_item.id_producto')
                                    .select('*')
                                    .where('id_carrito', carritoEncontrado[0].id)
                                    .then( (join) => {
                                        return join;
                                    }).catch( (e) => {
                                        console.log(`Error en JOIN de tablas: ${e}`);
                                        throw `Error en JOIN de tablas: ${e}`;
                                    });
                                })
                                .catch( (e) => {
                                    console.log(`Error al editar tabla: ${e}`);
                                    throw `Error al editar tabla: ${e}`;
                                });
                            } else {
                                return 'not found'
                            }
                        })
                        .catch( (e) => {
                            console.log(`Error al leer tabla: ${e}`);
                            throw `Error al leer tabla: ${e}`;
                        });
                    } else {
                        return 'empty'
                    }
                })
                .catch( (e) => {
                    console.log(`Error al leer tabla: ${e}`);
                    throw `Error al leer tabla: ${e}`;
                });
            } else {
                // NO EXISTE PRODUCTO:
                return 'not found';
            }
        })
        .catch( (e) => {
            console.log(`Error al leer tabla: ${e}`);
            throw `Error al leer tabla: ${e}`;
        });
    }
}