import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser } from 'react-icons/fa';

const Navbar = () => {
    // Récupération des données utilisateur et de la fonction de déconnexion depuis le contexte d'authentification
    const { user, logout } = useAuth();
    
    // Hooks pour la navigation programmée et pour connaître l'URL actuelle
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Gère la déconnexion :
     * 1. Appelle la fonction logout du contexte (efface le token/user)
     * 2. Redirige vers la page d'accueil
     */
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    /**
     * Vérifie si un lien est actif en comparant son chemin avec l'URL actuelle.
     * Sert à appliquer la couleur bleue sur le lien actif.
     */
    const isActive = (path) => {
        return location.pathname === path;
    };

    /**
     * Gère le clic sur les liens de la page d'accueil (Ancres).
     * Permet de scroller doucement vers une section (#apropos, #contact)
     * même si on est sur une autre page.
     */
    const handleNavClick = (e, path, sectionId) => {
        if (location.pathname !== path) {
            // Si on n'est pas sur la home, on y navigue d'abord
            navigate(path);
            // Petit délai pour laisser le temps à la page de charger avant de scroller
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            // Si on est déjà sur la home, on empêche le rechargement et on scroll direct
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
                    
                    {/* --- LOGO --- */}
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2 font-bold text-xl">
                            DN
                        </div>
                        <div>
                           <h1 className="text-xl font-bold">DriveNow</h1>
                           <p className="text-xs text-gray-400">Location de voitures</p>
                        </div>
                    </Link>

                    {/* --- MENU CENTRAL --- */}
                    <div className="hidden md:flex space-x-8 items-center">
                        
                        {/* Liens Publics (Accueil, À propos, Voitures, Contact) */}
                        <Link 
                            to="/" 
                            onClick={(e) => handleNavClick(e, '/', 'home')}
                            className={`transition-colors font-medium ${
                                isActive('/') && !location.hash ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            Accueil
                        </Link>
                        <Link 
                            to="/"
                            onClick={(e) => handleNavClick(e, '/', 'apropos')}
                            className={`transition-colors font-medium ${
                                location.hash === '#apropos' ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            À propos
                        </Link>
                        <Link 
                            to="/voitures" 
                            className={`transition-colors font-medium ${
                                isActive('/voitures') ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            Voitures
                        </Link>
                        <Link 
                            to="/"
                            onClick={(e) => handleNavClick(e, '/', 'contact')}
                            className={`transition-colors font-medium ${
                                location.hash === '#contact' ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            Contact
                        </Link>

                        {/* --------------------------------------------------------- */}
                        {/* LIENS ADMIN (Affichés UNIQUEMENT si l'utilisateur est Admin) */}
                        {/* --------------------------------------------------------- */}
                        {user && user.roles?.includes('ROLE_ADMIN') && (
                            <>
                                {/* 👇 LIEN UNIQUE : Réservations */}
                                {/* C'est ici que l'admin clique pour voir les Stats + le Tableau complet */}
                                <Link 
                                    to="/admin/reservations" 
                                    className={`transition-colors font-medium flex items-center gap-1 ${
                                        isActive('/admin/reservations') 
                                            ? 'text-blue-400' // Couleur quand le lien est actif
                                            : 'text-gray-300 hover:text-white' // Couleur normale
                                    }`}
                                >
                                    <span>Réservations</span>
                                </Link>
                                
                                {/* ✅ J'AI SUPPRIMÉ LE LIEN "DASHBOARD" ICI COMME DEMANDÉ */}
                                {/* Il n'y a plus qu'un seul lien admin pour tout gérer */}
                            </>
                        )}
                    </div>

                    {/* --- BOUTON LOGIN / LOGOUT --- */}
                    {!user ? (
                        // Si pas connecté : Afficher le bouton Login
                        <Link 
                            to="/login" 
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
                        >
                            <FaUser size={18} />
                            <span>Login</span>
                        </Link>
                    ) : (
                        // Si connecté : Afficher le bouton Logout
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