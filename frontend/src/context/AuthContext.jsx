import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/login_check', { email, password });
        const token = response.data.token;
        localStorage.setItem('token', token);
        setUser({ token, email });
        return response.data;
    };

    const register = async (userData) => {
        const response = await api.post('/register', userData);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAdmin = () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            return payload.roles?.includes('ROLE_ADMIN');
        } catch (e) {
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};