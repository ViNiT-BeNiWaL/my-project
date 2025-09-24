const http = require('http');

function handler3(req, res)  {
 res.statusCode = 200;
 res.setHeader('Content-Type', 'application/json');
 res.end(JSON.stringify({data:'Hello, World!'}));
}
const handler1=function(req, res)  {
 res.statusCode = 200;
 res.setHeader('Content-Type', 'text/plain');
 res.end('Hello, World!\n');
}
const handler2=(req, res) => {
 res.statusCode = 200;
 res.setHeader('Content-Type', 'text/plain');
 res.end('Hello, World!\n');
}//anonymous function

const server = http.createServer(handler3);

const port = 3000;
server.listen(port, () => {
 console.log(`Server running at http://localhost:${port}/`);
});