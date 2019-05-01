var express = require('express');
var cons = require('./Database/db');
cons.connect();

//ESTE ES UN COMENTARIO
var app = express();

//UTILIZANO EL BODY PARSER
var bodyparser = require('body-parser');

//SETEANDO EL BODY PARSER
app.use(bodyparser());

//TRAYENDO LAS RUTAS DEFINIDAS
var routes = require('./Routes/routes');
app.use('/', routes);

var server = app.listen(8000, function(){
    console.log("Escuchando en puerto 8000");
});