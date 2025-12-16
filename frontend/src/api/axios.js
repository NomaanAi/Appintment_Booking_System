import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Access Token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle 403 (Expired Token)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const { data } = await axios.post('http://localhost:5000/api/auth/refresh-token', { refreshToken });

                localStorage.setItem('token', data.data.accessToken);
                localStorage.setItem('refreshToken', data.data.refreshToken);

                api.defaults.headers.common['Authorization'] = `Bearer ${data.data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Logout if refresh fails
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
