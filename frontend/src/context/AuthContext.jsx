/*AuthContext.jsx 
Ce fichier gère toute la connexion/déconnexion de l'application :

Vérifie si l'utilisateur était déjà connecté au démarrage
Login → envoie email/password au backend → sauvegarde le token JWT
Register → crée un nouveau compte
Logout → supprime le token du navigateur
isAdmin → lit le token JWT pour savoir si c'est un admin
Partage tout ça à tous les composants via le contexte React*/

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

// Création du contexte d'authentification
// Ce contexte permet de partager l'état de connexion dans toute l'application
// sans avoir à passer les props manuellement à chaque composant
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    // user : contient les infos de l'utilisateur connecté (token + email)
    // null = personne n'est connecté
    const [user, setUser] = useState(null);

    // loading : true pendant qu'on vérifie si un token existe dans localStorage
    // évite un flash de la page login avant que la vérification soit faite
    const [loading, setLoading] = useState(true);

    // Au démarrage de l'application, on vérifie si l'utilisateur
    // était déjà connecté (token sauvegardé dans le navigateur)
    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        if (token) {
            // Si un token existe → on restaure la session
            setUser({ token, email });
        }
        // Dans tous les cas, on arrête le chargement
        setLoading(false);
    }, []); // [] = s'exécute une seule fois au montage du composant

    // Fonction de connexion
    // Envoie email + password au backend → reçoit un token JWT en retour
    const login = async (email, password) => {
        try {
            const response = await api.post('/login_check', { email, password });
            const token = response.data.token;

            // On sauvegarde le token et l'email dans localStorage
            // pour que la session persiste même après un refresh de page
            localStorage.setItem('token', token);
            localStorage.setItem('email', email);

            // On met à jour l'état global
            setUser({ token, email });

            return response.data;
        } catch (error) {
            // Symfony JWT retourne { message: "Invalid credentials." }
            // On traduit ce message en français pour l'utilisateur
            const message = error.response?.data?.message;
            if (message === 'Invalid credentials.') {
                throw new Error('Email ou mot de passe incorrect');
            }
            throw new Error(message || 'Email ou mot de passe incorrect');
        }
    };

    // Fonction d'inscription
    // Envoie les données du formulaire au backend pour créer un nouveau compte
    const register = async (userData) => {
        try {
            const response = await api.post('/register', userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Erreur lors de l'inscription");
        }
    };

    // Fonction de déconnexion
    // Supprime le token et l'email du navigateur et réinitialise l'état
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setUser(null);
    };

    // Vérifie si l'utilisateur connecté a le rôle administrateur
    // Le token JWT contient les rôles dans sa partie "payload" (partie centrale)
    // Structure JWT : header.payload.signature (séparés par des points)
    const isAdmin = () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        try {
            // On extrait la partie payload du token (index 1)
            const base64Url = token.split('.')[1];

            // On convertit le format base64url en base64 standard
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

            // On décode et on parse le JSON pour lire les rôles
            const payload = JSON.parse(window.atob(base64));

            // On vérifie si le tableau des rôles contient ROLE_ADMIN
            return payload.roles?.includes('ROLE_ADMIN');
        } catch (e) {
            // Si le token est malformé ou expiré → on retourne false
            return false;
        }
    };

    // On expose toutes les fonctions et données nécessaires
    // à tous les composants enfants via le contexte
    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAdmin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personnalisé pour utiliser facilement le contexte
// Au lieu d'écrire useContext(AuthContext) partout,
// on écrit simplement useAuth()
export const useAuth = () => {
    const context = useContext(AuthContext);
    // Sécurité : si on utilise useAuth en dehors de AuthProvider → erreur claire
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};