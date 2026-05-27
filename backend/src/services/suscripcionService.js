const db = require('../config/db');

// CONFIGURACIÓN DE DURACIÓN POR PLAN ID (en días)
const DURACIONES_PLAN = {
    1: 30,   // Plan Básico Mensual
    2: 30,   // Plan Premium
    3: 365,  // Plan Anual
    4: 30,   // Plan Funcional
    5: 1     // Plan Diario
};

// Obtener duración real del plan
const getDuracionPlan = (planId) => {
    return DURACIONES_PLAN[planId] || 30;
};

// Obtener todas las suscripciones (para admin)
const obtenerSuscripciones = async () => {
    const [rows] = await db.query(`
        SELECT 
            s.PK_id_suscripcion,
            s.FK_id_usuario,
            s.FK_id_plan,
            s.fecha_inicio,
            s.fecha_vencimiento,
            s.estado,
            s.tipo_menbresia,
            s.precio_suscripcion,
            s.duracion_plan,
            s.fecha_cancelacion,
            s.motivo_cancelacion,
            s.notificacion_vista,
            p.nombre_plan,
            p.precio_plan,
            p.descripcion_plan,
            CONCAT(u.nombre, ' ', IFNULL(u.apellido, '')) AS cliente_nombre,
            u.correo AS cliente_correo,
            u.nombre,
            u.apellido
        FROM Suscripciones s
        INNER JOIN Planes p ON s.FK_id_plan = p.PK_id_Plan
        INNER JOIN Usuarios u ON s.FK_id_usuario = u.PK_id_usuario
        ORDER BY s.PK_id_suscripcion DESC
    `);
    return rows;
};

// Obtener suscripción por usuario (para "Mi Suscripción")
const obtenerSuscripcionPorUsuario = async (idUsuario) => {
    const [rows] = await db.query(`
        SELECT 
            s.PK_id_suscripcion,
            s.FK_id_usuario,
            s.FK_id_plan,
            s.fecha_inicio,
            s.fecha_vencimiento,
            s.estado,
            s.tipo_menbresia,
            s.precio_suscripcion,
            s.duracion_plan,
            s.fecha_cancelacion,
            s.motivo_cancelacion,
            s.notificacion_vista,
            p.nombre_plan,
            p.precio_plan,
            p.descripcion_plan,
            CONCAT(u.nombre, ' ', IFNULL(u.apellido, '')) AS cliente_nombre
        FROM Suscripciones s
        INNER JOIN Planes p ON s.FK_id_plan = p.PK_id_Plan
        INNER JOIN Usuarios u ON s.FK_id_usuario = u.PK_id_usuario
        WHERE s.FK_id_usuario = ?
        AND s.estado != 'Cancelada'
        ORDER BY s.PK_id_suscripcion DESC
        LIMIT 1
    `, [idUsuario]);
    return rows[0] || null;
};

// Crear suscripción (solo admin)
const crearSuscripcion = async (datos) => {
    const { 
        FK_id_usuario, 
        FK_id_plan, 
        fecha_inicio, 
        fecha_vencimiento, 
        estado = 'Activa',
        precio_suscripcion,
        duracion_plan
    } = datos;

    const [result] = await db.query(
        `INSERT INTO Suscripciones (
            FK_id_usuario, FK_id_plan, fecha_inicio, fecha_vencimiento, 
            estado, tipo_menbresia, precio_suscripcion, duracion_plan
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [FK_id_usuario, FK_id_plan, fecha_inicio, fecha_vencimiento, 
         estado, 1001, precio_suscripcion, duracion_plan]
    );
    return { id: result.insertId, ...datos };
};

// Actualizar estado de suscripción
const actualizarEstadoSuscripcion = async (id, estado, motivo = null) => {
    let query = 'UPDATE Suscripciones SET estado = ?';
    let params = [estado];

    if (estado === 'Cancelada') {
        query += ', fecha_cancelacion = NOW()';
    }
    if (motivo) {
        query += ', motivo_cancelacion = ?';
        params.push(motivo);
    }

    query += ' WHERE PK_id_suscripcion = ?';
    params.push(id);

    await db.query(query, params);
    return { id, estado };
};

// Solicitar plan (cliente) - crea en estado "Pendiente de pago"
const solicitarPlan = async (idUsuario, idPlan) => {
    // Obtener datos del plan primero
    const [planRows] = await db.query(
        'SELECT * FROM Planes WHERE PK_id_Plan = ?',
        [idPlan]
    );

    if (planRows.length === 0) {
        throw new Error('Plan no encontrado');
    }

    const plan = planRows[0];
    const duracionDias = getDuracionPlan(idPlan);

    const fechaInicio = new Date();
    const fechaVencimiento = new Date();
    fechaVencimiento.setDate(fechaVencimiento.getDate() + duracionDias);

    const [result] = await db.query(
        `INSERT INTO Suscripciones (
            FK_id_usuario, FK_id_plan, fecha_inicio, fecha_vencimiento, 
            estado, tipo_menbresia, precio_suscripcion, duracion_plan
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            idUsuario, 
            idPlan, 
            fechaInicio.toISOString().split('T')[0], 
            fechaVencimiento.toISOString().split('T')[0],
            'Pendiente de pago', 
            1001, 
            plan.precio_plan, 
            duracionDias
        ]
    );

    return { 
        id_suscripcion: result.insertId, 
        estado: 'Pendiente de pago',
        fecha_inicio: fechaInicio.toISOString().split('T')[0],
        fecha_vencimiento: fechaVencimiento.toISOString().split('T')[0]
    };
};

// Procesar pago y activar suscripción automáticamente
const procesarPago = async (idSuscripcion, idUsuario, metodoPago) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Obtener datos de la suscripción
        const [subs] = await connection.query(
            'SELECT * FROM Suscripciones WHERE PK_id_suscripcion = ? AND FK_id_usuario = ?',
            [idSuscripcion, idUsuario]
        );

        if (subs.length === 0) {
            throw new Error('Suscripción no encontrada');
        }

        const suscripcion = subs[0];

        // 2. Generar número de factura
        const numeroFactura = `FAC-${Date.now()}-${idSuscripcion}`;

        // 3. Crear factura
        await connection.query(
            `INSERT INTO Facturas (
                FK_id_suscripcion, FK_id_usuario, numero_factura, 
                fecha_emision, metodo_pago, total_pagado, devolucion
            ) VALUES (?, ?, ?, NOW(), ?, ?, 0)`,
            [idSuscripcion, idUsuario, numeroFactura, metodoPago, suscripcion.precio_suscripcion]
        );

        // 4. Activar suscripción
        await connection.query(
            'UPDATE Suscripciones SET estado = ? WHERE PK_id_suscripcion = ?',
            ['Activa', idSuscripcion]
        );

        await connection.commit();

        return {
            success: true,
            message: 'Pago procesado y suscripción activada',
            factura: {
                numero_factura: numeroFactura,
                total_pagado: suscripcion.precio_suscripcion,
                metodo_pago: metodoPago
            }
        };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// Cancelar suscripción (cliente)
const cancelarSuscripcion = async (idSuscripcion, idUsuario, motivo) => {
    const [result] = await db.query(
        `UPDATE Suscripciones 
         SET estado = 'Cancelada', 
             fecha_cancelacion = NOW(), 
             motivo_cancelacion = ? 
         WHERE PK_id_suscripcion = ? AND FK_id_usuario = ?`,
        [motivo, idSuscripcion, idUsuario]
    );

    if (result.affectedRows === 0) {
        throw new Error('Suscripción no encontrada o no pertenece al usuario');
    }

    return { success: true, message: 'Suscripción cancelada' };
};

module.exports = {
    obtenerSuscripciones,
    obtenerSuscripcionPorUsuario,
    crearSuscripcion,
    actualizarEstadoSuscripcion,
    solicitarPlan,
    procesarPago,
    cancelarSuscripcion
};