import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Fonction pour vérifier si un lien est actif
    const isActive = (path) => {
        return location.pathname === path;
    };

    // Fonction pour gérer le clic sur les liens
    const handleNavClick = (e, path, sectionId) => {
        if (location.pathname !== path) {
            // Si on est sur une autre page, naviguer vers la home
            navigate(path);
            // Attendre que la navigation soit faite puis scroller
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            // Si on est déjà sur la home, scroller directement
            e.preventDefault();
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <nav className="bg-gray-900 text-white border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2 font-bold text-xl">
                            DN
                        </div>
                        <div>
                           <h1 className="text-xl font-bold">DriveNow</h1>
<p className="text-xs text-gray-400">Location de voitures</p>

</div>
                    </Link>

                    {/* Menu */}
                    <div className="hidden md:flex space-x-8">
                        <Link 
                            to="/" 
                            onClick={(e) => handleNavClick(e, '/', 'home')}
                            className={`transition-colors font-medium ${
                                isActive('/') && !location.hash
                                    ? 'text-blue-400' 
                                    : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            Accueil
                        </Link>
                        <Link 
                            to="/"
                            onClick={(e) => handleNavClick(e, '/', 'apropos')}
                            className={`transition-colors font-medium ${
                                location.hash === '#apropos'
                                    ? 'text-blue-400' 
                                    : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            À propos
                        </Link>
                        <Link 
                            to="/voitures" 
                            className={`transition-colors font-medium ${
                                isActive('/voitures') 
                                    ? 'text-blue-400' 
                                    : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            Voitures
                        </Link>
                        <Link 
                            to="/"
                            onClick={(e) => handleNavClick(e, '/', 'contact')}
                            className={`transition-colors font-medium ${
                                location.hash === '#contact'
                                    ? 'text-blue-400' 
                                    : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            Contact
                        </Link>
                    </div>

                    {/* Login Button */}
                    {!user ? (
                        <Link 
                            to="/login" 
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
                        >
                            <FaUser size={18} />
                            <span>Login</span>
                        </Link>
                    ) : (
                        <button 
                            onClick={handleLogout}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
                        >
                            <FaUser size={18} />
                            <span>Logout</span>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;