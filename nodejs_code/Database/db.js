const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'dbBanca', //ESTE ES EL NOMBRE DE CONTENEDOR EN EL AMBIENTE DE DESARROLLO
    user     : 'root',
    password : 'admin123',
    database : 'banca'
  });

module.exports = connection;