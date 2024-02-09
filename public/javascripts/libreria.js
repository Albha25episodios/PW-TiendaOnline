const mysql = require('mysql2');

module.exports = {
    conectar: mysql.createConnection({
        host: 'localhost',     
        user: 'root',   
        password: '182932', 
        database: 'DB_Huellitas',
    }),
    buscar_usuario: (conect, id) => {
        return conect.promise().execute(`SELECT * from tcliente where DNICliente = '${id}';`);
    },
    registrar_usuario: (conect, nombre, dni, AP, direccion, correo, telefono, contrasenia) => {
        return conect.promise().execute(`insert into tCliente 
        (DNICliente, contrasenia, Nombres, Apellidos, CorreoElectronico, Telefono) values (
        '${dni}', '${contrasenia}', '${nombre}', '${AP}', '${correo}', '${direccion}', '${telefono}');`);
    }
}