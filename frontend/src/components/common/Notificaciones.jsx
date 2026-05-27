import { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTimes } from 'react-icons/fa';

const Notificaciones = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [abierto, setAbierto] = useState(false);
    const [noLeidas, setNoLeidas] = useState(0);

    useEffect(() => {
        // Simular carga de notificaciones - conecta con tu API real
        const demoNotificaciones = [
            { id: 1, titulo: 'Nueva clase asignada', mensaje: 'Se te ha asignado la clase de Yoga mañana a las 8AM', fecha: new Date(), leida: false, tipo: 'clase' },
            { id: 2, titulo: 'Pago recibido', mensaje: 'Tu suscripción ha sido renovada exitosamente', fecha: new Date(Date.now() - 86400000), leida: true, tipo: 'pago' },
            { id: 3, titulo: 'Recordatorio', mensaje: 'Tu clase de CrossFit comienza en 30 minutos', fecha: new Date(Date.now() - 172800000), leida: false, tipo: 'recordatorio' }
        ];
        setNotificaciones(demoNotificaciones);
        setNoLeidas(demoNotificaciones.filter(n => !n.leida).length);
    }, []);

    const marcarLeida = (id) => {
        setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
        setNoLeidas(prev => Math.max(0, prev - 1));
    };

    const marcarTodasLeidas = () => {
        setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
        setNoLeidas(0);
    };

    const styles = {
        container: { position: 'relative' },
        bellBtn: { background: 'none', border: 'none', color: '#FFD700', fontSize: '1.2rem', cursor: 'pointer', position: 'relative', padding: '0.5rem' },
        badge: { position: 'absolute', top: '0', right: '0', background: '#ff4444', color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', padding: '0.15rem 0.4rem', borderRadius: '50%', minWidth: '16px', textAlign: 'center' },
        dropdown: { position: 'absolute', top: 'calc(100% + 0.5rem)', right: '0', width: '320px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 1000, overflow: 'hidden' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #333' },
        headerTitulo: { color: '#FFD700', fontWeight: 'bold', fontSize: '0.9rem' },
        marcarTodas: { background: 'none', border: 'none', color: '#33b5e5', fontSize: '0.75rem', cursor: 'pointer' },
        lista: { maxHeight: '300px', overflowY: 'auto' },
        notificacion: (leida) => ({ padding: '0.75rem 1rem', borderBottom: '1px solid #222', background: leida ? 'transparent' : 'rgba(255,215,0,0.03)', cursor: 'pointer', transition: 'background 0.2s' }),
        notiTitulo: { color: leida ? '#888' : '#fff', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.25rem' },
        notiMensaje: { color: '#888', fontSize: '0.8rem', lineHeight: 1.4 },
        notiFecha: { color: '#555', fontSize: '0.7rem', marginTop: '0.25rem' },
        vacio: { padding: '2rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }
    };

    return (
        <div style={styles.container}>
            <button style={styles.bellBtn} onClick={() => setAbierto(!abierto)}>
                <FaBell />
                {noLeidas > 0 && <span style={styles.badge}>{noLeidas}</span>}
            </button>
            
            {abierto && (
                <div style={styles.dropdown}>
                    <div style={styles.header}>
                        <span style={styles.headerTitulo}>Notificaciones</span>
                        {noLeidas > 0 && (
                            <button style={styles.marcarTodas} onClick={marcarTodasLeidas}>
                                <FaCheck /> Marcar todas
                            </button>
                        )}
                    </div>
                    <div style={styles.lista}>
                        {notificaciones.length === 0 ? (
                            <div style={styles.vacio}>No tienes notificaciones</div>
                        ) : (
                            notificaciones.map(noti => (
                                <div 
                                    key={noti.id} 
                                    style={styles.notificacion(noti.leida)}
                                    onClick={() => marcarLeida(noti.id)}
                                >
                                    <div style={styles.notiTitulo}>{noti.titulo}</div>
                                    <div style={styles.notiMensaje}>{noti.mensaje}</div>
                                    <div style={styles.notiFecha}>{noti.fecha.toLocaleDateString()}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notificaciones;