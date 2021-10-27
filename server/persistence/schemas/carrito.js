import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import findOrCreate from 'mongoose-findorcreate';

const CarritoSchema = new Schema({
	usuario: Number,
	productos: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'producto',
		},
	],
});

CarritoSchema.plugin(findOrCreate);

export default mongoose.model('carrito', CarritoSchema);
