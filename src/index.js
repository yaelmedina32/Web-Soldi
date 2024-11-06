const express = require('express');
const fileUpload = require('express-fileupload');
const rutaInserciones = require('./rutas/ruta.route');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger'); 

const app = express();

app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '200mb'}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin'
    + ', X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

app.set('trust proxy', true);

app.use('/api', rutaInserciones);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
	customSiteTitle: 'API Documentación - API Soldi',
	customCss: '.swagger-ui .topbar { background-color: #3498db; }', // Cambia el color de la barra superior
	customJs: './custom.js', // Ruta al archivo JavaScript personalizado
  }));

app.listen(4500, ()=>{
    console.log("escuchando en en el puerto 4500");
});
