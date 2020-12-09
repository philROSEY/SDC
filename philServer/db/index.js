const mysql = require('mysql');

const conn = mysql.createConnection({
    host: '3.17.141.94',
    user: 'root',
    password: 'password',
    port: '3306',
    database: 'SDC'
})

conn.connect((err) => {
    if (err) {
        console.log('ERROR CONECTING TO DB:', err.message)
    } else {
        console.log('we have connected to the SDC db')
    }
})

module.exports = conn