import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdminPage = location.pathname.startsWith('/admin');

    return (
        <nav className={`${isAdminPage ? 'bg-gray-900' : 'bg-white'} shadow-md`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        {/* MODIFIÉ PAR FADMA : EC au lieu de AL */}
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            EC
                        </div>
                        <div>
                            {/* MODIFIÉ PAR FADMA : EliteCar Maroc au lieu de AutoLoc Premium */}
                            <div className={`font-bold text-lg ${isAdminPage ? 'text-white' : 'text-gray-900'}`}>
                                EliteCar Maroc
                            </div>
                            <div className="text-xs text-gray-400">Location de luxe</div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    {user && isAdmin() && isAdminPage ? (
                        <div className="flex items-center gap-6">
                            <Link
                                to="/admin/dashboard"
                                className={`text-sm font-medium ${location.pathname === '/admin/dashboard' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}
                            >
                                Dashboard
                            </Link>
                            {/* AJOUTÉ PAR FADMA : gestion voitures admin */}
                            <Link
                                to="/admin/voitures"
                                className={`text-sm font-medium ${location.pathname === '/admin/voitures' ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}
                            >
                                Gestion Voitures
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-purple-600">
                                Accueil
                            </Link>
                            <Link to="/voitures" className="text-sm font-medium text-gray-700 hover:text-purple-600">
                                Voitures
                            </Link>
                        </div>
                    )}

                    {/* Auth Section */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="text-right">
                                    <div className={`text-sm font-bold ${isAdminPage ? 'text-white' : 'text-gray-900'}`}>
                                        {isAdmin() ? 'Administrateur' : user.email}
                                    </div>
                                    {isAdmin() && (
                                        <div className="text-xs text-gray-400">{user.email}</div>
                                    )}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-9 h-9 rounded-full border border-gray-500 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all"
                                >
                                    →
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm text-gray-700 hover:text-purple-600">
                                    Connexion
                                </Link>
                                <Link to="/login" className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700">
                                    Login
                                </Link>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;