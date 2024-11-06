const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentación API SOLDI',
      version: '1.0.2',
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'Catálogos',
      description: 'Información general de catálogos',
    },
    // Agrega más tags si es necesario
  ],
//    apis: ['routes/proyectoejecutivo/*.js','routes/suministros/*.js'], 
   apis: ['src/rutas/*.js'], 
//   apis: [`${__dirname}/routes/suministros/controlvales.js`], // Ruta a tus archivos de rutas (endpoints)
};

const specs = swaggerJsdoc(options);

module.exports = specs;
