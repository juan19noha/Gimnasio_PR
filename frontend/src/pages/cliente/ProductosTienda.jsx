import { useState, useEffect } from 'react';
import ClienteLayout from '../../components/cliente/ClienteLayout';
import api from '../../api/axiosConfig';
import { FaShoppingBag, FaShoppingCart, FaTag, FaPlus, FaMinus, FaTrash, FaCreditCard, FaTimes } from 'react-icons/fa';

const ProductosTienda = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    const [mensaje, setMensaje] = useState('');

    // Cargar productos y carrito del localStorage al iniciar
    useEffect(() => {
        const cargar = async () => {
            try {
                const { data } = await api.get('/productos');
                setProductos(data.data);
            } finally {
                setCargando(false);
            }
        };
        cargar();
        
        // Cargar carrito guardado
        const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
        setCarrito(carritoGuardado);
    }, []);

    // Guardar carrito en localStorage cada vez que cambie
    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }, [carrito]);

    const agregarAlCarrito = (producto) => {
        setCarrito(prev => {
            const existe = prev.find(item => item.PK_id_producto === producto.PK_id_producto);
            if (existe) {
                if (existe.cantidad >= producto.stock) {
                    setMensaje('No hay más stock disponible');
                    setTimeout(() => setMensaje(''), 2000);
                    return prev;
                }
                return prev.map(item => 
                    item.PK_id_producto === producto.PK_id_producto 
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            return [...prev, { ...producto, cantidad: 1 }];
        });
        setMensaje('¡Agregado al carrito!');
        setTimeout(() => setMensaje(''), 2000);
    };

    const actualizarCantidad = (id, delta) => {
        setCarrito(prev => prev.map(item => {
            if (item.PK_id_producto === id) {
                const nuevaCantidad = item.cantidad + delta;
                if (nuevaCantidad <= 0) return null;
                const productoOriginal = productos.find(p => p.PK_id_producto === id);
                if (nuevaCantidad > productoOriginal?.stock) {
                    setMensaje('Stock máximo alcanzado');
                    setTimeout(() => setMensaje(''), 2000);
                    return item;
                }
                return { ...item, cantidad: nuevaCantidad };
            }
            return item;
        }).filter(Boolean));
    };

    const eliminarDelCarrito = (id) => {
        setCarrito(prev => prev.filter(item => item.PK_id_producto !== id));
    };

    const totalCarrito = carrito.reduce((sum, item) => sum + (Number(item.precio_producto) * item.cantidad), 0);

    const finalizarCompra = async () => {
    if (carrito.length === 0) {
        setMensaje('El carrito está vacío');
        return;
    }
    try {
        setCargando(true);
        const response = await api.post('/ventas/cliente', {
            productos: carrito.map(item => ({
                id_producto: item.PK_id_producto,
                cantidad: item.cantidad,
                precio_unitario: item.precio_producto
            })),
            total: totalCarrito
        });
        
        // Limpiar todo
        setCarrito([]);
        localStorage.removeItem('carrito');
        setMostrarCarrito(false);
        
        // ✅ Mensaje de éxito mejorado
        setMensaje(`¡Compra realizada con éxito! Total: $${totalCarrito.toLocaleString()}`);
        
        // Recargar productos
        const { data } = await api.get('/productos');
        setProductos(data.data);
        
    } catch (error) {
        console.error('Error completo:', error);
        setMensaje(error.response?.data?.message || 'Error al procesar la compra');
    } finally {
        setCargando(false);
        setTimeout(() => setMensaje(''), 5000);
    }
};
    const styles = {
        title: { color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' },
        card: { background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
        nombre: { color: '#fff', fontWeight: 'bold', marginBottom: '0.5rem' },
        precio: { color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' },
        stock: { color: '#888', fontSize: '0.85rem' },
        promo: { color: '#00C851', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem' },
        btn: { width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #FFD700, #B8860B)', border: 'none', borderRadius: '8px', color: '#0a0a0a', fontWeight: 'bold', marginTop: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
        sinStock: { width: '100%', padding: '0.75rem', background: '#222', border: 'none', borderRadius: '8px', color: '#666', marginTop: '1rem', cursor: 'not-allowed' },
        carritoBtn: { position: 'fixed', bottom: '2rem', right: '2rem', background: 'linear-gradient(135deg, #FFD700, #B8860B)', border: 'none', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255,215,0,0.3)', zIndex: 100 },
        badge: { position: 'absolute', top: '-5px', right: '-5px', background: '#ff4444', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' },
        modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
        modal: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px', padding: '2rem', width: '90%', maxWidth: '500px', maxHeight: '80vh', overflow: 'auto', position: 'relative' },
        modalTitle: { color: '#FFD700', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
        itemCarrito: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #222', color: '#fff' },
        itemNombre: { fontWeight: 'bold', color: '#FFD700' },
        itemPrecio: { color: '#888', fontSize: '0.85rem' },
        cantidadControl: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
        btnCantidad: { background: '#333', border: 'none', color: '#FFD700', width: '30px', height: '30px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        btnEliminar: { background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '1.1rem' },
        total: { color: '#FFD700', fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'right', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #333' },
        btnComprar: { width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #00C851, #007E33)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', marginTop: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
        btnCerrar: { position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' },
        mensaje: { position: 'fixed', top: '2rem', left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', border: '1px solid #FFD700', color: '#FFD700', padding: '1rem 2rem', borderRadius: '8px', zIndex: 2000, fontWeight: 'bold' },
        mensajeError: { position: 'fixed', top: '2rem', left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', border: '1px solid #ff4444', color: '#ff4444', padding: '1rem 2rem', borderRadius: '8px', zIndex: 2000, fontWeight: 'bold' },
        vacio: { textAlign: 'center', color: '#888', padding: '2rem' }
    };

    return (
        <ClienteLayout>
            <div style={styles.title}><FaShoppingBag /> Tienda</div>
            
            {mensaje && (
                <div style={mensaje.includes('Error') || mensaje.includes('vacío') ? styles.mensajeError : styles.mensaje}>
                    {mensaje}
                </div>
            )}
            
            {cargando ? <p style={{color:'#FFD700'}}>Cargando...</p> : (
                <div style={styles.grid}>
                    {productos.map(p => (
                        <div key={p.PK_id_producto} style={styles.card}>
                            <div>
                                <div style={styles.nombre}>{p.nombre_producto}</div>
                                <div style={styles.precio}>${Number(p.precio_producto).toLocaleString()}</div>
                                <div style={styles.stock}>Stock: {p.stock} unidades</div>
                                {p.promociones && p.promociones !== 'Sin promoción' && (
                                    <div style={styles.promo}><FaTag /> {p.promociones}</div>
                                )}
                            </div>
                            {p.stock > 0 ? (
                                <button style={styles.btn} onClick={() => agregarAlCarrito(p)}>
                                    <FaShoppingCart /> Agregar al Carrito
                                </button>
                            ) : (
                                <button style={styles.sinStock} disabled>Sin Stock</button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Botón flotante del carrito */}
            <button style={styles.carritoBtn} onClick={() => setMostrarCarrito(true)}>
                <FaShoppingCart size={24} color="#0a0a0a" />
                {carrito.length > 0 && <span style={styles.badge}>{carrito.reduce((a,b) => a + b.cantidad, 0)}</span>}
            </button>

            {/* Modal del carrito */}
            {mostrarCarrito && (
                <div style={styles.modalOverlay} onClick={() => setMostrarCarrito(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <button style={styles.btnCerrar} onClick={() => setMostrarCarrito(false)}>
                            <FaTimes />
                        </button>
                        
                        <div style={styles.modalTitle}><FaShoppingCart /> Tu Carrito</div>
                        
                        {carrito.length === 0 ? (
                            <div style={styles.vacio}>El carrito está vacío</div>
                        ) : (
                            <>
                                {carrito.map(item => (
                                    <div key={item.PK_id_producto} style={styles.itemCarrito}>
                                        <div>
                                            <div style={styles.itemNombre}>{item.nombre_producto}</div>
                                            <div style={styles.itemPrecio}>
                                                ${Number(item.precio_producto).toLocaleString()} c/u
                                            </div>
                                        </div>
                                        <div style={styles.cantidadControl}>
                                            <button style={styles.btnCantidad} onClick={() => actualizarCantidad(item.PK_id_producto, -1)}>
                                                <FaMinus size={12} />
                                            </button>
                                            <span>{item.cantidad}</span>
                                            <button style={styles.btnCantidad} onClick={() => actualizarCantidad(item.PK_id_producto, 1)}>
                                                <FaPlus size={12} />
                                            </button>
                                            <button style={styles.btnEliminar} onClick={() => eliminarDelCarrito(item.PK_id_producto)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                
                                <div style={styles.total}>
                                    Total: ${totalCarrito.toLocaleString()}
                                </div>
                                
                                <button style={styles.btnComprar} onClick={finalizarCompra} disabled={cargando}>
                                    <FaCreditCard /> {cargando ? 'Procesando...' : 'Finalizar Compra'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </ClienteLayout>
    );
};

export default ProductosTienda;