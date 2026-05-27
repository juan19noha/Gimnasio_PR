import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
    const { usuario, cargando, esAdmin } = useAuth();

    if (cargando) return <div>Cargando...</div>;
    
    if (!usuario) return <Navigate to="/login" />;
    
    if (adminOnly && !esAdmin()) return <Navigate to="/dashboard" />;

    return children;
};

export default PrivateRoute;