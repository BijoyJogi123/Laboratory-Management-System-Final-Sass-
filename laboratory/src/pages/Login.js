import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginImage from '../assets/images/login.jpg';
import Logo from '../assets/images/image.png';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const validateForm = () => {
        if (!email) {
            toast.error('Email is required');
            return false;
        }
        if (!password) {
            toast.error('Password is required');
            return false;
        }
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            const result = await login(email, password);

            if (result.success) {
                navigate('/');
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error. Please try again.');
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">

            <Toaster position="top-center" reverseOrder={false} />

            {/* Left Side - Image with Shadow Overlay */}
            <div className="relative w-1/2 hidden md:block">
                <img
                    src={LoginImage}
                    alt="Login Side Image"
                    className="object-cover h-full w-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <img src={Logo} alt="Logo" className="md:w-40 md:h-40 w-24 h-24 mb-4" />
                    <h1 className="text-5xl font-bold">HMS</h1>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 bg-white flex items-center justify-center">
                <div className="w-3/4 max-w-md">
                    <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Log in</h2>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="relative">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                className="shadow appearance-none border rounded w-full py-3 px-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                className="shadow appearance-none border rounded w-full py-3 px-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="flex items-center justify-center">
                            <button
                                type="submit"
                                style={{ background: "linear-gradient(180deg, #145883 0%, #01263E 100%" }}
                                className="hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && <p className="text-red-500 text-lg text-center mt-4">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
