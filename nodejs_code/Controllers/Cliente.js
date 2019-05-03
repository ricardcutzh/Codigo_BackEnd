const conn = require('../Database/db');
var Cuenta = require('../Controllers/Cuenta');
/** FUNCION DE REGISTRO **/
function Registro(req, res) {
    try {
        console.log("-------------------------------------");
        console.log("llamada al Registro");
        console.log(req.body);
        console.log("-------------------------------------");
        var ap = req.body.apellido;
        var cor = req.body.correo;
        var nom = req.body.nombre;
        var pas = req.body.password;
        if (conn) {
            var sql = "INSERT INTO Cliente SET ?";
            var cliente = { Nombre: nom, Apellido: ap, Correo: cor, Password: pas, Activo: 1 };
            var resp = conn.query(sql, cliente, function (error, results, fields) {
                if (error) {
                    res.json({ respuesta: 0 });
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
        console.log("-------------------------------------");
        console.log("llamada al Login");
        console.log(req.body);
        console.log("-------------------------------------");
        var email = req.body.correo;
        var pass = req.body.password;
        if (conn) {
            var sql = "SELECT idCliente as idUsuario FROM Cliente WHERE Correo = ? AND Password = ? AND Activo = 1";
            var params = [email, pass];
            var resp = conn.query(sql, params, function (error, results, fields) {
                if (error) {
                    res.json({ respuesta: 0 });
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
        console.log("-------------------------------------");
        console.log("llamada al Asociar Cuenta");
        console.log(req.body);
        console.log("-------------------------------------");
        if (conn) {
            var sql = "INSERT INTO Asociados SET ?";
            var asociados = { idCliente: user, idSocio: socio };
            conn.query(sql, asociados, function (error, results, fields) {
                if (error) {
                    res.json({ respuesta: 0 });
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
        console.log("-------------------------------------");
        console.log("llamada al Transferir monto");
        console.log(req.body);
        console.log("-------------------------------------");
        var user = req.body.idUsuario;
        var monto = req.body.monto;
        var socio = req.body.idSocio;
        if (conn) {
            var sql = "SELECT * FROM Cuenta WHERE idCliente = ?";
            var params = [user];
            conn.query(sql, params, function (error, results, fields) {
                if (error) {
                    res.json({ respuesta: 0 });
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
                                    res.json({ respuesta: 0 });
                                }
                                else {
                                    var sql2 = "SELECT * FROM Cuenta WHERE idCliente = ?";
                                    var params3 = [socio];
                                    conn.query(sql2, params3, function (error, results, fields) {
                                        if (error) {
                                            res.json({ respuesta: 0 });
                                        }
                                        else {
                                            if (results.length > 0) {
                                                acreditado = Number(results[0].SaldoActual) + Number(monto);
                                                params4 = [acreditado, socio];
                                                sql3 = "UPDATE Cuenta SET SaldoActual = ? WHERE idCliente = ?";
                                                conn.query(sql3, params4, function (error, results, fields) {
                                                    if (error) {
                                                        res.json({ respuesta: 0 });
                                                    }
                                                    else {
                                                        res.json({
                                                            respuesta: 1
                                                        })
                                                    }
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
/*** FUNCION PARA ELIMINAR UNA CUENTA **/
function EliminarCuenta(req, res) {
    try {
        console.log("-------------------------------------");
        console.log("llamada al Eliminar Cuenta");
        console.log(req.body);
        console.log("-------------------------------------");
        iduser = req.body.idUsuario;
        if(conn)
        {
            var sql1 = "UPDATE Cliente SET Activo = 0 WHERE idCliente = ?";
            var params = [iduser];
            conn.query(sql1, params, function(error, results, fields){
                if(error)
                {
                    res.json({
                        respuesta: 0
                    });
                }
                else
                {
                    res.json({
                        respuesta: 1
                    });
                }
            });
        }
        else
        {
            res.json({
                respuesta: 0
            });
        }
    }
    catch (error) {

    }
}
/** EXPORT EL MODULO **/
module.exports = {
    Registro,
    Login,
    AsociarCuenta,
    TransferirMonto,
    EliminarCuenta
}