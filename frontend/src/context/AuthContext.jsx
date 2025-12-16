import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await api.get('/auth/me');
                    if (data.status === 'success') {
                         setUser({ ...data.data });
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        setUser({ ...data.data });
        return data.data;
    };

    const register = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        setUser({ ...data.data });
        return data.data;
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await api.post('/auth/revoke-token', { refreshToken });
            }
        } catch (err) {
            console.error('Logout revocation failed', err);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            setUser(null);
            // Redirect usually handled by component using context
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
