const http = require("http");
const fs = require("fs");
const url = require('url');

const { 
    insertarUsuario, 
    consultarUsuarios, 
    insertarTransferencia,
    consultarTransferencia, 
    editarUsuario,
    eliminarUsuario 
} = require("./consultas")

http.createServer(async (req, res) => {

    if (req.url == "/" && req.method === "GET") {
        res.setHeader("content-type", "text/html");
        const html = fs.readFileSync("index.html", "utf8");
        res.end(html);
    }

    if ((req.url.startsWith("/usuarios") && req.method == "POST")) {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", async () => {
            const datos = Object.values(JSON.parse(body));//transforma el objeto en arreglo
            console.log(datos)
            const respuesta = await insertarUsuario(datos);
            res.end(JSON.stringify(respuesta));// con esto me aseguro que termina
        });
    }

    if (req.url.startsWith("/usuarios") && req.method === "GET" ) {
        const registros = await consultarUsuarios();
        res.end(JSON .stringify(registros));
    }
    
     if ((req.url.startsWith("/transferencia") && req.method == "POST" )) {        
        let body = "" ;
        req.on( "data" , (chunk) => {
            body += chunk;
        });
        req.on( "end" , async () => {
            const datos = Object.values(JSON.parse(body));
            console.log("ID", datos)
            const respuesta = await insertarTransferencia(datos);
            res.end(JSON.stringify(respuesta));
        });
    }   

    if (req.url == "/transferencias" && req.method === "GET" ) {
        const registros = await consultarTransferencia();
        res.end(JSON .stringify(registros));
    }

    if (req.url.startsWith("/usuarios") && req.method == "PUT" ) {            
        const idUsuario = url.parse(req.url,true).query.id;
        let body = "" ;
            req.on( "data" , (chunk) => {
                body += chunk;
            });            
            req.on( "end" , async () => {
                const datos = Object.values( JSON.parse(body));
                const respuesta = await editarUsuario(datos,idUsuario);
                res.end(JSON.stringify(respuesta));
            });
    }

    if (req.url.startsWith( "/usuarios" ) && req.method == "DELETE" ) {
        const idUsuario = url.parse(req.url,true).query.id;
        const respuesta = await eliminarUsuario(idUsuario);
        res.end( JSON.stringify(respuesta));
    }  



}).listen(3000, () => console.log("Servidor corriendo en puerto 3000"));