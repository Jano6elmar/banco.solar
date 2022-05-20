const pool = require('./conexiones');

const insertarUsuario = async (datos) => {

    const consulta = {
        text: "INSERT INTO usuarios (nombre,balance) values($1, $2)",
        values: datos
    };

    try {
        const result = await pool.query(consulta);
        return result;
    } catch (error) {
        console.log(error.code);
        return error;
    }
};
const consultarUsuarios = async () => {
    try {
        const result = await pool.query("SELECT * FROM usuarios");
        return result.rows;
    } catch (error) {
        console.log(error.code);
        return error;
    }
};
const insertarTransferencia = async (datos) => {

    const idEmisor = await pool.query( "SELECT id FROM usuarios WHERE nombre like '%"+datos[0] +"%'");

    const idReceptor = await pool.query( "SELECT id FROM usuarios WHERE nombre like '%"+datos[1] +"%'");    
    
    const descontar = {
        text: "UPDATE usuarios SET balance = balance - $1 WHERE id = $2 RETURNING * ;",
        values: [datos[2], idEmisor.rows[0].id],
    }

    const acreditar = {
        text: "UPDATE usuarios SET balance = balance + $1 WHERE id = $2 RETURNING * ;",
        values: [datos[2], idReceptor.rows[0].id],
    }

    const consulta = {
        text: "INSERT INTO transferencias (emisor,receptor,monto,fecha) values($1, $2, $3, NOW())", 
        values: [idEmisor.rows[0].id, idReceptor.rows[0].id, datos[2] ] 
    };

    try {
        await pool.query("BEGIN")
        await pool.query(descontar);
        console.log("saldo descontado");
        await pool.query(acreditar);
        const result = await pool.query(consulta)
        await pool.query("COMMIT")        
        return result;
    } catch (error) {
        console.log(error.code);
        throw error
    }
}

const consultarTransferencia = async () => {
    try {
        const result = await pool.query("SELECT b.nombre as emisor, c.nombre as receptor, a.monto, a.fecha FROM transferencias a INNER JOIN usuarios b ON b.id = a.emisor INNER JOIN usuarios c ON c.id = a.receptor"
        );
        return result.rows;
    } catch (error) {
        console.log(error.code);
        return error;
    }
};

const editarUsuario = async (datos, idUsuario) => {
    const consulta = {
        text: `UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = ${idUsuario} RETURNING *`,
        values: datos,
    };
    try {
        const result = await pool.query(consulta);
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
};

const eliminarUsuario = async (idUsuario) => {

    const result1 = await pool.query(`DELETE FROM transferencias WHERE receptor = '${idUsuario}'`);

    const result2 = await pool.query(`DELETE FROM transferencias WHERE emisor = '${idUsuario}'`);

    const result = await pool.query(`DELETE FROM usuarios WHERE id = '${idUsuario}'`);
    return result;

};



module.exports = {
    insertarUsuario,
    consultarUsuarios,
    insertarTransferencia,
    consultarTransferencia,
    editarUsuario,
    eliminarUsuario
};
