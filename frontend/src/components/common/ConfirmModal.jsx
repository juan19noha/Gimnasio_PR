import { FaExclamationTriangle, FaCheck, FaTimes } from 'react-icons/fa';

const ConfirmModal = ({ abierto, titulo, mensaje, onConfirmar, onCancelar, cargando = false, textoConfirmar = 'Sí, confirmar', textoCancelar = 'Cancelar', tipo = 'warning' }) => {
    if (!abierto) return null;

    const colores = {
        warning: { icono: '#ffbb33', btn: '#ff4444' },
        danger: { icono: '#ff4444', btn: '#ff4444' },
        success: { icono: '#00C851', btn: '#00C851' }
    };

    const color = colores[tipo] || colores.warning;

    const styles = {
        overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
        modal: { background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '400px', textAlign: 'center' },
        icono: { fontSize: '3rem', color: color.icono, marginBottom: '1rem' },
        titulo: { color: '#FFD700', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' },
        mensaje: { color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 },
        btnConfirmar: { padding: '0.75rem 1.5rem', background: color.btn, border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginRight: '0.5rem', opacity: cargando ? 0.7 : 1 },
        btnCancelar: { padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid #444', borderRadius: '8px', color: '#888', cursor: 'pointer' }
    };

    return (
        <div style={styles.overlay} onClick={onCancelar}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <div style={styles.icono}><FaExclamationTriangle /></div>
                <h2 style={styles.titulo}>{titulo}</h2>
                <p style={styles.mensaje}>{mensaje}</p>
                <div>
                    <button style={styles.btnConfirmar} onClick={onConfirmar} disabled={cargando}>
                        {cargando ? 'Procesando...' : <><FaCheck /> {textoConfirmar}</>}
                    </button>
                    <button style={styles.btnCancelar} onClick={onCancelar} disabled={cargando}>
                        <FaTimes /> {textoCancelar}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;