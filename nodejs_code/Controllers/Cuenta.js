const conn = require('../Database/db');
var rand = require('randomstring');
// FUNCION DE CREACION DE CUENTA
function NuevaCuenta(idCuenta)
{
    try
    {
        
        if(conn)
        {
            var sql = "INSERT INTO Cuenta SET ?";
            var cuenta = {NumeroCuenta: rand.generate(10), SaldoActual:0, idCliente: idCuenta};
            var resp = conn.query(sql, cuenta, function(error, results, fields){
                if(error)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            });
        }
        else
        {
            return false;
        }
    }
    catch(error)
    {
        return false;
    }
}
/** FUNCION PARA CONSULTAR EL SALDO DE LA CUENTA **/
function ConsultaSaldo(req, res)
{
    try
    {
        var iduser = req.body.idUsuario;
        if(conn)
        {
            var sql = "SELECT SaldoActual as saldo FROM Cuenta WHERE idCliente = ?";
            var params = [iduser];
            conn.query(sql, params, function(error, results, fields){
                if(error)
                {
                    res.json({
                        saldo:0
                    });
                }
                else
                {
                    if(results.length > 0)
                    {
                        res.json({
                            saldo: results[0].saldo
                        });
                    }
                    else
                    {
                        res.json({
                            saldo:0
                        });
                    }
                }
            });
        }
        else
        {
            res.json({
                saldo:0
            });
        }
    }
    catch(error)
    {
        res.json({
            saldo: 0 
        });
    }
}
/** FUNCION PARA PODER ACREDITAR A LA CUENTA **/
function AcreditarSaldo(req, res)
{
    try
    {
        var monto = req.body.monto;
        var user = req.body.idUsuario;
        if(conn)
        {
            var sql = "SELECT * FROM Cuenta WHERE idCliente = ?";
            var params = [user];
            conn.query(sql, params, function(error, results, fields){
                if(error)
                {
                    res.json({
                        respuesta : 0
                    });
                }
                else
                {
                    // ACREDITAR A LA CUENTA
                    if(results.length > 0)
                    {
                        nuevo = Number(results[0].SaldoActual) + Number(monto);
                        params2 = [nuevo, user]
                        sql = "UPDATE Cuenta SET SaldoActual = ? WHERE idCliente = ?";
                        conn.query(sql, params2, function(error, results, fields){
                            if(error)
                            {
                                throw error;
                            }
                            else
                            {
                                res.json({
                                    respuesta : 1
                                });
                            }
                        });
                    }
                    else
                    {
                        res.json({
                            respuesta:0
                        });
                    }
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
    catch(error)
    {
        res.json({
            respuesta:0
        });
    }
}
/** FUNCION PARA PODER DEBITAR A LA CUENTA **/
function DebitarSaldo(req, res)
{
    try
    {
        var monto = req.body.monto;
        var user = req.body.idUsuario;
        if(conn)
        {
            var sql = "SELECT * FROM Cuenta WHERE idCliente = ?";
            var params = [user];
            conn.query(sql, params, function(error, results, fields){
                if(error)
                {
                    throw error;
                }
                else
                {
                    // DEBITAR A LA CUENTA
                    if(results.length > 0)
                    {
                        x = Number(results[0].SaldoActual);
                        monto = Number(monto);
                        if(monto<=x)
                        {
                            nuevo = Number(results[0].SaldoActual) - monto;
                            params2 = [nuevo, user]
                            sql = "UPDATE Cuenta SET SaldoActual = ? WHERE idCliente = ?";
                            conn.query(sql, params2, function(error, results, fields){
                                if(error)
                                {
                                    throw error;
                                }
                                else
                                {
                                    res.json({
                                        respuesta : 1
                                    });
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
                    else
                    {
                        res.json({
                            respuesta:0
                        });
                    }
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
    catch(error)
    {
        res.json({
            respuesta : 0
        });
    }
}
/** FUNCION PARA DEVOLVER LAS CUENTAS NO ASOCIADAS AL USUARIO **/
function CuentasNoAsociadas(req, res)
{
    try
    {
        var idusuario = req.body.idUsuario;
        if(conn)
        {
            var sql = "SELECT distinct Cliente.idCliente, Cliente.Correo FROM Cliente WHERE Cliente.idCliente != 10 AND Cliente.idCliente NOT IN (SELECT Distinct Cliente.idCliente as Id FROM Cliente, Asociados WHERE Asociados.idCliente = ? AND Cliente.idCliente = Asociados.idSocio)"
            var params = [idusuario];
            conn.query(sql, params, function(error, results, fields){
                if(error)
                {
                    throw error;
                }
                else
                {
                    res.json({
                        cuentas : results
                    })
                }
            });
        }
        else
        {
            res.json({
                cuentas : results
            })
        }
    }
    catch(error)
    {
        res.json({
            cuentas: [
                {}
            ]
        });
    }
}
/** FUNCION PARA DEVOLVER LAS CUENTAS ASOCIADAS **/
function CuentasAsociadas(req, res)
{
    try
    {
        var idusuario = req.body.idUsuario;
        if(conn)
        {
            var sql = "SELECT distinct Cliente.idCliente, Cliente.Correo FROM Cliente, Asociados WHERE Asociados.idCliente = ? AND Cliente.idCliente = Asociados.idSocio"
            var params = [idusuario];
            conn.query(sql, params, function(error, results, fields){
                if(error)
                {
                    throw error;
                }
                else
                {
                    res.json({
                        cuentas:results
                    });
                }
            });
        }
        else
        {
            res.json({
                cuentas:[
                    {}
                ]
            });
        }
    }
    catch(error)
    {
        res.json({
            cuentas:[
                {}
            ]
        });
    }
}
module.exports = {
    NuevaCuenta,
    ConsultaSaldo,
    AcreditarSaldo,
    DebitarSaldo,
    CuentasNoAsociadas,
    CuentasAsociadas
}