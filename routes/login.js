var express = require('express');
var router = express.Router();
const modulosDB = require('./libreria');

router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', async function(req, res, next){
  const usuario = req.body.identificador;
  const basedatos = modulosDB.conectar;
  try {
    const [resultadoA, fields] = await modulosDB.buscar_usuario(basedatos, usuario);
    console.log(resultadoA);
    if (resultadoA.length === 0){
      res.render('login');
    }
    else{
      req.session.user = usuario;
      res.redirect('/');
    }
  } catch (error) {
    console.error('Error al realizar la consulta:', error.message);
  }
})

module.exports = router;
