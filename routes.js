const fs = require('fs');

class RequestHandler {
    constructor(connection) {
        this.connection = connection
    }

    toHandle(req, res) {
        switch (req.method) {
            case 'GET':
                this.get(req, res);
                break;
            case 'POST':
                this.post(req, res);
                break;
            case 'DELETE':
                this.delete(req, res);
                break;
            case 'PUT':
                this.put(req, res);
                break;
            default:
                throw new Error('Unknown method')
        }
    }

    get(req, res) {
        if (req.url === '/') {
            fs.readFile('./index.html', 'utf8', (err, data) => {
                if (err) throw err;

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            })
        } else if (req.method === 'GET') {
            this.connection.query('SELECT * FROM fruits;', (err, result) => {
                if (err) throw err;

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            })
        }
    }

    post(req, res) {
        let data = '';

        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            let fruit = JSON.parse(data);
            this.connection.query(`INSERT INTO fruits(name) VALUES ('${fruit.name}');`, (err, result) => {
                if (err) throw err;

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ id: result.insertId, name: fruit.name }));
            })
        })
    }

    delete(req, res) {
        const ulrParts = req.url.split('/')
        const id = ulrParts[ulrParts.length - 1];
        this.connection.query(`DELETE FROM fruits WHERE id = ${id};`, (err, result) => {
            if (err) throw err;

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        })
    }

    put(req, res) {
        let data = '';

        req.on('data', chunk => data += chunk.toString());
        req.on('end', () => {
            let fruit = JSON.parse(data);
            this.connection.query(`UPDATE fruits SET name = '${fruit.name}' WHERE id = ${fruit.id};`, (err, result) => {
                if (err) throw err;

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            })
        })
    }

}

module.exports = RequestHandler;