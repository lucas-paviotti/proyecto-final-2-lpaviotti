import * as path from 'path';
const options = {
	client: 'sqlite3',
	connection: {
		filename: path.resolve('src/db', 'ecommerce_coderhouse.sqlite'),
	},
	useNullAsDefault: true,
};

export default options;
