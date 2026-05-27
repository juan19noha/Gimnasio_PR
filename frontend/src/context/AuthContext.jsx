
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('usuario');

        if (token && userData && userData !== 'undefined') {
            try {
                setUsuario(JSON.parse(userData));
            } catch (e) {
                localStorage.removeItem('usuario');
                localStorage.removeItem('token');
            }
        }
        setCargando(false);
    }, []);

    const login = async (correo, password) => {
        const { data } = await api.post('/auth/login', { correo, password });

        localStorage.setItem('token', data.token);

        const usuarioData = {
            ...data.usuario,
            tipo: data.tabla,
            rol: data.usuario?.FK_id_rol
        };

        localStorage.setItem('usuario', JSON.stringify(usuarioData));
        setUsuario(usuarioData);

        return data;
    };

    const registro = async (datos) => {
        const { data } = await api.post('/auth/registro', datos);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('planSeleccionado');
        setUsuario(null);
        // Redirigir a LandingPage (página de visitantes)
        window.location.href = '/';
    };

    const esAdmin = () => usuario?.tipo === 'administrador' || usuario?.FK_id_rol === 1;
    const esCliente = () => usuario?.tipo === 'usuario' || usuario?.FK_id_rol === 3;
    const esInstructor = () => usuario?.tipo === 'instructor' || usuario?.FK_id_rol === 2;
    const esProveedor = () => usuario?.tipo === 'proveedor' || usuario?.FK_id_rol === 4;

    return (
        <AuthContext.Provider value={{ 
            usuario, 
            login, 
            registro, 
            logout, 
            esAdmin, 
            esCliente, 
            esInstructor,
            esProveedor,
            cargando 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);