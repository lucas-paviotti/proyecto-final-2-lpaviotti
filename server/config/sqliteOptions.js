import * as path from 'path';
const options = {
	client: 'sqlite3',
	connection: {
		filename: path.resolve('db', 'ecommerce.sqlite'),
	},
	useNullAsDefault: true,
};

export default options;
