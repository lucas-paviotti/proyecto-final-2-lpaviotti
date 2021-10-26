import { v4 } from "uuid";

export default class Carrito {
    constructor(producto) {
        this.id = v4();
        this.timestamp = Date.now();
        this.productos = [producto] || [];
    }
    getParsedObject() {
        let parsedJSON = JSON.stringify(this, null, 4);
        return JSON.parse(parsedJSON);
    }
}