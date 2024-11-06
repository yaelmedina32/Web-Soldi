const express = require('express');
const rutas = express.Router();
const procesado = require('../middlewares/procesadores/procesadorConsulta.controller');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const devolverConsulta = require('../middlewares/procesadores/devolverConsulta.controller');
const verificar = require('../middlewares/Validadores/validador.router');

dotenv.config({path: 'src/.env'});


function procesarArchivo(archivo, datosCliente, apartado){
    if(!datosCliente.nombres || !datosCliente.apellidos || datosCliente.nombres == '' || datosCliente.apellidos == ''){
        return { nombresvacios: true };
    }
    let nombreArchivo = archivo.name.includes('.pdf') ? 
    archivo.name.split('.')[0] + '_' + datosCliente.nombres.split(' ').reduce((acumulador, actual) => acumulador + actual, '') 
        + datosCliente.apellidos.split(' ').reduce((acumulador, actual) => acumulador + actual, '') + '.pdf'
        : archivo.name.split('.')[0] + '_' + datosCliente.nombres.split(' ').reduce((acumulador, actual) => acumulador + actual, '') 
        + datosCliente.apellidos.split(' ').reduce((acumulador, actual) => acumulador + actual, '');

    archivo.mv(`./Curriculums${apartado}/` + nombreArchivo, err=>{
        if(err) return {error: err};
    });
    return nombreArchivo;
}


/**
 * @swagger
 * /api/unete:
 *   post:
 *     summary: Unete
 *     tags:
 *       - Unete
 *     parameters:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                apellidos:
 *                  type: string(50)
 *                  example: Perez Hernandez
 *                  required: true
 *                nombres:
 *                  type: string(50)
 *                  example: Juan Manuel
 *                  required: true
 *                genero:
 *                  type: string(50)
 *                  example: Hombre
 *                fechanacimiento:
 *                  type: string(50)
 *                  example: '20010723'
 *                calle:
 *                  type: string(100)
 *                  example: 'Calle Jerez #143'
 *                fraccionamiento:
 *                  type: string(100)
 *                  example: 'El jerez'
 *                codigopostal:
 *                  type: string(50)
 *                  example: '20789'
 *                ciudad:
 *                  type: string(100)
 *                  example: Aguascalientes
 *                email:
 *                  type: string(100)
 *                  example: perez_hernandez@hotmail.com
 *                  required: true
 *                telefono:
 *                  type: string(50)
 *                  example: 4497894562
 *                  required: true
 *                celular:
 *                  type: string(50)
 *                  example: 4497894562
 *                estudios:
 *                  type: string(250)
 *                  example: Licenciatura
 *                carrera:
 *                  type: string(250)
 *                  example: Sistemas
 *                institucion:
 *                  type: string(250)
 *                  example: UAA
 *                fechainicioestudios:
 *                  type: string(50)
 *                  example: 2019
 *                fechafinestudios:
 *                  type: string(50)
 *                  example: 2023
 *                idiomas:
 *                  type: string(100)
 *                  example: Inglés
 *                certificaciones:
 *                  type: string(100)
 *                  example: TOEFL, TICS
 *                areainteres:
 *                  type: string(500)
 *                  example: Procesos y TI
 *                puesto:
 *                  type: string(100)
 *                  example: Programación
 *                empresa:
 *                  type: string(100)
 *                  example: La huerta
 *                estadoempresa:
 *                  type: string(100)
 *                  example: Aguascalientes
 *                fechainiciolaboral:
 *                  type: string(100)
 *                  example: 2022
 *                fechafinlaboral:
 *                  type: string(100)
 *                  example: 2023
 *                area:
 *                  type: string(100)
 *                  example: Sistemas
 *                industria:
 *                  type: string(100)
 *                  example: Alimentos
 *                cursos:
 *                  type: string(100)
 *                  example: Programación Básica
 *                actividades:
 *                  type: string(250)
 *                  example: Mantenimiento sistemas
 *                tiposolicitud:
 *                  type: string(50)
 *                  example: Tiempo Completo
 *                curriculum:
 *                  type: string(100)
 *                  example: Curriculum.pdf
 *             required:
 *               - valor
 *     responses:
 *        200:
 *         description: Ok.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 200
 *                     mensaje:
 *                       type: string
 *                       example: Datos Insertados Correctamente
 *        417:
 *         description: Nombre y/o apellidos vacíos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 417
 *                     mensaje:
 *                       type: string
 *                       example: Error en los nombres y/o apellidos. Campos vacíos
 *        406:
 *         description: Error del cliente, caracteres excedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 406
 *                     mensaje:
 *                       type: string
 *                       example: Caractéres máximos permitidos del atributo "atributo" excedidos
 *        500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 500
 *                     mensaje:
 *                       type: string
 *                       example: Error converting data 'int' to 'string'
 * 
*/

rutas.post('/unete', verificar, async(req,res) => {
    const datos = req.body;
    let nombreArchivo = ""
    if(!req.files){
        nombreArchivo = "N/A";
    }else{
        let auxiliar = procesarArchivo(req.files.curriculum, datos, 'Unete');
        if(auxiliar.error){
            return res.status(500),send({mensaje: "Error en el servidor", error: error});
        }
        if(auxiliar.nombresvacios){
            return res.status(417).send({ mensaje: "Error en los nombres y/o apellidos. Campos vacíos", error: "Nombres/Apellidos vacíos" });
        }
        nombreArchivo = auxiliar;
    }
    //YA VALIDADOS LOS DATOS, ENTONCES AHORA SÍ INSERTO LOS DATOS
    datos.apellidos = datos.apellidos.trim()
    datos.nombres = datos.nombres.trim();
    consulta = `
    insert into webUnete (fecha,fechacorreo,apellidos,nombres,genero,fechanacimiento,calle,fraccionamiento,
    codigopostal,ciudad,email,telefono,celular,estudios,carrera,institucion,fechainicioestudios,fechafinestudios,idiomas,
    certificaciones,areainteres,puesto,empresa,estadoempresa,fechainiciolaboral,fechafinlaboral,area,industria,cursos,actividades,
    tiposolicitud,curriculum, estatus
    ) values (
        GETDATE(), GETDATE(), 
        ${!datos.apellidos ? "'" + datos.apellidos + "'" : null },
        ${!datos.nombres ? "'" + datos.nombres + "'" : null },
        ${!datos.genero ? "'" + datos.genero + "'" : null },
        ${!datos.fechanacimiento ? "'" + datos.fechanacimiento + "'" : null },
        ${!datos.calle ? "'" + datos.calle + "'" : null },
        ${!datos.fraccionamiento ? "'" + datos.fraccionamiento + "'" : null },
        ${!datos.codigopostal ? "'" + datos.codigopostal + "'" : null },
        ${!datos.ciudad ? "'" + datos.ciudad + "'" : null },
        ${!datos.email ? "'" + datos.email + "'" : null },
        ${!datos.telefono ? "'" + datos.telefono + "'" : null },
        ${!datos.celular ? "'" + datos.celular + "'" : null },
        ${!datos.estudios ? "'" + datos.estudios + "'" : null },
        ${!datos.carrera ? "'" + datos.carrera + "'" : null },
        ${!datos.institucion ? "'" + datos.institucion + "'" : null },
        ${!datos.fechainicioestudios ? "'" + datos.fechainicioestudios + "'" : null },
        ${!datos.fechafinestudios ? "'" + datos.fechafinestudios + "'" : null },
        ${!datos.idiomas ? "'" + datos.idiomas + "'" : null },
        ${!datos.certificaciones ? "'" + datos.certificaciones + "'" : null },
        ${!datos.areainteres ? "'" + datos.areainteres + "'" : null },
        ${!datos.puesto ? "'" + datos.puesto + "'" : null },
        ${!datos.empresa ? "'" + datos.empresa + "'" : null },
        ${!datos.estadoempresa ? "'" + datos.estadoempresa + "'" : null },
        ${!datos.fechainiciolaboral ? "'" + datos.fechainiciolaboral + "'" : null },
        ${!datos.fechafinlaboral ? "'" + datos.fechafinlaboral + "'" : null },
        ${!datos.area ? "'" + datos.area + "'" : null },
        ${!datos.industria ? "'" + datos.industria + "'" : null },
        ${!datos.cursos ? "'" + datos.cursos + "'" : null },
        ${!datos.actividades ? "'" + datos.actividades + "'" : null },
        ${!datos.tiposolicitud ? "'" + datos.tiposolicitud + "'" : null },
        ${nombreArchivo == 'N/A' ? null : "'" + nombreArchivo + "'"},
        1
    );`;
        const resultado = devolverConsulta(procesado.procesado.ejecucion(consulta));
        resultado.then((response) => {
            if(response.name == 'RequestError'){
                return res.json({mensaje: "Error en el servidor", error: response.message, estatus: 500});
            }        
            if(resultado == 0){
                return res.status(200).send({ status: 204, mensaje: "No se insertó ningún registro" });
            }
            return res.json({columnasAfectadas: response, status:200, mensaje:'Ok'});
        })
});

/**
 * @swagger
 * /api/asociate:
 *   post:
 *     summary: Asociate
 *     tags:
 *       - Asociate
 *     parameters:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                tiporegistro:
 *                  type: string
 *                  example: "1(Contratista) - 0(Territorio) (SOLO LOS NUMEROS)"
 *                apellidos:
 *                  type: string
 *                  example: Hernandez Medina
 *                nombres:
 *                  type: string
 *                  example: Pedro Pascal
 *                razonsocial:
 *                  type: string
 *                  example: Calle de las Huertas, 2, 28012 - San Miguel, México
 *                contacto:
 *                  type: string
 *                  example: Pedro Javier Hernandez Perez
 *                email:
 *                  type: string
 *                  example: pedro_javier@hotmail.com
 *                telefono:
 *                  type: string
 *                  example: 4497896543
 *                celular:
 *                  type: string
 *                  example: 4497894561
 *                ciudad:
 *                  type: string
 *                  example: Aguascalientes
 *                estado:
 *                  type: string
 *                  example: Aguascalientes
 *                tipocontratista:
 *                  type: string
 *                  example: Edificación
 *                superficieofrecida:
 *                  type: string
 *                  example: 1500.00
 *                vocacionterreno:
 *                  type: string
 *                  example: Medio Residencial
 *                curriculum:
 *                  type: file
 *                  example: Curriculum.pdf
 *             required:
 *               - valor
 *     responses:
 *        200:
 *         description: Ok.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 200
 *                     mensaje:
 *                       type: string
 *                       example: Datos Insertados Correctamente
 *        417:
 *         description: Nombre y/o apellidos vacíos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 417
 *                     mensaje:
 *                       type: string
 *                       example: Error en los nombres y/o apellidos. Campos vacíos
 *        406:
 *         description: Error del cliente, caracteres excedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 406
 *                     mensaje:
 *                       type: string
 *                       example: Caractéres máximos permitidos del atributo "atributo" excedidos
 *        500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 500
 *                     mensaje:
 *                       type: string
 *                       example: Error converting data 'int' to 'string'
 * 
*/

rutas.post('/asociate', verificar, async(req,res) => {
    const datos = req.body;
    let nombreArchivo = ""
    if(!req.files){
        nombreArchivo = "N/A";
    }else{
        let auxiliar = procesarArchivo(req.files.curriculum, datos, 'Asociate');
        if(auxiliar.error){
            return res.status(500),send({mensaje: "Error en el servidor", error: error});
        }
        if(auxiliar.nombresvacios){
            return res.status(417).send({ mensaje: "Error en los nombres y/o apellidos. Campos vacíos", error: "Nombres/Apellidos vacíos" });
        }
        nombreArchivo = auxiliar;
    }
    datos.nombres = datos.nombres.trim();
    datos.apellidos = datos.apellidos.trim();
    consulta = `insert into webAsociate (fecha,fechacorreo,tiporegistro,apellidos,nombres,razonsocial,contacto,email,
    telefono,celular,ciudad,estado,tipocontratista,superficieofrecida,vocacionterreno,curriculum,estatus)
        values (GETDATE(), GETDATE(),${!datos.tiporegistro ? "'" + datos.tiporegistro + "'" : null },
        ${!datos.apellidos ? "'" + datos.apellidos + "'" : null },
        ${!datos.nombres ? "'" + datos.nombres + "'" : null },
        ${!datos.razonsocial ? "'" + datos.razonsocial + "'" : null },
        ${!datos.contacto ? "'" + datos.contacto + "'" : null },
        ${!datos.email ? "'" + datos.email + "'" : null },
        ${!datos.telefono ? "'" + datos.telefono + "'" : null },
        ${!datos.celular ? "'" + datos.celular + "'" : null },
        ${!datos.ciudad ? "'" + datos.ciudad + "'" : null },
        ${!datos.estado ? "'" + datos.estado + "'" : null },
        ${!datos.tipocontratista ? "'" + datos.tipocontratista + "'" : null },
        ${!datos.superficieofrecida ? "'" + datos.superficieofrecida + "'" : null },
        ${!datos.vocacionterreno ? "'" + datos.vocacionterreno + "'" : null },
        ${nombreArchivo == "N/A" ? null : "'" + nombreArchivo + "'" },
        1
    )`
    const resultado = devolverConsulta(procesado.procesado.ejecucion(consulta))
    resultado.then((response) => {
        if(response.name == 'RequestError'){
            return res.json({mensaje: "Error en el servidor", error: response.message, estatus: 500});
        }
        
        if(resultado == 0){
            return res.status(200).send({ status: 204, mensaje: "No se insertó ningún registro" });
        }
        return res.json({columnasAfectadas: response, status:200, mensaje:'Ok'});
    });
});

/**
 * @swagger
 * /api/perfilate:
 *   post:
 *     summary: Perfílate
 *     tags:
 *       - Perfil de nuevos clientes
 *     parameters:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paternos:
 *                 type: string
 *                 example: Ortiz
 *               maternos:
 *                 type: string
 *                 example: Ramirez
 *               nombres:
 *                 type: string
 *                 example: Pedro Javier
 *               email:
 *                 type: string
 *                 example: pedrohernandez@hotmail.com
 *               telefono:
 *                 type: string
 *                 example: 4497856321
 *               celular:
 *                 type: string
 *                 example: 4494531248
 *               nss:
 *                 type: string
 *                 example: 1254986
 *               ciudad:
 *                 type: string
 *                 example: Aguascalientes
 *               estado:
 *                 type: string
 *                 example: Aguascalientes
 *               nivelingresos:
 *                 type: string
 *                 example: 12000
 *               fraccionamientodeseado:
 *                 type: string
 *                 example: Reserva San Matías
 *               modelo:
 *                 type: string
 *                 example: Marbella
 *               deseacita:
 *                 type: string
 *                 example: Sí
 *             required:
 *               - valor
 *     responses:
 *        200:
 *         description: Ok.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 200
 *                     mensaje:
 *                       type: string
 *                       example: Datos Insertados Correctamente
 *        204:
 *         description: Ok, sin campos afectados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 204
 *                     mensaje:
 *                       type: string
 *                       example: No se insertó ningún campo
 *        417:
 *         description: Nombre y/o apellidos vacíos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 417
 *                     mensaje:
 *                       type: string
 *                       example: Error en los nombres y/o apellidos. Campos vacíos
 *        406:
 *         description: Error del cliente, caracteres excedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 406
 *                     mensaje:
 *                       type: string
 *                       example: Caractéres máximos permitidos del atributo "atributo" excedidos
 *        500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 500
 *                     mensaje:
 *                       type: string
 *                       example: Error converting data 'int' to 'string'
 * 
*/

rutas.post('/perfilate', verificar, (req,res) => {
    const datos = req.body;
    datos.maternos = datos.maternos.trim();
    datos.paternos = datos.paternos.trim();
    datos.nombres = datos.nombres.trim();
    let consulta = `
    exec ('use spvnet200; insert into cliente 
    (ApellidoMaterno,  ApellidoPaterno, Nombre, NSS, CorreoElectronico,
    TelefonoContacto, TelefonoCelular, ApellidoMaternoConyuge, ApellidoPaternoConyuge, AsesorId, CURP, 
    EstadoCivilId, EstatusId, FechaAlta, FechaAtencion, FechaNacimiento,
    LugarNacimiento, MontoCredito, NombreConyuge, Observaciones,
    PaisId, RFC, TelefonoOtro, TipoClienteId, TurnoId, ClienteId) 
            values(
                ${!datos.maternos ? "''" + datos.maternos + "''" : "''''" },
                ${!datos.paternos ? "''" + datos.paternos + "''" : "''''" },
                ${!datos.nombres ? "''" + datos.nombres + "''" : "''''" },
                ${!datos.nss ? "''" + datos.nss + "''" : "''''" },
                ${!datos.email ? "''" + datos.email + "''" : "''''" },
                ${!datos.telefono ? "''" + datos.telefono + "''" : "''''" },
                ${!datos.celular ? "''" + datos.celular + "''" : "''''" },
                '''',  
                '''',  
                0,  
                '''',  
                0,  
                0,  
                '''',  
                '''',  
                '''',  
                '''',  
                0,  
                '''',  
                '''',  
                0,  
                '''',  
                '''',  
                0,  
                0,  
                (select max(clienteid) + 1 from cliente )
            );') at [SOLDIAPP];
    exec('use spvnet200; set identity_insert clientePerfil on; insert into clientePerfil (ClientePerfilId,
        AcercamientoId,
        CapacidadCrediticiaId,
        ClienteId,
        EstatusId,
        FraccionamientoId,
        InteresCompraId,
        LugarProspectacionId,
        LugarTrabajoId,
        ModeloId,
        NivelIngresoId,
        PuestoId,
        TipoCreditoId)
        values (
            (select max(clienteperfilid) + 1 from clientePerfil),
            4,
            0,
            (select max(clienteid) from cliente),
            3,
            isnull((select max(f.fraccionamientoId) from frentes f
            inner join lotes l on l.frenteId = f.frenteId
            inner join fraccionamientos fr on fr.fraccionamientoId = f.fraccionamientoId
            where fr.nombre like ''%${datos.fraccionamientodeseado}%'' and modeloId  = (select max(mf.modeloid) from modelosxfraccionamiento mf
                where mf.modeloid in 
                    (select distinct modeloId from fraccionamientos fr 
                    inner join frentes f on f.fraccionamientoId = fr.fraccionamientoId and f.tipo = ''F''
                    inner join lotes l on l.frenteId = f.frenteId
                    where fr.nombre like ''%${datos.fraccionamientodeseado}%''
                    and mf.fraccionamientoid in (select fraccionamientoid from fraccionamientos where nombre like ''%${datos.fraccionamientodeseado}%'')
                    and mf.nombrecomercial like ''%${datos.modelo}%''))),0),
            2,
            4, --MÓDULO DE INFORMACIÓN
            0,
            isnull((select max(mf.modeloid) from modelosxfraccionamiento mf
            where mf.modeloid in 
                (select distinct modeloId from fraccionamientos fr 
                inner join frentes f on f.fraccionamientoId = fr.fraccionamientoId and f.tipo = ''F''
                inner join lotes l on l.frenteId = f.frenteId
                where fr.nombre like ''%${datos.fraccionamientodeseado}%'') 
                and mf.fraccionamientoid in (select fraccionamientoid from fraccionamientos where nombre like ''%${datos.fraccionamientodeseado}%'')
                and mf.nombrecomercial like ''%${datos.modelo}%''),0),
            0,
            0,
            0) set identity_insert clientePerfil off;') at [SOLDIAPP];
        exec('use spvnet200; set identity_insert clienteMedio on; insert into clienteMedio (
            ClienteMedioId, ClienteId, MedioId, EstatusId
        ) values(
            (select max(clientemedioid) + 1 from clienteMedio),
            (select max(clienteid) from cliente),
            11,3
        ); set identity_insert clienteMedio on;') at [SOLDIAPP];
        `;
    devolverConsulta(procesado.procesado.ejecucion(consulta)).then((result) =>{
        consulta = `
        if not exists (select * from clientes where nombre like '%${!datos.nombres  ?  datos.nombres  : null }%' 
        and paterno like '%${!datos.paternos ? datos.paternos : null }%' and materno like '%${!datos.maternos ? datos.maternos : null }%')
        begin
            insert into clientes (nombre, paterno, materno, email, telefonoCasa, celular, 
                afiliacion, ciudadid, estadoid, ingresos, fraccionamientoid, modeloid, tipocliente )
            values(
                ${!datos.nombres ? "'" + datos.nombres + "'" : null },
                ${!datos.paternos ? "'" + datos.paternos + "'" : null },    
                ${!datos.maternos ? "'" + datos.maternos + "'" : null },
                ${!datos.email ? "'" + datos.email + "'" : null },
                ${!datos.telefono ? "'" + datos.telefono + "'" : null },
                ${!datos.celular ? "'" + datos.celular + "'" : null },
                ${!datos.nss ? "'" + datos.nss + "'" : null },
                (select ciudadid from ciudades where nombre like '%${!datos.ciudad ? datos.ciudad.trim() : null }%'),
                (select estadoid from estados where nombre like '%${!datos.estado ? datos.estado.trim() : null }%'),
                ${!datos.nivelingresos ? "'" + datos.nivelingresos + "'" : null },
                (select max(fraccionamientoid) from fraccionamientos where nombre like 
                    '%$${!datos.fraccionamientodeseado ? datos.fraccionamientodeseado : null }%'),
                (select modeloid from modelosxfraccionamiento mf 
                    inner join fraccionamientos f on f.fraccionamientoId = mf.fraccionamientoid
                    where nombrecomercial like '%${datos.modelo}%' and f.nombre like '%${datos.fraccionamientodeseado}%'), 'Prospecto')
        end
        insert into webPerfilate(fecha, fechacorreo, 
            paternos, 
            maternos,
            nombres,
            email,
            telefono,
            celular,
            nss,
            ciudad,
            estado,
            nivelingresos,
            fraccionamientodeseado,
            modelo,
            deseacita,
            estatus,
            clienteid,
            asesorid)
            values (GETDATE(), GETDATE(), ${!datos.paternos ? "'" + datos.paternos + "'" : null },
            ${!datos.maternos ? "'" + datos.maternos + "'" : null },
            ${!datos.nombres ? "'" + datos.nombres + "'" : null },
            ${!datos.email ? "'" + datos.email + "'" : null },
            ${!datos.telefono ? "'" + datos.telefono + "'" : null },
            ${!datos.celular ? "'" + datos.celular + "'" : null },
            ${!datos.nss ? "'" + datos.nss + "'" : null },
            ${!datos.ciudad ? "'" + datos.ciudad + "'" : null },
            ${!datos.estado ? "'" + datos.estado + "'" : null },
            ${!datos.nivelingresos ? "'" + datos.nivelingresos + "'" : null },
            ${!datos.fraccionamientodeseado ? "'" + datos.fraccionamientodeseado + "'" : null },
            ${!datos.modelo ? "'" + datos.modelo + "'" : null },
            ${!datos.deseacita ? "'" + datos.deseacita + "'" : null },
            1,
            (select max(clienteid) from clientes),
            4
            );`
                devolverConsulta(procesado.procesado.consulta(consulta)).then((response)=> {
                    if(result.name == 'RequestError'){
                        return res.json({mensaje: "Error en el servidor", error: result.message, estatus: 500});
                    }
                    if(result == 0){
                        return res.status(200).send({ status: 204, mensaje: "No se insertó ningún registro" });
                    }
                    return res.json({columnasAfectadas: result, status:200, mensaje:'Ok'});
                })
        })
});

/**
 * @swagger
 * /api/contacto:
 *   post:
 *     summary: Contácto
 *     tags:
 *       - Contáctanos
 *     parameters:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                nombre:
 *                  type: string(150)
 *                  example: Pedro Javier Cortes Jimenez
 *                telefono:
 *                  type: string(15)
 *                  example: 453789410
 *                email:
 *                  type: string(80)
 *                  example: pedro_javier@gmail.com
 *                mensaje:
 *                  type: string(max)
 *                  example: Quiero Informes acerca de sus casas en San Matías.
 *             required:
 *               - valor
 *     responses:
 *        200:
 *         description: Ok.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 200
 *                     mensaje:
 *                       type: string
 *                       example: Datos Insertados Correctamente
 *        204:
 *         description: Ok, sin campos afectados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 204
 *                     mensaje:
 *                       type: string
 *                       example: No se insertó ningún campo
 *        417:
 *         description: Nombre y/o apellidos vacíos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 417
 *                     mensaje:
 *                       type: string
 *                       example: Error en los nombres y/o apellidos. Campos vacíos
 *        406:
 *         description: Error del cliente, caracteres excedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 406
 *                     mensaje:
 *                       type: string
 *                       example: Caractéres máximos permitidos del atributo "atributo" excedidos
 *        500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 500
 *                     mensaje:
 *                       type: string
 *                       example: Error converting data 'int' to 'string'
 * 
*/

rutas.post('/contacto', verificar, async(req,res)=>{
    const datos = req.body;
    datos.nombre = datos.nombre.trim();
    const consulta = `insert into webContacto (nombre,
        telefono,
        email,
        mensaje,
        fecha)
        values(
            ${!datos.nombre  ? "'" + datos.nombre + "'" : null},
            ${!datos.telefono  ? "'" + datos.telefono + "'" : null},
            ${!datos.email  ? "'" + datos.email + "'" : null},
            ${!datos.mensaje  ? "'" + datos.mensaje + "'" : null},
        getDate())`
    
    const resultado = await procesado.procesado.ejecucion(consulta);    
    if(resultado.name == 'RequestError'){
        return res.json({mensaje: "Error en el servidor", error: resultado.message, estatus: 500});
    }
    let envioDatos = nodemailer.createTransport({
        host: process.env.host,
        port: 587,
        secure: false,
        auth: {
            user: process.env.correo,
            pass: process.env.contra
        },
        tls: {
            ciphers:'SSLv3'
        }
    });
    let mensaje = {
        from: '"Contacto Grupo Soldi" ' + process.env.correo,
        to: process.env.correo,
        subject: "Correo de prueba desde API NODEJS",
        text: `Este es un correo de contacto con la siguiente información.

        - Nombre del solicitante: ${datos.nombre}

        - Correo del solicitante: ${datos.email}

        - Teléfono del solicitante: ${datos.telefono}

        - Mensaje: ${datos.mensaje}
        
        


        Puede consultar los datos de este cliente dentro del sistema "SpvNet2".
        `
    };
    envioDatos.sendMail(mensaje, function(error, info){
        if(error){
        }else{
        }
    })
    if(resultado == 0){
        return res.status(200).send({ status: 204, mensaje: "No se insertó ningún registro" });
    }
    return res.json({columnasAfectadas: resultado, status:200, mensaje:'Ok'});
});

/**
 * @swagger
 * /api/postventa:
 *   post:
 *     summary: Postventa
 *     tags:
 *       - Postventa
 *     parameters:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                apellidos:
 *                  type: string
 *                  example: Hernandez Perez
 *                nombres:
 *                  type: string
 *                  example: Pedro Javier
 *                asunto:
 *                  type: string
 *                  example: Problemas de fontanería
 *                fraccionamiento:
 *                  type: string
 *                  example: Porta Arvena
 *                calle:
 *                  type: string
 *                  example: Arvenales
 *                telefono:
 *                  type: string
 *                  example: 4491234568
 *                celular:
 *                  type: string
 *                  example: 4491234568
 *                email:
 *                  type: string
 *                  example: pedro_javier@hotmail.com
 *                ciudad:
 *                  type: string
 *                  example: Jesús María
 *                estado:
 *                  type: string
 *                  example: Aguascalientes
 *                mensaje:
 *                  type: string
 *                  example: Ya no jala la tapadera de mi baño
 *             required:
 *               - valor
 *     responses:
 *        200:
 *         description: Ok.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 200
 *                     mensaje:
 *                       type: string
 *                       example: Datos Insertados Correctamente
 *        204:
 *         description: Ok, sin campos afectados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 204
 *                     mensaje:
 *                       type: string
 *                       example: No se insertó ningún campo
 *        417:
 *         description: Nombre y/o apellidos vacíos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 417
 *                     mensaje:
 *                       type: string
 *                       example: Error en los nombres y/o apellidos. Campos vacíos
 *        406:
 *         description: Error del cliente, caracteres excedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 406
 *                     mensaje:
 *                       type: string
 *                       example: Caractéres máximos permitidos del atributo "atributo" excedidos
 *        500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: number
 *                       example: 500
 *                     mensaje:
 *                       type: string
 *                       example: Error converting data 'int' to 'string'
 * 
*/

rutas.post('/postventa', verificar, async(req,res)=> {
    const datos = req.body;
    if(!datos.fraccionamiento || datos.fraccionamiento == ''){
        return res.status(400).send({ mensaje: "El fraccionamiento debe contener campos" });
    }
    datos.apellidos = datos.apellidos.trim();
    datos.nombres = datos.nombres.trim();
    const consulta = `
    insert into webPostventa (fecha, fechacorreo, apellidos,
        nombres,
        asunto,
        fraccionamiento,
        calle,
        telefono,
        celular,
        email,
        mensaje,
        estatus,
        folioVenta, ventaid)
        values(
            getDate(),
            getDate(),
            '${datos.apellidos}',
            '${datos.nombres}',
            '${datos.asunto}',
            '${datos.fraccionamiento}',
            '${datos.calle}',
            '${datos.telefono}',
            '${datos.celular}',
            '${datos.email}',
            '${datos.mensaje}',
            0,
            isnull((select folioventa from ventas v 
                inner join lotes l on l.loteId = v.loteId
                inner join clientes c on c.clienteId = v.clienteId
                where c.nombre like '%${datos.nombres.trim()}%' 
                and rtrim(c.paterno) + ' ' + rtrim(c.materno) like '%${datos.apellidos.trim()}%' and v.cancelada = 0
                and fraccionamientoid in (select fraccionamientoid from fraccionamientos where nombre like '%${datos.fraccionamiento}%')), 0),
            isnull((select folioventa from ventas v 
                inner join lotes l on l.loteId = v.loteId
                inner join clientes c on c.clienteId = v.clienteId
                where c.nombre like '%${datos.nombres.trim()}%' 
                and rtrim(c.paterno) + ' ' + rtrim(c.materno) like '%${datos.apellidos.trim()}%' and v.cancelada = 0
                and fraccionamientoid in (select fraccionamientoid from fraccionamientos where nombre like '%${datos.fraccionamiento}%')), 0));
            if(select isnull(v.ventaid, 0) from ventas v
                inner join lotes l on l.loteId = v.loteId
                inner join clientes c on c.clienteId = v.clienteId
                where c.nombre like '%nicasio omar%'
                and fraccionamientoid in (select fraccionamientoid from fraccionamientos where nombre like '%Reserva San Matías%')
                and rtrim(c.paterno) + ' ' + rtrim(c.materno) like '%Garcia Arreola%' and v.cancelada = 0) != 0
            begin
                insert into solicitudesPostventa (folio, fechasolicitud, ventaid, concepto, responsableid, ot, telefono) values
                (
                    (select max(folio) + 1 from solicitudesPostventa),
                    getDate(),
                    isnull((select v.ventaid from ventas v 
                        inner join lotes l on l.loteId = v.loteId
                        inner join clientes c on c.clienteId = v.clienteId
                        where c.nombre like '%${datos.nombres.trim()}%' 
                        and rtrim(c.paterno) + ' ' + rtrim(c.materno) like '%${datos.apellidos.trim()}%' and v.cancelada = 0
                        and fraccionamientoid in (select fraccionamientoid from fraccionamientos where nombre like '%${datos.fraccionamiento}%')), 0),
                    '',
                    111,
                    (select max(ot) + 1 from solicitudesPostventa),
                    ${datos.celular}
                ); 
            end`;
            console.log(consulta);
    const resultado = await procesado.procesado.ejecucion(consulta);
    if(resultado.name == 'RequestError'){
        return res.json({mensaje: "Error en el servidor", error: resultado.message, estatus: 500});
    }
    return res.json({columnasAfectadas: resultado, status:200, mensaje:'Ok'});
});

rutas.get('/prueba', verificar, async(req,res)=>{
	return res.json({mensaje: "jalando"});
});

module.exports = rutas;