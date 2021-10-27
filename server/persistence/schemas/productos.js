import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import findOrCreate from 'mongoose-findorcreate';

const ProductosSchema = new Schema({
	nombre: {
		type: String,
		unique: true,
	},
	descripcion: String,
	codigo: String,
	foto: String,
	precio: Number,
	stock: Number,
});

ProductosSchema.plugin(findOrCreate);

export default mongoose.model('producto', ProductosSchema);
