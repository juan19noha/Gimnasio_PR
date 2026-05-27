import { useState, useEffect } from 'react';
import ClienteLayout from '../../components/cliente/ClienteLayout';
import api from '../../api/axiosConfig';
import { FaShoppingBag, FaCalendarAlt, FaBox, FaReceipt } from 'react-icons/fa';

const MisCompras = () => {
    const [compras, setCompras] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarCompras();
    }, []);

    const cargarCompras = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('usuario') || '{}');
            const { data } = await api.get('/ventas/mis-compras');
            setCompras(data.data || []);
        } catch (error) {
            console.error('Error cargando compras:', error);
        } finally {
            setCargando(false);
        }
    };

    const styles = {
        title: { 
            color: '#FFD700', 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            marginBottom: '1.5rem' 
        },
        card: { 
            background: '#111', 
            border: '1px solid #222', 
            borderRadius: '12px', 
            padding: '1.5rem', 
            marginBottom: '1rem' 
        },
        header: { 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1rem' 
        },
        fecha: { 
            color: '#888', 
            fontSize: '0.85rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem' 
        },
        total: { 
            color: '#FFD700', 
            fontSize: '1.3rem', 
            fontWeight: 'bold' 
        },
        producto: { 
            color: '#fff', 
            padding: '0.75rem', 
            background: '#1a1a1a', 
            borderRadius: '8px', 
            marginBottom: '0.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        prodNombre: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem' 
        },
        prodCantidad: { 
            color: '#888', 
            fontSize: '0.85rem' 
        },
        prodPrecio: { 
            color: '#FFD700', 
            fontWeight: 'bold' 
        },
        vacio: { 
            textAlign: 'center', 
            color: '#888', 
            padding: '3rem' 
        },
        vacioIcon: { 
            fontSize: '3rem', 
            marginBottom: '1rem', 
            color: '#333' 
        },
        resumen: {
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #333',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    };

    // Agrupar compras por fecha
    const comprasAgrupadas = compras.reduce((grupos, compra) => {
        const fecha = new Date(compra.fecha_venta || compra.fecha_compra).toLocaleDateString();
        if (!grupos[fecha]) grupos[fecha] = [];
        grupos[fecha].push(compra);
        return grupos;
    }, {});

    return (
        <ClienteLayout>
            <div style={styles.title}>
                <FaShoppingBag /> Mis Compras
            </div>
            
            {cargando ? (
                <p style={{color:'#FFD700'}}>Cargando...</p>
            ) : compras.length === 0 ? (
                <div style={styles.vacio}>
                    <div style={styles.vacioIcon}><FaReceipt /></div>
                    <div>No has realizado compras aún</div>
                    <div style={{fontSize: '0.85rem', marginTop: '0.5rem'}}>
                        Visita la tienda para ver nuestros productos
                    </div>
                </div>
            ) : (
                Object.entries(comprasAgrupadas).map(([fecha, items]) => (
                    <div key={fecha} style={styles.card}>
                        <div style={styles.header}>
                            <div style={styles.fecha}>
                                <FaCalendarAlt /> {fecha}
                            </div>
                        </div>
                        
                        {items.map((compra, i) => (
                            <div key={i} style={styles.producto}>
                                <div style={styles.prodNombre}>
                                    <FaBox color="#FFD700" />
                                    <span>{compra.nombre_producto || 'Producto'}</span>
                                </div>
                                <div>
                                    <span style={styles.prodCantidad}>
                                        {compra.cantidad}x 
                                    </span>
                                    <span style={styles.prodPrecio}>
                                        {' '}${Number(compra.total || compra.precio_unidad * compra.cantidad).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                        
                        <div style={styles.resumen}>
                            <span style={{color: '#888'}}>Total de la compra</span>
                            <span style={styles.total}>
                                ${items.reduce((sum, c) => sum + Number(c.total || c.precio_unidad * c.cantidad), 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </ClienteLayout>
    );
};

export default MisCompras;