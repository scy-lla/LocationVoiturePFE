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
    const [errors, setErrors] = useState({});
    
    // On récupère login ET isAdmin du contexte
    const { login, isAdmin } = useAuth(); 
    const navigate = useNavigate();

    // Validation du formulaire
    const validate = () => {
        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = 'L\'email est obligatoire';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Email invalide';
        }
        if (!password.trim()) {
            newErrors.password = 'Le mot de passe est obligatoire';
        } else if (password.length < 6) {
            newErrors.password = 'Email ou mot de passe incorrect';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        setLoading(true);
        try {
            // 1. Exécuter la connexion (sauvegarde le token JWT)
            await login(email, password);
            
            toast.success('Connexion réussie !');

            // 2. Utiliser la fonction isAdmin() du contexte
            // Elle va lire le token JWT qu'on vient de sauvegarder et décoder les rôles
            const userIsAdmin = isAdmin(); 

            // 3. Redirection intelligente
            if (userIsAdmin) {
                // Admin → Page Réservations (Dashboard complet)
                navigate('/admin/reservations');
            } else {
                // Client → Ses propres réservations
                navigate('/mes-reservations');
            }
            
        } catch (error) {
            console.error("Erreur login:", error);
            toast.error(error.message || 'Email ou mot de passe incorrect');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <ToastContainer />
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-1">Authentification</h2>
                <p className="text-gray-500 text-sm mb-6">
                    Connectez-vous ou créez un compte pour réserver une voiture
                </p>

                {/* Onglets */}
                <div className="flex bg-gray-100 rounded-full p-1 mb-6">
                    <button
                        onClick={() => { setActiveTab('connexion'); setErrors({}); }}
                        className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                            activeTab === 'connexion'
                                ? 'bg-white shadow text-black'
                                : 'text-gray-500'
                        }`}
                    >
                        Connexion
                    </button>
                    <button
                        onClick={() => { setActiveTab('inscription'); setErrors({}); }}
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
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="exemple@email.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrors({ ...errors, email: '' });
                                }}
                                className={`w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.email ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'
                                }`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrors({ ...errors, password: '' });
                                }}
                                className={`w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.password ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'
                                }`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
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
                {activeTab === 'inscription' && (
                    <Register
                        isModal={true}
                        onSwitchToLogin={() => setActiveTab('connexion')}
                    />
                )}
            </div>
        </div>
    );
};

export default Login;