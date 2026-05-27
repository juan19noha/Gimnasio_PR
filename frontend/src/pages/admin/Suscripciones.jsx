import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaSearch, FaCheck, FaTimes } from 'react-icons/fa';

const Suscripciones = () => {
    const [suscripciones, setSuscripciones] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        cargarSuscripciones();
    }, []);

    const cargarSuscripciones = async () => {
        try {
            setCargando(true);
            const { data } = await api.get('/suscripciones');
            setSuscripciones(data.data || []);
        } catch (error) {
            console.error('Error cargando suscripciones:', error);
        } finally {
            setCargando(false);
        }
    };

    const suscripcionesFiltradas = suscripciones.filter(s => 
        (s.cliente_nombre || '').toLowerCase().includes(busqueda.toLowerCase()) || 
        (s.nombre_plan || '').toLowerCase().includes(busqueda.toLowerCase()) ||
        (s.cliente_correo || '').toLowerCase().includes(busqueda.toLowerCase())
    );

    const cambiarEstado = async (id, nuevoEstado) => {
        try {
            setCargando(true);
            await api.put(`/suscripciones/${id}/estado`, { estado: nuevoEstado });
            setMensaje(`Suscripción ${nuevoEstado === 'Activa' ? 'activada' : 'desactivada'} correctamente`);
            cargarSuscripciones();
            setTimeout(() => setMensaje(''), 2000);
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al cambiar estado');
        } finally {
            setCargando(false);
        }
    };

    const getEstadoColor = (estado) => {
        switch(estado) {
            case 'Activa': return '#00C851';
            case 'Pendiente de pago': return '#ffbb33';
            case 'Vencida': return '#ff4444';
            case 'Cancelada': return '#ff4444';
            default: return '#888';
        }
    };

    const styles = {
        container: { padding: '1rem' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
        titulo: { color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold' },
        buscador: { display: 'flex', alignItems: 'center', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '0.5rem 1rem', marginBottom: '1.5rem', maxWidth: '400px' },
        inputBuscar: { background: 'transparent', border: 'none', color: '#fff', outline: 'none', flex: 1, marginLeft: '0.5rem' },
        tablaContainer: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' },
        tabla: { width: '100%', borderCollapse: 'collapse' },
        th: { textAlign: 'left', padding: '1rem', color: '#FFD700', fontSize: '0.8rem', borderBottom: '1px solid #333', background: '#111', letterSpacing: '1px' },
        td: { padding: '1rem', color: '#888', fontSize: '0.85rem', borderBottom: '1px solid #222' },
        badge: (color) => ({ background: color + '20', color: color, padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }),
        acciones: { display: 'flex', gap: '0.5rem' },
        btnAccion: (color) => ({ background: color + '20', border: 'none', color: color, padding: '0.4rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }),
        mensaje: { color: '#00C851', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' },
    };

    return (
        <AdminLayout>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.titulo}>Suscripciones</h1>
                </div>

                {mensaje && <div style={styles.mensaje}>{mensaje}</div>}

                <div style={styles.buscador}>
                    <FaSearch color="#888" />
                    <input 
                        style={styles.inputBuscar} 
                        placeholder="Buscar por cliente o plan..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                <div style={styles.tablaContainer}>
                    <table style={styles.tabla}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>CLIENTE</th>
                                <th style={styles.th}>PLAN</th>
                                <th style={styles.th}>ESTADO</th>
                                <th style={styles.th}>INICIO</th>
                                <th style={styles.th}>VENCIMIENTO</th>
                                <th style={styles.th}>PRECIO</th>
                                <th style={styles.th}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suscripcionesFiltradas.map((suscripcion) => (
                                <tr key={suscripcion.PK_id_suscripcion}>
                                    <td style={styles.td}>#{suscripcion.PK_id_suscripcion}</td>
                                    <td style={styles.td}>
                                        <div className="font-medium text-white">{suscripcion.cliente_nombre || 'N/A'}</div>
                                        <div className="text-xs text-gray-500">{suscripcion.cliente_correo || ''}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.badge('#aa66cc')}>{suscripcion.nombre_plan}</span>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.badge(getEstadoColor(suscripcion.estado))}>
                                            {suscripcion.estado}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        {suscripcion.fecha_inicio ? new Date(suscripcion.fecha_inicio).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td style={styles.td}>
                                        {suscripcion.fecha_vencimiento ? new Date(suscripcion.fecha_vencimiento).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.badge('#FFD700')}>
                                            ${parseFloat(suscripcion.precio_suscripcion || 0).toLocaleString()}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.acciones}>
                                            {suscripcion.estado === 'Activa' ? (
                                                <button 
                                                    style={styles.btnAccion('#ff4444')} 
                                                    onClick={() => cambiarEstado(suscripcion.PK_id_suscripcion, 'Vencida')}
                                                >
                                                    <FaTimes /> Desactivar
                                                </button>
                                            ) : (
                                                <button 
                                                    style={styles.btnAccion('#00C851')} 
                                                    onClick={() => cambiarEstado(suscripcion.PK_id_suscripcion, 'Activa')}
                                                >
                                                    <FaCheck /> Activar
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {suscripcionesFiltradas.length === 0 && (
                                <tr>
                                    <td colSpan="8" style={{...styles.td, textAlign: 'center', padding: '3rem'}}>
                                        {busqueda ? 'No se encontraron resultados' : 'No hay suscripciones registradas'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Suscripciones;