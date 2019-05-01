const conn = require('../Database/db');
var Cuenta = require('../Controllers/Cuenta');
/** FUNCION DE REGISTRO **/
function Registro(req, res) {
    try {
        var ap = req.body.apellido;
        var cor = req.body.correo;
        var nom = req.body.nombre;
        var pas = req.body.password;
        if (conn) {
            var sql = "INSERT INTO Cliente SET ?";
            var cliente = { Nombre: nom, Apellido: ap, Correo: cor, Password: pas, Activo: 1 };
            var resp = conn.query(sql, cliente, function (error, results, fields) {
                if (error) {
                    throw error;
                }
                else {
                    Cuenta.NuevaCuenta(results.insertId)
                    res.json({
                        respuesta: 1
                    });
                }
            });
        }
        else {
            res.json({
                respuesta: 0
            });
        }
    }
    catch (error) {
        res.json({
            respuesta: 0
        });
    }
}

function Login(req, res) {
    try {
        var email = req.body.correo;
        var pass = req.body.password;
        if (conn) {
            var sql = "SELECT idCliente as idUsuario FROM Cliente WHERE Correo = ? AND Password = ?";
            var params = [email, pass];
            var resp = conn.query(sql, params, function (error, results, fields) {
                if (error) {
                    throw error;
                }
                else {
                    if (results.length == 1) {
                        res.json({
                            respuesta: 1,
                            idUsuario: results[0].idUsuario
                        });
                    }
                    else {
                        res.json({
                            respuesta: 0
                        });
                    }
                }
            });
        }
        else {
            res.json({
                respuesta: 0
            });
        }
    }
    catch (error) {
        res.json({
            respuesta: 0
        });
    }
}
/** FUNCION PARA ASOCIAR UN SOCIO CON UN CLIENTE **/
function AsociarCuenta(req, res) {
    try {
        user = req.body.idUsuario;
        socio = req.body.idSocio;
        if (conn) {
            var sql = "INSERT INTO Asociados SET ?";
            var asociados = { idCliente: user, idSocio: socio };
            conn.query(sql, asociados, function (error, results, fields) {
                if (error) {
                    throw error;
                }
                else {
                    res.json({
                        respuesta: 1
                    });
                }
            });
        }
        else {
            res.json({
                respuesta: 0
            });
        }
    }
    catch (Error) {
        res.json({
            respuesta: 0
        });
    }
}
/** FUNCION PARA TRANSFERIR MONTO DE UNA CUENTA  A OTRA **/
function TransferirMonto(req, res) {
    try {
        var user = req.body.idUsuario;
        var monto = req.body.monto;
        var socio = req.body.idSocio;
        if (conn) {
            var sql = "SELECT * FROM Cuenta WHERE idCliente = ?";
            var params = [user];
            conn.query(sql, params, function (error, results, fields) {
                if (error) {
                    throw error;
                }
                else {
                    if (results.length > 0) {
                        x = Number(results[0].SaldoActual);
                        if (monto <= x) {
                            nuevo = Number(results[0].SaldoActual) - monto;
                            aux = Number(results[0].SaldoActual);
                            params2 = [nuevo, user];
                            sql1 = "UPDATE Cuenta SET SaldoActual = ? WHERE idCliente = ?";
                            conn.query(sql1, params2, function (error, results, fields) {
                                if (error) {
                                    throw error;
                                }
                                else {
                                    var sql2 = "SELECT * FROM Cuenta WHERE idCliente = ?";
                                    var params3 = [socio];
                                    conn.query(sql2, params3, function (error, results, fields) {
                                        if (error) {
                                            throw error;
                                        }
                                        else {
                                            if(results.length>0)
                                            {
                                                acreditado = Number(results[0].SaldoActual) + Number(monto);
                                                params4 = [acreditado, socio];
                                                sql3 = "UPDATE Cuenta SET SaldoActual = ? WHERE idCliente = ?";
                                                conn.query(sql3, params4, function(error, results, fields){
                                                    if(error)
                                                    {
                                                        throw error;
                                                    }
                                                    else
                                                    {
                                                        res.json({
                                                            respuesta:1
                                                        })
                                                    }
                                                });
                                            }
                                            else
                                            {
                                                res.json({
                                                    respuesta : 0
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            res.json({
                                respuesta: 0
                            });
                        }
                    }
                    else {
                        res.json({
                            respuesta: 0
                        });
                    }
                }
            });
        }
        else {
            res.json({
                respuesta: 0
            });
        }
    }
    catch (error) {
        res.json({
            respuesta: 0
        });
    }
}
/** EXPORT EL MODULO **/
module.exports = {
    Registro,
    Login,
    AsociarCuenta,
    TransferirMonto
}