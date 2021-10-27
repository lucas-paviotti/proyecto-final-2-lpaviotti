import knex from 'knex';
import Producto from '../models/Producto.js';
import Carrito from '../models/Carrito.js';

export default class mysqlDAO {
    constructor() {

    }
    createProducto() {
        let { title, price, thumbnail } = req.body;
        let producto = new Producto(title,price,thumbnail,uuidv4());
        knexMariaDB.insert({id: producto.id, title: producto.title, price: producto.price, thumbnail: producto.thumbnail}).into('productos')
        .then( () => {
            if (response) {
                res.status(200).json(producto);
            } else {
                res.status(404).json({error: 'No se encontró producto con ese ID.'});
            }
        })
        .catch( (e) => {
            console.log(`Error al insertar: ${e}`);
            res.status(500).json({error: 'No se pudo agregar el producto.'});
        });
    }
    readProducto(id) {
        let { id } = req.params;
        knexMariaDB.from('productos').select('*').where('id', id)
        .then( (response) => {
            if (response.length) {
                res.status(200).json(response);
            } else {
                res.status(404).json({error: 'No se encontró producto con ese ID.'});
            }
        })
        .catch( (e) => {
            console.log(`Error al seleccionar desde tabla: ${e}`);
            res.status(500).json({error: 'No se encontró producto con ese ID.'});
        });
    }
    updateProducto() {
        let { id } = req.params;
        let { title, price, thumbnail } = req.body;
        knexMariaDB.from('productos').where('id', id).update({title: title, price: price, thumbnail: thumbnail})
        .then( (response) => {
            if (response) {
                res.status(200).json({id: id, title: title, price: price, thumbnail: thumbnail});
            } else {
                res.status(404).json({error: 'No se encontró producto con ese ID.'});
            }
        })
        .catch( (e) => {
            console.log(`Error al editar: ${e}`);
            res.status(500).json({error: 'No se pudo editar el producto.'});
        });
    }
    deleteProducto() {
        let { id } = req.params;
        knexMariaDB.from('productos').where('id', id).del()
        .then( (response) => {
            if (response) {
                res.status(200).json(`Objeto id: ${id} eliminado correctamente`);
            } else {
                res.status(404).json({error: 'No se encontró producto con ese ID.'});
            }
        })
        .catch( (e) => {
            console.log(`Error al eliminar: ${e}`);
            res.status(500).json({error: 'No se pudo eliminar el producto.'});
        });
    }
}