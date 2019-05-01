var express = require('express');
var Cliente = require('../Controllers/Cliente');
var Cuenta = require('../Controllers/Cuenta');

//DEFINIENDO EL ENRUTADOR
var router = express.Router();

/*RUTA DE INICIO PARA CHEQUEAR QUE TODO ESTA BIEN*/
router.route('/').get(function (req, res) {
    res.json({
        status:'API Up and Running!',
        author:'Ricardo Cutz Hernandez'
    });
});

/** RUTA DE REGISTRO  **/
router.route('/registro').post(Cliente.Registro);
/** RUTA PARA EL LOGIN **/
router.route('/login').post(Cliente.Login);
/** RUNTA PARA CONSULTAR EL SALDO DE CUENTA **/
router.route('/saldo').post(Cuenta.ConsultaSaldo);
/** RUTA PARA ACREDITAR EL SALDO **/
router.route('/acreditar').post(Cuenta.AcreditarSaldo);
/** RUNTA PARA DEBITAR EL SALDO **/
router.route('/debitar').post(Cuenta.DebitarSaldo);
/** RUTA PARA ASOCIAR CON UN CLIENTE **/
router.route('/asociar_cuenta').post(Cliente.AsociarCuenta);
/** RUTA PARA TRANSFERIR CON MONTO DE UNA CUENTA A OTRO**/
router.route('/transferir').post(Cliente.TransferirMonto);
/** RUTA QUE DEVUELVE LAS CUENTAS NO ASOCIADAS **/
router.route('/cuentas_no_asociadas').post(Cuenta.CuentasNoAsociadas);
/** RUTA QUE DEVUELVE LAS CUENTAS ASOCIADAS AL USUARIO **/
router.route('/cuentas_asociadas').post(Cuenta.CuentasAsociadas);
/***********************/

/*SI SE CONSULTA UNA API QUE NO EXISTE EN LA API*/
router.route('*').get(function (req, res){
    res.json({
        status:'API Route not found....'
    });
});

module.exports = router;