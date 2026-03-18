import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './Register';

const Login = () => {
    const [activeTab, setActiveTab] = useState('connexion');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Connexion réussie !');
            const token = localStorage.getItem('token');
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            if (payload.roles?.includes('ROLE_ADMIN')) {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <ToastContainer />
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                {/* Titre */}
                <h2 className="text-2xl font-bold mb-1">Authentification</h2>
                <p className="text-gray-500 text-sm mb-6">
                    Connectez-vous ou créez un compte pour réserver une voiture
                </p>

                {/* Onglets */}
                <div className="flex bg-gray-100 rounded-full p-1 mb-6">
                    <button
                        onClick={() => setActiveTab('connexion')}
                        className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                            activeTab === 'connexion'
                                ? 'bg-white shadow text-black'
                                : 'text-gray-500'
                        }`}
                    >
                        Connexion
                    </button>
                    <button
                        onClick={() => setActiveTab('inscription')}
                        className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                            activeTab === 'inscription'
                                ? 'bg-white shadow text-black'
                                : 'text-gray-500'
                        }`}
                    >
                        Inscription
                    </button>
                </div>

                {/* Formulaire Connexion */}
                {activeTab === 'connexion' && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="exemple@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-all"
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>
                )}

                {/* Formulaire Inscription */}
                {activeTab === 'inscription' && <Register isModal={true} />}
            </div>
        </div>
    );
};

export default Login;