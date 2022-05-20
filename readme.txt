para usar considerar antes: 

1.-crear base de datos//

CREATE DATABASE bancosolar;

2.-crear tablas//

CREATE TABLE usuarios (id SERIAL PRIMARY KEY, nombre VARCHAR(50),
balance FLOAT CHECK (balance >= 0));

CREATE TABLE transferencias (id SERIAL PRIMARY KEY, emisor INT, receptor
INT, monto FLOAT, fecha TIMESTAMP, FOREIGN KEY (emisor) REFERENCES
usuarios(id), FOREIGN KEY (receptor) REFERENCES usuarios(id));

3.-para ejecutar, primero completar campos port y password en el objeto de configuracion 
en el archivo conexiones.js

