import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';

import LandingPage from './pages/public/LandingPage';
import Login from './pages/public/Login';
import Registro from './pages/public/Registro';
import RecuperarPassword from './pages/public/RecuperarPassword';
import ResetPassword from './pages/public/ResetPassword';

import DashboardAdmin from './pages/admin/DashboardAdmin';
import Usuarios from './pages/admin/Usuarios';
import Instructores from './pages/admin/Instructores';
import ClasesAdmin from './pages/admin/ClasesAdmin';
import ProductosAdmin from './pages/admin/ProductosAdmin';
import Compras from './pages/admin/Compras';
import Ventas from './pages/admin/Ventas';
import Suscripciones from './pages/admin/Suscripciones';
import Facturas from './pages/admin/Facturas';
import PerfilAdmin from './pages/admin/PerfilAdmin';


import DashboardCliente from './pages/cliente/DashboardCliente';
import MisClasesCliente from './pages/cliente/MisClases';
import MiSuscripcion from './pages/cliente/MiSuscripcion';
import ElegirPlan from './pages/cliente/ElegirPlan';  // NUEVO
import MisRutinas from './pages/cliente/MisRutinas';
import MiDieta from './pages/cliente/MiDieta';
import MisCompras from './pages/cliente/MisCompras';
import ProductosTienda from './pages/cliente/ProductosTienda';
import EventosCliente from './pages/cliente/Eventos';
import PerfilCliente from './pages/cliente/PerfilCliente';

import DashboardInstructor from './pages/instructor/DashboardInstructor';
import MisClasesInstructor from './pages/instructor/MisClases';
import Asistencias from './pages/instructor/Asistencias';
import RutinasClientes from './pages/instructor/RutinasClientes';
import PerfilInstructor from './pages/instructor/PerfilInstructor';

const RoleRedirect = () => {
    const { esAdmin, esInstructor, cargando } = useAuth();
    if (cargando) return <div style={{color:'#FFD700', padding:'2rem'}}>Cargando...</div>;
    if (esAdmin()) return <Navigate to="/admin/dashboard" />;
    if (esInstructor()) return <Navigate to="/instructor/dashboard" />;
    return <Navigate to="/cliente/dashboard" />;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/dashboard" element={<RoleRedirect />} />
                    <Route path="/recuperar-password" element={<RecuperarPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />


                    <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={['admin']}><DashboardAdmin /></PrivateRoute>} />
                    <Route path="/admin/perfil" element={<PrivateRoute allowedRoles={['admin']}><PerfilAdmin /></PrivateRoute>} />
                    <Route path="/admin/usuarios" element={<PrivateRoute allowedRoles={['admin']}><Usuarios /></PrivateRoute>} />
                    <Route path="/admin/instructores" element={<PrivateRoute allowedRoles={['admin']}><Instructores /></PrivateRoute>} />
                    <Route path="/admin/clases" element={<PrivateRoute allowedRoles={['admin']}><ClasesAdmin /></PrivateRoute>} />
                    <Route path="/admin/productos" element={<PrivateRoute allowedRoles={['admin']}><ProductosAdmin /></PrivateRoute>} />
                    <Route path="/admin/compras" element={<PrivateRoute allowedRoles={['admin']}><Compras /></PrivateRoute>} />
                    <Route path="/admin/ventas" element={<PrivateRoute allowedRoles={['admin']}><Ventas /></PrivateRoute>} />
                    <Route path="/admin/suscripciones" element={<PrivateRoute allowedRoles={['admin']}><Suscripciones /></PrivateRoute>} />
                    <Route path="/admin/facturas" element={<PrivateRoute allowedRoles={['admin']}><Facturas /></PrivateRoute>} />

                    <Route path="/cliente/dashboard" element={<PrivateRoute allowedRoles={['cliente']}><DashboardCliente /></PrivateRoute>} />
                    <Route path="/cliente/perfil" element={<PrivateRoute allowedRoles={['cliente']}><PerfilCliente /></PrivateRoute>} />
                    <Route path="/cliente/clases" element={<PrivateRoute allowedRoles={['cliente']}><MisClasesCliente /></PrivateRoute>} />
                    <Route path="/cliente/suscripcion" element={<PrivateRoute allowedRoles={['cliente']}><MiSuscripcion /></PrivateRoute>} />
                    <Route path="/cliente/elegir-plan" element={<PrivateRoute allowedRoles={['cliente']}><ElegirPlan /></PrivateRoute>} />  {/* NUEVO */}
                    <Route path="/cliente/rutinas" element={<PrivateRoute allowedRoles={['cliente']}><MisRutinas /></PrivateRoute>} />
                    <Route path="/cliente/dieta" element={<PrivateRoute allowedRoles={['cliente']}><MiDieta /></PrivateRoute>} />
                    <Route path="/cliente/compras" element={<PrivateRoute rolRequerido={3}><MisCompras /></PrivateRoute>} />
                    <Route path="/cliente/tienda" element={<PrivateRoute allowedRoles={['cliente']}><ProductosTienda /></PrivateRoute>} />
                    <Route path="/cliente/eventos" element={<PrivateRoute allowedRoles={['cliente']}><EventosCliente /></PrivateRoute>} />

                    <Route path="/instructor/dashboard" element={<PrivateRoute allowedRoles={['instructor']}><DashboardInstructor /></PrivateRoute>} />
                    <Route path="/instructor/perfil" element={<PrivateRoute allowedRoles={['instructor']}><PerfilInstructor /></PrivateRoute>} />
                    <Route path="/instructor/clases" element={<PrivateRoute allowedRoles={['instructor']}><MisClasesInstructor /></PrivateRoute>} />
                    <Route path="/instructor/asistencias" element={<PrivateRoute allowedRoles={['instructor']}><Asistencias /></PrivateRoute>} />
                    <Route path="/instructor/rutinas" element={<PrivateRoute allowedRoles={['instructor']}><RutinasClientes /></PrivateRoute>} />

                    <Route path="*" element={<div style={{color:'#FFD700', padding:'2rem', textAlign:'center'}}><h1>404</h1><p>Página no encontrada</p></div>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;