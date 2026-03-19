import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = ({ isModal = false }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nom: '',
        prenom: '',
        telephone: ''
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    // Met à jour le champ correspondant dans formData
    // [e.target.name] permet de gérer tous les champs avec une seule fonction
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData);
            toast.success('Compte créé avec succès !');
            // Rediriger vers login seulement si page seule
            // Si isModal=true → on reste dans le modal Login
            if (!isModal) {
                navigate('/login');
            }
        } catch (error) {
            // error.message car AuthContext throw new Error(message)
            toast.error(error.message || "Erreur lors de l'inscription");
        } finally {
            setLoading(false);
        }
    };

    const formContent = (
        <form onSubmit={handleSubmit}>
            {!isModal && <ToastContainer />}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input
                    type="text"
                    name="nom"
                    placeholder="Jean Dupont"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input
                    type="text"
                    name="prenom"
                    placeholder="Jean"
                    value={formData.prenom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="exemple@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                    type="tel"
                    name="telephone"
                    placeholder="06XXXXXXXX"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-all"
            >
                {loading ? 'Inscription...' : 'Créer un compte'}
            </button>
        </form>
    );

    // Si utilisé dans le modal Login → pas de fond
    if (isModal) return formContent;

    // Si page seule → avec fond noir
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <ToastContainer />
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-1">Inscription</h2>
                <p className="text-gray-500 text-sm mb-6">Créez votre compte</p>
                {formContent}
            </div>
        </div>
    );
};

export default Register;