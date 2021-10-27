import fsDAO from "../dao/fs.dao.js";
import mysqlDAO from "../dao/mysql.dao.js";
import sqlite3DAO from "../dao/sqlite3.dao.js";
import mongodbDAO from "../dao/mongodb.dao.js";
import firebaseDAO from "../dao/firebase.dao.js";
import mySqlOptions from "../config/mySqlOptions.js";
import sqliteOptions from "../config/sqliteOptions.js";
import mongoDbOptions from "../config/mongoDbOptions.js";
import { PERSISTENCE } from '../config/config.js';

export default class Persistence {
    constructor() {
        this.id = PERSISTENCE || 0;
        this.connection = this.id == 0 ? new fsDAO() 
                        : this.id == 1 ? new mysqlDAO(mySqlOptions) 
                        : this.id == 2 ? new sqlite3DAO(sqliteOptions) 
                        : this.id == 3 ? new mongodbDAO(mongoDbOptions.localUrl, mongoDbOptions.options) 
                        : this.id == 4 ? new mongodbDAO(mongoDbOptions.atlasUrl, mongoDbOptions.options) 
                        : this.id == 5 ? new firebaseDAO()
                        : new fsDAO();
    }
}