import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-md w-full" title="Create an account">
                {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                    />
                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                    />
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="••••••••"
                        labelInfo="Must be at least 6 characters"
                    />
                    <div className="mt-6">
                        <Button type="submit" fullWidth disabled={loading}>
                            {loading ? <Spinner /> : 'Register'}
                        </Button>
                    </div>
                </form>
                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                        Sign In
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default Register;
