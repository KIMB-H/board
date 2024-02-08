const mysql = require('mysql');
const dbconfig = require('../config/dbconfig.json');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database
});
pool.getConnection((err, conn) => {

    if (err) console.log("err : " + err);
    else {
        console.log("conn : " + conn);
    }
    conn.release();
})

module.exports = pool;