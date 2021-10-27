import { MONGO_LOCAL_URL as localUrl, MONGO_ATLAS_URL as atlasUrl } from './config.js';

const config = {
	localUrl,
	atlasUrl,
	options: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
};

export default config;