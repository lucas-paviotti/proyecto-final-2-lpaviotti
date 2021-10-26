import Persistence from '../persistence/Persistence.js';

const persistencia = new Persistence().connection;

export const addCarrito = async (req, res) => {
    try {
        const { id_producto } = req.params;
        const carrito = await persistencia.createCarrito(id_producto);
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
        const { id } = req.params;
        const carrito = await persistencia.readCarrito(id);
        if (carrito == 'empty') {
            return res.status(200).json({error: 'No hay productos en el carrito.'});
        } else if (carrito == 'not found') {
            return res.status(404).json({error: 'Producto no encontrado.'});
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
        const carrito = await persistencia.deleteCarrito(id);
        if (carrito == 'empty') {
            return res.status(200).json({error: 'No hay productos en el carrito.'});
        } else if (carrito == 'not found') {
            return res.status(404).json({error: 'Producto no encontrado.'});
        } else {
            return res.status(200).json(carrito);
        }
    } catch(e) {
        res.status(500).json({error: 'Error al buscar carrito.'});
        throw `Error al buscar carrito: ${e}`;
    }
};