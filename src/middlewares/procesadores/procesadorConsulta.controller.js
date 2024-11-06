const conectarBD = require('../Conexion/conexionBD');
const procesado = {
    consulta: async function consultar(consulta){
        try{
            const pool = await conectarBD.bd;
            const resultado = await pool.request().query(consulta);
            return resultado.recordsets[0];
        }catch(error){
            if(error){
                console.log(error);
                return error;
            }
        }
    }
    ,
    ejecucion: async function ejecutar(consulta){
        try{
            const pool = await conectarBD.bd;
            const resultado = await pool.request().query(consulta);
            return resultado.rowsAffected[0];
        }catch(error){
            if(error){
                console.log(error);
                return error;
            }
        }
    }
}

const procesarConsulta2 = async (consulta) => {
    try{
        const pool = await conectarBD.bd2;
        const resultado = await pool.request().query(consulta);
        return resultado.rowsAffected[0];
    }catch(error){
        if(error){
            console.log(error);
            return error;
        }
    }
}

module.exports = {
    procesado: procesado,
    procesado2: procesarConsulta2
};