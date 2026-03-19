import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = ({ isModal = false, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        email: '', password: '', nom: '', prenom: '', telephone: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.nom.trim())
            newErrors.nom = 'Le nom est obligatoire';

        if (!formData.prenom.trim())
            newErrors.prenom = 'Le prénom est obligatoire';

        if (!formData.email.trim())
            newErrors.email = 'L\'email est obligatoire';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = 'Email invalide';

        if (formData.telephone && !/^0[5-7][0-9]{8}$/.test(formData.telephone))
            newErrors.telephone = 'Téléphone invalide (ex: 06XXXXXXXX)';

        if (!formData.password.trim())
            newErrors.password = 'Le mot de passe est obligatoire';
        else if (formData.password.length < 6)
            newErrors.password = 'Minimum 6 caractères';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await register(formData);
            toast.success('Compte créé avec succès !');
            if (isModal && onSwitchToLogin) {
                setTimeout(() => onSwitchToLogin(), 1500);
            } else {
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.message || "Erreur lors de l'inscription");
        } finally {
            setLoading(false);
        }
    };

    const formContent = (
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
            {!isModal && <ToastContainer />}

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input
                    type="text" name="nom" placeholder="Dupont"
                    value={formData.nom} onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 ${errors.nom ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'}`}
                />
                {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input
                    type="text" name="prenom" placeholder="Jean"
                    value={formData.prenom} onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 ${errors.prenom ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'}`}
                />
                {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email" name="email" placeholder="exemple@email.com"
                    value={formData.email} onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                    type="tel" name="telephone" placeholder="06XXXXXXXX"
                    value={formData.telephone} onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 ${errors.telephone ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'}`}
                />
                {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input
                    type="password" name="password" placeholder="••••••••"
                    value={formData.password} onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'}`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
                type="submit" disabled={loading}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 transition-all"
            >
                {loading ? 'Inscription...' : 'Créer un compte'}
            </button>
        </form>
    );

    if (isModal) return formContent;

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