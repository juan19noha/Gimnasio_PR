import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
    FaUsers, FaChalkboardTeacher, FaBox, FaCalendarAlt, 
    FaMoneyBillWave, FaShoppingCart, FaClipboardList, 
    FaFileInvoiceDollar, FaArrowUp, FaArrowDown 
} from 'react-icons/fa';

const DashboardAdmin = () => {
    const [estadisticas, setEstadisticas] = useState({
        totalUsuarios: 0,
        totalInstructores: 0,
        totalProductos: 0,
        totalClases: 0,
        ventasMes: 0,
        comprasMes: 0,
        suscripcionesActivas: 0,
        mensajesNuevos: 0
    });
    const [ultimasVentas, setUltimasVentas] = useState([]);
    const [ultimosUsuarios, setUltimosUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarDashboard();
    }, []);

    const cargarDashboard = async () => {
        try {
            setCargando(true);
            
            // Cargar datos en paralelo
            const [usuariosRes, instructoresRes, productosRes, clasesRes, 
                   ventasRes, comprasRes, suscripcionesRes, contactosRes] = await Promise.all([
                api.get('/usuarios'),
                api.get('/instructores'),
                api.get('/productos'),
                api.get('/clases'),
                api.get('/ventas'),
                api.get('/compras'),
                api.get('/suscripciones'),
                api.get('/contacto')
            ]);

            setEstadisticas({
                totalUsuarios: usuariosRes.data.data?.length || 0,
                totalInstructores: instructoresRes.data.data?.length || 0,
                totalProductos: productosRes.data.data?.length || 0,
                totalClases: clasesRes.data.data?.length || 0,
                ventasMes: ventasRes.data.data?.reduce((sum, v) => sum + (v.total || 0), 0) || 0,
                comprasMes: comprasRes.data.data?.reduce((sum, c) => sum + (c.total_compra || 0), 0) || 0,
                suscripcionesActivas: suscripcionesRes.data.data?.filter(s => s.estado === 'activa').length || 0,
                mensajesNuevos: contactosRes.data.data?.filter(c => !c.leido).length || 0
            });

            // Últimas 5 ventas
            const ventasOrdenadas = ventasRes.data.data?.sort((a, b) => 
                new Date(b.fecha_venta) - new Date(a.fecha_venta)
            ).slice(0, 5) || [];
            setUltimasVentas(ventasOrdenadas);

            // Últimos 5 usuarios registrados
            const usuariosOrdenados = usuariosRes.data.data?.sort((a, b) => 
                new Date(b.fecha_registro) - new Date(a.fecha_registro)
            ).slice(0, 5) || [];
            setUltimosUsuarios(usuariosOrdenados);

        } catch (error) {
            console.error('Error cargando dashboard:', error);
        } finally {
            setCargando(false);
        }
    };

    const tarjetas = [
        { titulo: 'Usuarios', valor: estadisticas.totalUsuarios, icono: <FaUsers />, color: '#FFD700', ruta: '/admin/usuarios' },
        { titulo: 'Instructores', valor: estadisticas.totalInstructores, icono: <FaChalkboardTeacher />, color: '#00C851', ruta: '/admin/instructores' },
        { titulo: 'Productos', valor: estadisticas.totalProductos, icono: <FaBox />, color: '#33b5e5', ruta: '/admin/productos' },
        { titulo: 'Clases', valor: estadisticas.totalClases, icono: <FaCalendarAlt />, color: '#ffbb33', ruta: '/admin/clases' },
        { titulo: 'Ventas del Mes', valor: `$${estadisticas.ventasMes.toLocaleString()}`, icono: <FaMoneyBillWave />, color: '#FFD700', ruta: '/admin/ventas' },
        { titulo: 'Compras del Mes', valor: `$${estadisticas.comprasMes.toLocaleString()}`, icono: <FaShoppingCart />, color: '#ff4444', ruta: '/admin/compras' },
        { titulo: 'Suscripciones', valor: estadisticas.suscripcionesActivas, icono: <FaClipboardList />, color: '#aa66cc', ruta: '/admin/suscripciones' },
        { titulo: 'Mensajes Nuevos', valor: estadisticas.mensajesNuevos, icono: <FaFileInvoiceDollar />, color: '#2BBBAD', ruta: '/admin/contactos' },
    ];

    const styles = {
        container: { padding: '1rem' },
        titulo: { color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' },
        card: (color) => ({
            background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem',
            borderLeft: `4px solid ${color}`, transition: 'transform 0.2s', cursor: 'pointer',
            '&:hover': { transform: 'translateY(-3px)' }
        }),
        cardIcon: (color) => ({ fontSize: '2rem', color: color, marginBottom: '0.75rem' }),
        cardValor: { fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.25rem' },
        cardTitulo: { fontSize: '0.85rem', color: '#888' },
        seccion: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' },
        seccionTitulo: { color: '#FFD700', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
        tabla: { width: '100%', borderCollapse: 'collapse' },
        th: { textAlign: 'left', padding: '0.75rem', color: '#FFD700', fontSize: '0.8rem', borderBottom: '1px solid #333', letterSpacing: '1px' },
        td: { padding: '0.75rem', color: '#888', fontSize: '0.85rem', borderBottom: '1px solid #222' },
        badge: (color) => ({ background: color + '20', color: color, padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }),
        loading: { color: '#FFD700', textAlign: 'center', padding: '3rem' },
    };

    if (cargando) return <AdminLayout><div style={styles.loading}>Cargando dashboard...</div></AdminLayout>;

    return (
        <AdminLayout>
            <div style={styles.container}>
                <h1 style={styles.titulo}>Panel de Administración</h1>
                
                {/* Tarjetas de resumen */}
                <div style={styles.grid}>
                    {tarjetas.map((tarjeta, i) => (
                        <Link key={i} to={tarjeta.ruta} style={{ textDecoration: 'none' }}>
                            <div style={styles.card(tarjeta.color)}>
                                <div style={styles.cardIcon(tarjeta.color)}>{tarjeta.icono}</div>
                                <div style={styles.cardValor}>{tarjeta.valor}</div>
                                <div style={styles.cardTitulo}>{tarjeta.titulo}</div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Últimas ventas */}
                <div style={styles.seccion}>
                    <div style={styles.seccionTitulo}><FaMoneyBillWave /> Últimas Ventas</div>
                    <table style={styles.tabla}>
                        <thead>
                            <tr>
                                <th style={styles.th}>CLIENTE</th>
                                <th style={styles.th}>PRODUCTO</th>
                                <th style={styles.th}>CANTIDAD</th>
                                <th style={styles.th}>TOTAL</th>
                                <th style={styles.th}>FECHA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ultimasVentas.map((venta) => (
                                <tr key={venta.PK_id_venta}>
                                    <td style={styles.td}>{venta.usuario_nombre} {venta.usuario_apellido}</td>
                                    <td style={styles.td}>{venta.nombre_producto}</td>
                                    <td style={styles.td}>{venta.cantidad}</td>
                                    <td style={styles.td}><span style={styles.badge('#FFD700')}>${venta.total?.toLocaleString()}</span></td>
                                    <td style={styles.td}>{new Date(venta.fecha_venta).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {ultimasVentas.length === 0 && (
                                <tr><td colSpan="5" style={{...styles.td, textAlign: 'center', padding: '2rem'}}>No hay ventas registradas</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Últimos usuarios */}
                <div style={styles.seccion}>
                    <div style={styles.seccionTitulo}><FaUsers /> Usuarios Recientes</div>
                    <table style={styles.tabla}>
                        <thead>
                            <tr>
                                <th style={styles.th}>NOMBRE</th>
                                <th style={styles.th}>CORREO</th>
                                <th style={styles.th}>ROL</th>
                                <th style={styles.th}>REGISTRO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ultimosUsuarios.map((usuario) => (
                                <tr key={usuario.PK_id_usuario}>
                                    <td style={styles.td}>{usuario.nombre} {usuario.apellido}</td>
                                    <td style={styles.td}>{usuario.correo}</td>
                                    <td style={styles.td}><span style={styles.badge('#aa66cc')}>{usuario.nombre_rol}</span></td>
                                    <td style={styles.td}>{usuario.fecha_registro ? new Date(usuario.fecha_registro).toLocaleDateString() : 'N/A'}</td>
                                </tr>
                            ))}
                            {ultimosUsuarios.length === 0 && (
                                <tr><td colSpan="4" style={{...styles.td, textAlign: 'center', padding: '2rem'}}>No hay usuarios registrados</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default DashboardAdmin;