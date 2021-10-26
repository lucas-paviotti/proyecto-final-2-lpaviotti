import * as dotenv from 'dotenv';
import sqliteOptions from './sqliteOptions.js';
import mySqlOptions from './mySqlOptions.js';
import mongoDbConfigs from './mongoDbOptions.js';

dotenv.config();

export const { PORT, NODE_ENV: envType, HOST, ADMIN: isAdmin, PERSISTENCE } = process.env;
export const configs = { sqliteOptions, mySqlOptions, mongoDbConfigs };