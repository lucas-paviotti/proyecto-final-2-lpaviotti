import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import findOrCreate from 'mongoose-findorcreate';

const ProductosSchema = new Schema({
	timestamp: Date,
	nombre: {
		type: String,
		unique: true,
	},
	descripcion: String,
	codigo: String,
	foto: String,
	precio: String,
	stock: String,
});

ProductosSchema.plugin(findOrCreate);

export default mongoose.model('productos', ProductosSchema);
