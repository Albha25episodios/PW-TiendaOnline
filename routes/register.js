var express = require('express');
var router = express.Router();
const modulosDB = require('./libreria');

router.get('/', function(req, res, next) {
    res.render('register');
});

router.post('/', async function(req, res, next){
  const usuario = req.body.identificador;
  const nombre = req.body.nombres;
  const AP = req.body.apellido;
  const dni = req.body.dni;
  const direccion = req.body.direccion;
  const correo = req.body.correo;
  const telefono = req.body.telefono;
  const contrasenia = req.body.contrasena;
  const basedatos = modulosDB.conectar;
  try {
    const [resultadoA, fields] = await modulosDB.buscar_en_tabla(basedatos, 'tcliente', usuario);
    if (resultadoA.length === 0){
      res.render('login');
    }
    else{
      await modulosDB.registrar_usuario(basedatos, 'tcliente', nombre, dni, AP, direccion, correo, telefono, contrasenia);
      req.session.user = usuario;
      res.redirect('/');
    }
  } catch (error) {
    console.error('Error al realizar la consulta:', error.message);
  }
  })
  
module.exports = router;