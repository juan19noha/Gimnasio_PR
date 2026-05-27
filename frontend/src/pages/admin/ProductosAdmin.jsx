import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaTimes, FaSave, FaBox, FaExclamationTriangle } from 'react-icons/fa';

const ProductosAdmin = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [modalStock, setModalStock] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [formData, setFormData] = useState({
        FK_id_categoria: '', nombre_producto: '', stock: '', precio_producto: '', descripcion: '', promociones: ''
    });
    const [cantidadStock, setCantidadStock] = useState(0);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const [productosRes, categoriasRes] = await Promise.all([
                api.get('/productos'),
                api.get('/categorias')
            ]);
            setProductos(productosRes.data.data || []);
            setCategorias(categoriasRes.data.data || []);
        } catch (error) {
            console.error('Error cargando datos:', error);
            setMensaje('Error al cargar datos');
        } finally {
            setCargando(false);
        }
    };

    const productosFiltrados = productos.filter(p => 
        p.nombre_producto?.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.nombre_categoria?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const abrirModalCrear = () => {
        setProductoSeleccionado(null);
        setFormData({ FK_id_categoria: '', nombre_producto: '', stock: '', precio_producto: '', descripcion: '', promociones: '' });
        setModalAbierto(true);
        setMensaje('');
    };

    const abrirModalEditar = (producto) => {
        setProductoSeleccionado(producto);
        setFormData({
            FK_id_categoria: producto.FK_id_categoria || '',
            nombre_producto: producto.nombre_producto || '',
            stock: producto.stock || '',
            precio_producto: producto.precio_producto || '',
            descripcion: producto.descripcion || '',
            promociones: producto.promociones || ''
        });
        setModalAbierto(true);
        setMensaje('');
    };

    const abrirModalEliminar = (producto) => {
        setProductoSeleccionado(producto);
        setModalEliminar(true);
    };

    const abrirModalStock = (producto) => {
        setProductoSeleccionado(producto);
        setCantidadStock(0);
        setModalStock(true);
        setMensaje('');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setCargando(true);
            if (productoSeleccionado) {
                await api.put(`/productos/${productoSeleccionado.PK_id_producto}`, formData);
                setMensaje('Producto actualizado correctamente');
            } else {
                await api.post('/productos', formData);
                setMensaje('Producto creado correctamente');
            }
            setTimeout(() => {
                setModalAbierto(false);
                cargarDatos();
                setMensaje('');
            }, 1500);
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al guardar producto');
        } finally {
            setCargando(false);
        }
    };

    const handleEliminar = async () => {
        try {
            setCargando(true);
            await api.delete(`/productos/${productoSeleccionado.PK_id_producto}`);
            setMensaje('Producto eliminado correctamente');
            setTimeout(() => {
                setModalEliminar(false);
                cargarDatos();
                setMensaje('');
            }, 1500);
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al eliminar producto');
        } finally {
            setCargando(false);
        }
    };

    const handleActualizarStock = async () => {
        try {
            setCargando(true);
            await api.patch(`/productos/${productoSeleccionado.PK_id_producto}/stock`, { cantidad: Number(cantidadStock) });
            setMensaje(`Stock actualizado: ${cantidadStock > 0 ? '+' : ''}${cantidadStock}`);
            setTimeout(() => {
                setModalStock(false);
                cargarDatos();
                setMensaje('');
            }, 1500);
        } catch (error) {
            setMensaje(error.response?.data?.message || 'Error al actualizar stock');
        } finally {
            setCargando(false);
        }
    };

    const styles = {
        container: { padding: '1rem' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
        titulo: { color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold' },
        btnNuevo: { background: 'linear-gradient(135deg, #FFD700, #B8860B)', border: 'none', color: '#0a0a0a', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' },
        buscador: { display: 'flex', alignItems: 'center', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '0.5rem 1rem', marginBottom: '1.5rem', maxWidth: '400px' },
        inputBuscar: { background: 'transparent', border: 'none', color: '#fff', outline: 'none', flex: 1, marginLeft: '0.5rem' },
        tablaContainer: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', overflow: 'hidden' },
        tabla: { width: '100%', borderCollapse: 'collapse' },
        th: { textAlign: 'left', padding: '1rem', color: '#FFD700', fontSize: '0.8rem', borderBottom: '1px solid #333', background: '#111', letterSpacing: '1px' },
        td: { padding: '1rem', color: '#888', fontSize: '0.85rem', borderBottom: '1px solid #222' },
        acciones: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
        btnAccion: (color) => ({ background: color + '20', border: 'none', color: color, padding: '0.4rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }),
        stockBajo: { color: '#ff4444', fontWeight: 'bold' },
        stockNormal: { color: '#00C851' },
        // Modal
        overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
        modal: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
        modalTitulo: { color: '#FFD700', fontSize: '1.2rem', fontWeight: 'bold' },
        btnCerrar: { background: 'none', border: 'none', color: '#888', fontSize: '1.2rem', cursor: 'pointer' },
        formGroup: { marginBottom: '1rem' },
        label: { display: 'block', color: '#FFD700', fontSize: '0.8rem', marginBottom: '0.4rem', letterSpacing: '1px' },
        input: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' },
        select: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' },
        textarea: { width: '100%', padding: '0.75rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: '80px' },
        grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
        btnGuardar: { width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #FFD700, #B8860B)', border: 'none', borderRadius: '8px', color: '#0a0a0a', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' },
        mensaje: (tipo) => ({ color: tipo === 'error' ? '#ff4444' : '#00C851', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }),
        modalEliminar: { textAlign: 'center', padding: '1rem 0' },
        modalTexto: { color: '#888', marginBottom: '1.5rem' },
        btnEliminar: { padding: '0.75rem 1.5rem', background: '#ff4444', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginRight: '0.5rem' },
        btnCancelar: { padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid #444', borderRadius: '8px', color: '#888', cursor: 'pointer' },
    };

    return (
        <AdminLayout>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.titulo}>Gestión de Productos</h1>
                    <button style={styles.btnNuevo} onClick={abrirModalCrear}>
                        <FaPlus /> Nuevo Producto
                    </button>
                </div>

                <div style={styles.buscador}>
                    <FaSearch color="#888" />
                    <input 
                        style={styles.inputBuscar} 
                        placeholder="Buscar por nombre o categoría..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                <div style={styles.tablaContainer}>
                    <table style={styles.tabla}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>PRODUCTO</th>
                                <th style={styles.th}>CATEGORÍA</th>
                                <th style={styles.th}>STOCK</th>
                                <th style={styles.th}>PRECIO</th>
                                <th style={styles.th}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosFiltrados.map((producto) => (
                                <tr key={producto.PK_id_producto}>
                                    <td style={styles.td}>#{producto.PK_id_producto}</td>
                                    <td style={styles.td}>{producto.nombre_producto}</td>
                                    <td style={styles.td}>{producto.nombre_categoria || 'N/A'}</td>
                                    <td style={styles.td}>
                                        <span style={producto.stock < 10 ? styles.stockBajo : styles.stockNormal}>
                                            {producto.stock < 10 && <FaExclamationTriangle />} {producto.stock} unidades
                                        </span>
                                    </td>
                                    <td style={styles.td}>${producto.precio_producto?.toLocaleString()}</td>
                                    <td style={styles.td}>
                                        <div style={styles.acciones}>
                                            <button style={styles.btnAccion('#33b5e5')} onClick={() => abrirModalEditar(producto)}>
                                                <FaEdit /> Editar
                                            </button>
                                            <button style={styles.btnAccion('#ffbb33')} onClick={() => abrirModalStock(producto)}>
                                                <FaBox /> Stock
                                            </button>
                                            <button style={styles.btnAccion('#ff4444')} onClick={() => abrirModalEliminar(producto)}>
                                                <FaTrash /> Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {productosFiltrados.length === 0 && (
                                <tr><td colSpan="6" style={{...styles.td, textAlign: 'center', padding: '3rem'}}>
                                    {busqueda ? 'No se encontraron resultados' : 'No hay productos registrados'}
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Crear/Editar */}
            {modalAbierto && (
                <div style={styles.overlay} onClick={() => setModalAbierto(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitulo}>{productoSeleccionado ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                            <button style={styles.btnCerrar} onClick={() => setModalAbierto(false)}><FaTimes /></button>
                        </div>
                        
                        {mensaje && <div style={styles.mensaje(mensaje.includes('Error') ? 'error' : 'success')}>{mensaje}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>NOMBRE *</label>
                                <input style={styles.input} name="nombre_producto" value={formData.nombre_producto} onChange={handleChange} required />
                            </div>
                            <div style={styles.grid2}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>CATEGORÍA *</label>
                                    <select style={styles.select} name="FK_id_categoria" value={formData.FK_id_categoria} onChange={handleChange} required>
                                        <option value="">Seleccionar...</option>
                                        {categorias.map(cat => (
                                            <option key={cat.PK_id_categoria} value={cat.PK_id_categoria}>{cat.nombre_categoria}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>STOCK INICIAL *</label>
                                    <input style={styles.input} name="stock" type="number" value={formData.stock} onChange={handleChange} required />
                                </div>
                            </div>
                            <div style={styles.grid2}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>PRECIO *</label>
                                    <input style={styles.input} name="precio_producto" type="number" value={formData.precio_producto} onChange={handleChange} required />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>PROMOCIONES</label>
                                    <input style={styles.input} name="promociones" value={formData.promociones} onChange={handleChange} placeholder="Ej: 2x1, 20% off" />
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>DESCRIPCIÓN</label>
                                <textarea style={styles.textarea} name="descripcion" value={formData.descripcion} onChange={handleChange} />
                            </div>
                            <button type="submit" style={styles.btnGuardar} disabled={cargando}>
                                <FaSave /> {cargando ? 'Guardando...' : (productoSeleccionado ? 'Actualizar' : 'Crear')} Producto
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Stock */}
            {modalStock && (
                <div style={styles.overlay} onClick={() => setModalStock(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitulo}>Actualizar Stock</h2>
                            <button style={styles.btnCerrar} onClick={() => setModalStock(false)}><FaTimes /></button>
                        </div>
                        <p style={{color:'#888', marginBottom:'1rem'}}>
                            Producto: <strong style={{color:'#FFD700'}}>{productoSeleccionado?.nombre_producto}</strong><br/>
                            Stock actual: <strong style={{color:'#FFD700'}}>{productoSeleccionado?.stock}</strong>
                        </p>
                        {mensaje && <div style={styles.mensaje(mensaje.includes('Error') ? 'error' : 'success')}>{mensaje}</div>}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>CANTIDAD A AGREGAR/RESTAR</label>
                            <input 
                                style={styles.input} 
                                type="number" 
                                value={cantidadStock} 
                                onChange={(e) => setCantidadStock(e.target.value)}
                                placeholder="Use números negativos para restar"
                            />
                        </div>
                        <button style={styles.btnGuardar} onClick={handleActualizarStock} disabled={cargando}>
                            <FaBox /> {cargando ? 'Actualizando...' : 'Actualizar Stock'}
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Eliminar */}
            {modalEliminar && (
                <div style={styles.overlay} onClick={() => setModalEliminar(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalEliminar}>
                            <h2 style={styles.modalTitulo}>¿Eliminar Producto?</h2>
                            <p style={styles.modalTexto}>
                                ¿Estás seguro de eliminar <strong style={{color:'#FFD700'}}>{productoSeleccionado?.nombre_producto}</strong>?<br/>
                                Esta acción no se puede deshacer.
                            </p>
                            {mensaje && <div style={styles.mensaje(mensaje.includes('Error') ? 'error' : 'success')}>{mensaje}</div>}
                            <div>
                                <button style={styles.btnEliminar} onClick={handleEliminar} disabled={cargando}>
                                    <FaTrash /> {cargando ? 'Eliminando...' : 'Sí, Eliminar'}
                                </button>
                                <button style={styles.btnCancelar} onClick={() => setModalEliminar(false)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ProductosAdmin;