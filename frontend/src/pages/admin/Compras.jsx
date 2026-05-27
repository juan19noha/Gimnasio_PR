import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaSearch, FaPlus, FaTimes, FaSave, FaShoppingCart, FaBox } from 'react-icons/fa';

const Compras = () => {
    const [compras, setCompras] = useState([]);
    const [productos, setProductos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);
    const [detalles, setDetalles] = useState([{ FK_id_producto: '', cantidad: '', precio_unidad: '' }]);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const [comprasRes, productosRes, proveedoresRes] = await Promise.all([
                api.get('/compras'),
                api.get('/productos'),
                api.get('/usuarios/proveedores')
            ]);
            setCompras(comprasRes.data.data || []);
            setProductos(productosRes.data.data || []);
            setProveedores(proveedoresRes.data.data || []);
        } catch (error) {
            console.error('Error cargando datos:', error);
        } finally {
            setCargando(false);
        }
    };

    const comprasFiltradas = compras.filter(c => 
        c.proveedor_nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const abrirModalCrear = () => {
        setProveedorSeleccionado('');
        setDetalles([{ FK_id_producto: '', cantidad: '', precio_unidad: '' }]);
        setModalAbierto(true);
        setMensaje('');
    };

    const agregarDetalle = () => {
        setDetalles([...detalles, { FK_id_producto: '', cantidad: '', precio_unidad: '' }]);
    };

    const eliminarDetalle = (index) => {
        if (detalles.length > 1) {
            setDetalles(detalles.filter((_, i) => i !== index));
        }
    };

    const handleDetalleChange = (index, campo, valor) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index][campo] = valor;
        setDetalles(nuevosDetalles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setCargando(true);
            await api.post('/compras', {
                datos: { FK_id_proveedor: proveedorSeleccionado, FK_id_usuario: 1 },
                detalles: detalles.filter(d => d.FK_id_producto && d.cantidad && d.precio_unidad)
            });
            setMensaje('Compra registrada correctamente');
            setTimeout(() => {
                setModalAbierto(false);
                cargarDatos();
                setMensaje('');
            }, 1500);
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al registrar compra');
        } finally {
            setCargando(false);
        }
    };

    const totalCompras = compras.reduce((sum, c) => sum + (c.total_compra || 0), 0);

    const styles = {
        container: { padding: '1rem' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
        titulo: { color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold' },
        resumen: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' },
        card: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem', borderLeft: '4px solid #ff4444' },
        cardValor: { fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' },
        cardTitulo: { fontSize: '0.85rem', color: '#888', marginTop: '0.25rem' },
        btnNuevo: { background: 'linear-gradient(135deg, #FFD700, #B8860B)', border: 'none', color: '#0a0a0a', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' },
        buscador: { display: 'flex', alignItems: 'center', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '0.5rem 1rem', marginBottom: '1.5rem', maxWidth: '400px' },
        inputBuscar: { background: 'transparent', border: 'none', color: '#fff', outline: 'none', flex: 1, marginLeft: '0.5rem' },
        tablaContainer: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' },
        tabla: { width: '100%', borderCollapse: 'collapse' },
        th: { textAlign: 'left', padding: '1rem', color: '#FFD700', fontSize: '0.8rem', borderBottom: '1px solid #333', background: '#111', letterSpacing: '1px' },
        td: { padding: '1rem', color: '#888', fontSize: '0.85rem', borderBottom: '1px solid #222' },
        badge: (color) => ({ background: color + '20', color: color, padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }),
        overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
        modal: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
        modalTitulo: { color: '#FFD700', fontSize: '1.2rem', fontWeight: 'bold' },
        btnCerrar: { background: 'none', border: 'none', color: '#888', fontSize: '1.2rem', cursor: 'pointer' },
        formGroup: { marginBottom: '1rem' },
        label: { display: 'block', color: '#FFD700', fontSize: '0.8rem', marginBottom: '0.4rem', letterSpacing: '1px' },
        input: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' },
        select: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' },
        detalleRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'end', marginBottom: '0.5rem' },
        btnAgregar: { width: '100%', padding: '0.5rem', background: 'transparent', border: '1px dashed #FFD700', borderRadius: '8px', color: '#FFD700', cursor: 'pointer', marginTop: '0.5rem' },
        btnEliminarDetalle: { background: '#ff444420', border: 'none', color: '#ff4444', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', height: 'fit-content' },
        btnGuardar: { width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #FFD700, #B8860B)', border: 'none', borderRadius: '8px', color: '#0a0a0a', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' },
        mensaje: (tipo) => ({ color: tipo === 'error' ? '#ff4444' : '#00C851', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }),
    };

    return (
        <AdminLayout>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.titulo}>Compras</h1>
                    <button style={styles.btnNuevo} onClick={abrirModalCrear}>
                        <FaPlus /> Nueva Compra
                    </button>
                </div>

                <div style={styles.resumen}>
                    <div style={styles.card}>
                        <div style={styles.cardValor}>${totalCompras.toLocaleString()}</div>
                        <div style={styles.cardTitulo}>Total en Compras</div>
                    </div>
                    <div style={styles.card}>
                        <div style={styles.cardValor}>{compras.length}</div>
                        <div style={styles.cardTitulo}>Órdenes</div>
                    </div>
                </div>

                <div style={styles.buscador}>
                    <FaSearch color="#888" />
                    <input 
                        style={styles.inputBuscar} 
                        placeholder="Buscar por proveedor..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                <div style={styles.tablaContainer}>
                    <table style={styles.tabla}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>PROVEEDOR</th>
                                <th style={styles.th}>ADMIN</th>
                                <th style={styles.th}>TOTAL</th>
                                <th style={styles.th}>FECHA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comprasFiltradas.map((compra) => (
                                <tr key={compra.PK_id_compra}>
                                    <td style={styles.td}>#{compra.PK_id_compra}</td>
                                    <td style={styles.td}>{compra.proveedor_nombre} {compra.proveedor_apellido}</td>
                                    <td style={styles.td}>{compra.admin_nombre} {compra.admin_apellido}</td>
                                    <td style={styles.td}><span style={styles.badge('#ff4444')}>${compra.total_compra?.toLocaleString()}</span></td>
                                    <td style={styles.td}>{compra.fecha_compra ? new Date(compra.fecha_compra).toLocaleDateString() : 'N/A'}</td>
                                </tr>
                            ))}
                            {comprasFiltradas.length === 0 && (
                                <tr><td colSpan="5" style={{...styles.td, textAlign: 'center', padding: '3rem'}}>
                                    {busqueda ? 'No se encontraron resultados' : 'No hay compras registradas'}
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalAbierto && (
                <div style={styles.overlay} onClick={() => setModalAbierto(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitulo}>Nueva Compra</h2>
                            <button style={styles.btnCerrar} onClick={() => setModalAbierto(false)}><FaTimes /></button>
                        </div>
                        
                        {mensaje && <div style={styles.mensaje(mensaje.includes('Error') ? 'error' : 'success')}>{mensaje}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>PROVEEDOR *</label>
                                <select style={styles.select} value={proveedorSeleccionado} onChange={(e) => setProveedorSeleccionado(e.target.value)} required>
                                    <option value="">Seleccionar proveedor...</option>
                                    {proveedores.map(p => (
                                        <option key={p.PK_id_usuario} value={p.PK_id_usuario}>{p.nombre_empresa || p.nombre} - {p.correo}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>PRODUCTOS *</label>
                                {detalles.map((detalle, index) => (
                                    <div key={index} style={styles.detalleRow}>
                                        <select style={styles.select} value={detalle.FK_id_producto} onChange={(e) => handleDetalleChange(index, 'FK_id_producto', e.target.value)} required>
                                            <option value="">Producto...</option>
                                            {productos.map(p => (
                                                <option key={p.PK_id_producto} value={p.PK_id_producto}>{p.nombre_producto}</option>
                                            ))}
                                        </select>
                                        <input style={styles.input} type="number" placeholder="Cant" value={detalle.cantidad} onChange={(e) => handleDetalleChange(index, 'cantidad', e.target.value)} required />
                                        <input style={styles.input} type="number" placeholder="Precio" value={detalle.precio_unidad} onChange={(e) => handleDetalleChange(index, 'precio_unidad', e.target.value)} required />
                                        <button type="button" style={styles.btnEliminarDetalle} onClick={() => eliminarDetalle(index)}><FaTimes /></button>
                                    </div>
                                ))}
                                <button type="button" style={styles.btnAgregar} onClick={agregarDetalle}>+ Agregar Producto</button>
                            </div>

                            <button type="submit" style={styles.btnGuardar} disabled={cargando}>
                                <FaSave /> {cargando ? 'Registrando...' : 'Registrar Compra'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Compras;