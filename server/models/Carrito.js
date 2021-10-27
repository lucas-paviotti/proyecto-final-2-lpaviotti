import { v4 } from "uuid";

export default class Carrito {
    constructor(usuario, producto) {
        this.id = v4();
        this.timestamp = Date.now();
        this.usuario = usuario || v4();
        this.productos = [producto] || [];
    }
    getParsedObject() {
        let parsedJSON = JSON.stringify(this, null, 4);
        return JSON.parse(parsedJSON);
    }
}