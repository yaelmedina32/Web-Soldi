const mssql = require('mssql');
const dotenv = require('dotenv');
dotenv.config({path: 'src/.env'});
const conexion = {
    server: process.env.server,
    user: process.env.user,
    password: process.env.pass,
    database: process.env.database,
    trustServerCertificate: true,
    requestTimeout: 130000
}

const conexion2 = {
    server: process.env.server,
    user: process.env.user,
    password: process.env.pass,
    database: process.env.database2,
    trustServerCertificate: true,
    requestTimeout: 130000
}

async function conectarBD(){
    const pool = mssql.connect(conexion);
    return pool;
}

async function conectarBD2(){
    const pool = mssql.connect(conexion2);
    return pool;
}
module.exports = {
    bd: conectarBD(),
    bd2: conectarBD2()
};