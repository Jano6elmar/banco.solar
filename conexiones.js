const { Pool } = require("pg");

const config = {
    user: "postgres",
    host: "localhost",
    password: "",
    database: "bancosolar",
    port: 0000,
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000,
};
    
const pool = new Pool(config);

module.exports = pool;