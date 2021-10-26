import Persistence from '../persistence/Persistence.js'
import { HOST, isAdmin } from '../config/config.js';

const persistencia = new Persistence().connection;

export const addProducto = async (req, res) => {
    if (isAdmin == 'false') {
        return res.status(401).json({ error : -1, descripcion: `ruta http://${HOST}/ método ${req.method} no autorizado.`});
    }

    try {
        const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
        const producto = await persistencia.createProducto(nombre, descripcion, codigo, foto, precio, stock);
        res.status(200).json(producto);
    } catch(e) {
        res.status(500).json({error: 'Error al agregar producto.'});
        throw `Error al agregar producto: ${e}`;
    }
};

export const getProductos = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await persistencia.readProducto(id);
        if (producto == 'not found') {
            return res.status(404).json({error: 'Producto no encontrado.'});
        } else {
            return res.status(200).json(producto);
        }
    } catch(e) {
        res.status(500).json({error: 'Error al buscar productos.'});
        throw `Error al buscar productos: ${e}`;
    }
};

export const updateProducto = async (req, res) => {
    if (isAdmin == 'false') {
        return res.status(401).json({ error : -1, descripcion: `ruta http://${HOST}/ método ${req.method} no autorizado.`});
    }

    try {
        const { id } = req.params;
        const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
        const producto = await persistencia.updateProducto(id, nombre, descripcion, codigo, foto, precio, stock);
        if (producto == 'not found') {
            return res.status(404).json({error: 'Producto no encontrado.'});
        } else {
            return res.status(200).json(producto);
        }
    } catch(e) {
        res.status(500).json({error: 'Error al editar producto.'});
        throw `Error al editar producto: ${e}`;
    }
};

export const deleteProducto = async (req, res) => {
    if (isAdmin == 'false') {
        return res.status(401).json({ error : -1, descripcion: `ruta http://${HOST}/ método ${req.method} no autorizado.`});
    }

    try {
        const { id } = req.params;
        const producto = await persistencia.deleteProducto(id);
        if (producto == 'not found') {
            return res.status(404).json({error: 'Producto no encontrado.'});
        } else {
            return res.status(200).json(producto);
        }
    } catch(e) {
        res.status(500).json({error: 'Error al borrar producto.'});
        throw `Error al borrar producto: ${e}`;
    }
};