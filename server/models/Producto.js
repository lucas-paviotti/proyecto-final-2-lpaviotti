import { v4 } from "uuid";

export default class Producto {
    constructor(nombre, descripcion, codigo, foto, precio, stock) {
        this.id = v4();
        this.timestamp = Date.now();
        this.nombre = nombre || '';
        this.descripcion = descripcion || '';
        this.codigo = codigo || '';
        this.foto = foto || '';
        this.precio = precio || 0;
        this.stock = stock || 0;
    }
    getParsedObject() {
        let parsedJSON = JSON.stringify(this, null, 4);
        return JSON.parse(parsedJSON);
    }
}