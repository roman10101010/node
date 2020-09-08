const http = require('http');
const PORT = process.env.PORT || 3000;
const mysql = require('mysql');
const RequestHandler = require('./routes');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    password: 'user13134',
    user: 'root',
    database: 'fruits',
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected')
});

const handler = new RequestHandler(connection)

http.createServer((req, res) => {
    handler.toHandle(req, res)
}).listen(PORT)

