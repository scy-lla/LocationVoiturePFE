import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaClipboardList, FaSignOutAlt, FaCar, FaChartPie } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isUserAdmin = isAdmin ? isAdmin() : false;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleNavClick = (e, path, sectionId) => {
        if (location.pathname !== path) {
            navigate(path);
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            e.preventDefault();
            const element = document.getElementById(sectionId);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="bg-gray-900 text-white border-b border-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    
                    {/* LOGO */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2 font-bold text-xl group-hover:scale-105 transition-transform">
                            DN
                        </div>
                        <div>
                           <h1 className="text-xl font-bold tracking-wide">DriveNow</h1>
                           <p className="text-xs text-gray-400">Location de voitures</p>
                        </div>
                    </Link>

                    {/* MENU CENTRAL */}
                    <div className="hidden md:flex space-x-8 items-center">
                        
                        {/* 👇 LIENS PUBLICS (Seulement si NON Admin) */}
                        {!isUserAdmin && (
                            <>
                                <Link to="/" onClick={(e) => handleNavClick(e, '/', 'home')} className={`transition-colors font-medium ${isActive('/') && !location.hash ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}>Accueil</Link>
                                <Link to="/" onClick={(e) => handleNavClick(e, '/', 'apropos')} className={`transition-colors font-medium ${location.hash === '#apropos' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}>À propos</Link>
                                <Link to="/voitures" className={`transition-colors font-medium ${isActive('/voitures') ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}>Voitures</Link>
                                <Link to="/" onClick={(e) => handleNavClick(e, '/', 'contact')} className={`transition-colors font-medium ${location.hash === '#contact' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}>Contact</Link>
                                
                                {/* Lien Client */}
                                {user && (
                                    <Link to="/mes-reservations" className={`transition-colors font-medium flex items-center gap-1 ${isActive('/mes-reservations') ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}>
                                        <FaClipboardList size={16} />
                                        <span>Mes Réservations</span>
                                    </Link>
                                )}
                            </>
                        )}

                        {/* 👇 LIENS ADMIN (Seulement si Admin) */}
                        {isUserAdmin && (
                            <>
                                <Link to="/admin/reservations" className={`transition-colors font-medium flex items-center gap-1 ${isActive('/admin/reservations') ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}>
                                    <FaClipboardList size={16} />
                                    <span>Réservations</span>
                                </Link>

                                <Link to="/admin/statistiques" className={`transition-colors font-medium flex items-center gap-1 ${isActive('/admin/statistiques') ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}>
                                    <FaChartPie size={16} />
                                    <span>Statistiques</span>
                                </Link>

                                <Link to="/admin/voitures" className={`transition-colors font-medium flex items-center gap-1 ${isActive('/admin/voitures') ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}>
                                    <FaCar size={16} />
                                    <span>Gestion Voitures</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* BOUTON LOGIN / LOGOUT */}
                    {!user ? (
                        <Link to="/login" className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2.5 rounded-full font-bold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md">
                            <FaUser size={18} />
                            <span>Se connecter</span>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-300 hidden lg:block">
                                Bonjour, <span className="font-bold text-white">{user.email?.split('@')[0]}</span>
                            </span>
                            <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full font-bold transition-all transform hover:scale-105 shadow-md">
                                <FaSignOutAlt size={18} />
                                <span>Déconnexion</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;