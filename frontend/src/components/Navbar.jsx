import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-blue-600">
                            🚗 Location Voiture
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                {isAdmin() && (
                                    <Link to="/admin/dashboard" className="text-gray-700 hover:text-blue-600">
                                        Admin
                                    </Link>
                                )}
                                <span className="text-gray-600">👤 {user.email}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                                >
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                                    Connexion
                                </Link>
                                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Inscription
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