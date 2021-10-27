import Persistence from '../persistence/Persistence.js';
import { USER_ID } from '../config/config.js';

const persistencia = new Persistence().connection;

export const addCarrito = async (req, res) => {
    try {
        const { id_producto } = req.params;
        const carrito = await persistencia.createCarrito(id_producto, USER_ID);
        if (carrito == 'not found') {
            return res.status(404).json({error: 'Producto no encontrado.'});
        } else {
            return res.status(200).json(carrito);
        }
    } catch(e) {
        res.status(500).json({error: 'Error al agregar producto en el carrito.'});
        throw `Error al agregar producto en el carrito: ${e}`;
    }
};

export const getCarrito = async (req, res) => {
    try {
        const carrito = await persistencia.readCarrito(USER_ID);
        if (carrito == 'empty') {
            return res.status(200).json({error: 'No hay productos en el carrito.'});
        } else {
            return res.status(200).json(carrito);
        }
    } catch(e) {
        res.status(500).json({error: 'Error al buscar carrito.'});
        throw `Error al buscar carrito: ${e}`;
    }
};

export const deleteCarrito = async (req, res) => {
    try {
        const { id } = req.params;
        const carrito = await persistencia.deleteCarrito(id, USER_ID);
        if (carrito == 'empty') {
            return res.status(200).json({error: 'No hay productos en el carrito.'});
        } else if (carrito == 'not found') {
            return res.status(404).json({error: 'Producto no encontrado.'});
        } else {
            return res.status(200).json(carrito);
        }
    } catch(e) {
        res.status(500).json({error: 'Error al eliminar de carrito.'});
        throw `Error al eliminar de carrito: ${e}`;
    }
};