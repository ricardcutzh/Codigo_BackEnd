var express = require('express');

while(true)
{
    try
    {
        var cons = require('./Database/db');
        cons.connect();
        break;
    }
    catch(error)
    {

    }
}

//ESTE ES UN COMENTARIO
var app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

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