const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const { generarToken } = require('../utils/jwt');

const login = async (correo, password) => {
    const [rows] = await pool.query(`
        SELECT u.*, r.nombre_rol 
        FROM usuarios u 
        JOIN roles r ON u.FK_id_rol = r.PK_id_rol 
        WHERE u.correo = ?
    `, [correo]);

    if (rows.length === 0) {
        throw { statusCode: 401, message: 'Correo o contraseña incorrectos' };
    }

    const usuario = rows[0];
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
        throw { statusCode: 401, message: 'Correo o contraseña incorrectos' };
    }

    const rol = usuario.FK_id_rol;
    let tipo = 'usuario';
    if (rol === 1) tipo = 'administrador';
    else if (rol === 2) tipo = 'instructor';
    else if (rol === 4) tipo = 'proveedor';

    const token = generarToken({
        id: usuario.PK_id_usuario,
        email: correo,
        rol: usuario.FK_id_rol,
        nombre_rol: usuario.nombre_rol
    });

    const { password: _, ...usuariosinPassword } = usuario;
    return { token, usuario: usuariosinPassword, tabla: tipo };
};

const registro = async (datos, tabla) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(datos.password, salt);
    datos.password = passwordHash;

    let FK_id_rol = 3;
    if (tabla === 'administrador') FK_id_rol = 1;
    else if (tabla === 'instructor') FK_id_rol = 2;
    else if (tabla === 'proveedor') FK_id_rol = 4;

    const [result] = await pool.query(`
        INSERT INTO usuarios (FK_id_rol, tipo_documento, numero_documento, nombre, apellido, sexo, correo, telefono, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [FK_id_rol, datos.tipo_documento, datos.numero_documento, datos.nombre, datos.apellido, datos.sexo, datos.correo, datos.telefono, datos.password]);

    return result;
};

module.exports = { login, registro };