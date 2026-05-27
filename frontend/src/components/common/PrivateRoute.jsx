import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
    const { usuario, cargando, esAdmin, esCliente, esInstructor } = useAuth();

    if (cargando) return <div style={{color:'#FFD700', padding:'2rem'}}>Cargando...</div>;
    if (!usuario) return <Navigate to="/login" />;
    if (allowedRoles.length === 0) return children;
    
    const tieneAcceso = 
        (allowedRoles.includes('admin') && esAdmin()) ||
        (allowedRoles.includes('cliente') && esCliente()) ||
        (allowedRoles.includes('instructor') && esInstructor());

    if (!tieneAcceso) {
        if (esAdmin()) return <Navigate to="/admin/dashboard" />;
        if (esInstructor()) return <Navigate to="/instructor/dashboard" />;
        return <Navigate to="/cliente/dashboard" />;
    }

    return children;
};

export default PrivateRoute;