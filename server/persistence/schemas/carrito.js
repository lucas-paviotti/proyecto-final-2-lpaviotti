import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import findOrCreate from 'mongoose-findorcreate';

const CarritoSchema = new Schema({
	timestamp: Date,
	productos: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'productos',
		},
	],
});

CarritoSchema.plugin(findOrCreate);

export default mongoose.model('carrito', CarritoSchema);
