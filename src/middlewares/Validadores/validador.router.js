const express = require('express');
const app = express();
const procesado = require('../procesadores/procesadorConsulta.controller');
const devolverPromesa = require('../procesadores/devolverConsulta.controller');
app.use(express.urlencoded({extended:false}));
app.use(express.json());

const patron =  /[^a-zA-Z0-9-_ \u00C0-\u025E]/g;
const verifica = express.Router();
const verificar = verifica.use((req, res, next) => {
    const datos = req.body;
    console.log(req.originalUrl)
    const auxiliar = req.originalUrl.split('/');
    console.log(auxiliar);
    auxiliar.shift();
    let consulta = `select COLUMN_NAME columna, DATA_TYPE tipo , CHARACTER_MAXIMUM_LENGTH maximo 
    from INFORMATION_SCHEMA.COLUMNS where table_name = 'web${auxiliar[1]}'`;
    const promesa =  devolverPromesa(procesado.procesado.consulta(consulta));
    promesa.then((valor) => {
        let columnasTruncadas = [];
        let arregloCaracteres = []
        //SACO LOS ATRIBUTOS DE LOS DATOS DEL BODY Y LOS ITERO
        Object.keys(datos).forEach(columna => {
            if(patron.test(datos[columna] && columna.toLocaleLowerCase() != 'email')  || datos[columna].includes("'")){
                arregloCaracteres.push(datos[columna]);
            }
            //EN BASE A LA INFORMACIÓN, ENTONCES ES COMO VALIDO EL TAMAÑO DE LOS STRINGS
            const indice = valor.findIndex( element => element.columna == columna);
            if(indice != -1){
                if(datos[columna].length > valor[indice]['maximo'] && valor[indice]['maximo'] != -1) {
                    columnasTruncadas.push(columna);
                }
            }

        });
        if(arregloCaracteres.length > 0){
            return res.status(406).send({mensaje: "No se aceptan caracteres especiales", status: 406});
        }
        if(columnasTruncadas.length > 0){
            let columnasAux = "";
            columnasTruncadas.forEach(element => {
                columnasAux += element + ",";
            });
            columnasAux = columnasAux.substring(0, columnasAux.length - 1);
            return res.status(406).send({ status: 406, error: `Caractéres máximos del atributo "${columnasAux}" excedidos.` });
        }
      next();
    })
});
module.exports = verificar
