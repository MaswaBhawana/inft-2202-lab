// note, there is also na https library which does the same thing, 
// but we dont do it as we dont have ssl certificates
import http from 'node:http';
import { request } from 'node:https';

// define a constant to decide which port ot run the server on.
// by convention, node developersl like 3000 (this does not actually matter)
const PORT = 3000;

// create a basic request handler
const mainRequestHandler = (request, response, next) => {
    const headers = {'Content-Type': 'text/plain'}
    
    const {url, method} = request;
    console.log(method, url);

    if (url === '/' && method === 'GET'){
        response.writeHead(200, headers);
        response.end('main index');  
    }else if(url === '/hello'){
        response.writeHead(200, headers);
        response.end('hello world!!');
    }
    else{
        response.writeHead(404, headers);
        response.end('not found');
    }

}

// create a new server instance
const server = http.createServer(mainRequestHandler);

// start the server
server.listen(PORT, () => {
    console.log(`server is running on port ${3000}`);
}) 