import * as dotenv from 'dotenv';

dotenv.config();

export const { 
    PORT, 
    NODE_ENV: envType, 
    HOST, 
    ADMIN: isAdmin, 
    PERSISTENCE,
    USER_ID,
    MONGO_LOCAL_URL,
    MONGO_ATLAS_URL
} = process.env;