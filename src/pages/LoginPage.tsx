import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/themeStore';
import { useNavigate } from 'react-router-dom';

// --- Inline SVG Icons ---
const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
);

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const theme = useAppStore((state) => state.theme);
    const navigate = useNavigate();

    // This ensures the <html> tag has the correct 'dark' class for Tailwind's dark mode
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Logging in with:', { username, password });
        // On successful login, redirect to the dashboard
        navigate('/');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800 lg:grid lg:grid-cols-2">
                {/* Visual Side */}
                <div className="hidden bg-gradient-to-br from-orange-500 to-orange-600 p-12 text-white lg:flex lg:flex-col lg:items-center lg:justify-center">
                    <h1 className="text-4xl font-bold">Agos Admin</h1>
                    <p className="mt-4 text-center text-orange-100">
                        Welcome to the official administration panel for Calaca.
                    </p>
                </div>

                {/* Form Side */}
                <div className="flex flex-col justify-center p-8 sm:p-12">
                    <div className="w-full">
                        <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white">Welcome Back!</h2>
                        <p className="mb-6 text-center text-gray-500 dark:text-gray-400">Sign in to continue.</p>

                        <form onSubmit={handleLogin} className="space-y-5">
                            {/* Username Input */}
                            <div>
                                <label htmlFor="username" className="sr-only">Username</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="username"
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="w-full rounded-lg border-gray-300 bg-gray-50 p-3 pl-10 text-gray-700 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <LockIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full rounded-lg border-gray-300 bg-gray-50 p-3 pl-10 text-gray-700 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                                    <label htmlFor="remember-me" className="ml-2 block text-gray-600 dark:text-gray-300">Remember me</label>
                                </div>
                                <a href="#" className="font-medium text-orange-600 hover:text-orange-500">Forgot password?</a>
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-lg bg-orange-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                            >
                                Sign In
                            </button>

                            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                Don't have an account?{' '}
                                <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
                                    Sign Up
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

