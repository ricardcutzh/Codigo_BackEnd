const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : '192.168.0.2', //ESTE ES EL NOMBRE DE CONTENEDOR EN EL AMBIENTE DE DESARROLLO
    user     : 'root',
    password : 'admin123',
    database : 'banca'
  });

module.exports = connection;