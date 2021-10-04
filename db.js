const { Sequelize, DataTypes, Transaction } = require('sequelize');
const config = require('./db.config');
const mysql = require('mysql2/promise');

async function createDb(){
    const connection  = await mysql.createConnection({
        host: config.HOST,
        port: config.PORT,
        user: config.USER,
        password: config.PASSWORD,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.DB};`)
    // Safe to use sequelize now
}

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: 0,
    logging: false,
    // logging: console.log,
    define: {
        freezeTableName: config.define.freezeTableName,
    },
    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle,
    },
});

(async function init() {
    try {
        await sequelize.authenticate();
        console.log('database connected 😃');
    } catch (err) {
        console.log('error in db connection 😥', err);
        console.log('creating databse...');
        try {
            createDb();
            init();
            console.log('please restart node ...');
        } catch (err){
            console.log('error 😥😥😥');
            process.exit()
        }
    }
})();

const db = {
    sequelize: sequelize,
    Sales: require('./model')(sequelize, DataTypes),
    Sequelize: Sequelize,
    Transaction: Transaction,
    // DataTypes: DataTypes,
};

module.exports = db;