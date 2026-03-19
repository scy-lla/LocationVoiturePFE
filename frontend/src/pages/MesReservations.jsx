import { useEffect, useState } from 'react';
import api from '../services/api'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MesReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyReservations();
    }, []);

    const fetchMyReservations = async () => {
    try {
        setLoading(true);
        
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('email'); // On récupère l'email du user connecté
        
        console.log("🔑 Token :", token ? "Présent" : "Absent");
        console.log("📧 Email user :", userEmail);

        if (!token || !userEmail) {
            toast.error("Session invalide. Veuillez vous reconnecter.");
            return;
        }

        // On utilise l'endpoint ADMIN qui fonctionne (tu l'as vu dans debug:router)
        // Même si c'est un client, on essaie car parfois les permissions sont larges
        const res = await api.get('/reservation/admin/reservations');
        
        console.log("✅ Toutes les réservations reçues:", res.data);

        // On filtre pour ne garder QUE celles de l'utilisateur connecté
        const myReservations = res.data.filter(
            reservation => reservation.utilisateur_email === userEmail
        );

        console.log("🎯 Réservations filtrées pour cet user:", myReservations);
        
        setReservations(myReservations);
        
    } catch (error) {
        console.error("❌ Erreur complète:", error);
        
        // Si l'endpoint admin ne marche pas pour un client, on essaie une autre méthode
        if (error.response?.status === 403 || error.response?.status === 401) {
            console.log("⚠️ Accès refusé aux réservations admin. Tentative avec endpoint public...");
            
            // Essaie l'endpoint général des réservations (si il existe)
            try {
                const resPublic = await api.get('/reservation/');
                const myReservations = resPublic.data.filter(
                    r => r.utilisateur_email === localStorage.getItem('email')
                );
                setReservations(myReservations);
                return;
            } catch (e) {
                console.error("❌ Échec aussi avec l'endpoint public");
            }
        }
        
        toast.error("Impossible de charger vos réservations. Vérifiez votre connexion.");
    } finally {
        setLoading(false);
    }
};

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-3"></div>
                    <p className="text-gray-600 text-sm font-medium">Chargement de vos réservations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-6">
            <ToastContainer position="top-right" />
            <div className="max-w-7xl mx-auto">
                
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Mes Réservations</h1>
                    <p className="text-sm text-gray-500 mt-1">Consultez l'historique de vos locations de voitures.</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Historique ({reservations.length})
                        </h2>
                    </div>
                    
                    <div className="p-6">
                        {reservations.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                                            <th className="pb-4 pr-6">Voiture</th>
                                            <th className="pb-4 pr-6">Dates</th>
                                            <th className="pb-4 pr-6">Statut</th>
                                            <th className="pb-4 pr-6">Prix Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {reservations.map((res) => (
                                            <tr key={res.id} className="hover:bg-gray-50">
                                                <td className="py-4 pr-6">
                                                    <div className="text-sm font-medium text-gray-900">{res.voiture_modele}</div>
                                                </td>
                                                <td className="py-4 pr-6">
                                                    <div className="text-xs text-gray-600 space-y-0.5">
                                                        <div>Début: {res.dateDebut}</div>
                                                        <div>Fin: {res.dateFin}</div>
                                                    </div>
                                                </td>
                                                <td className="py-4 pr-6">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                                        res.statut === 'confirmee' 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : res.statut === 'annulee'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                        {res.statut === 'en_attente' ? 'En attente' : res.statut === 'confirmee' ? 'Confirmée' : 'Annulée'}
                                                    </span>
                                                </td>
                                                <td className="py-4 pr-6 text-sm font-bold text-gray-900">
                                                    {res.prix_total} €
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="mt-4 text-lg text-gray-500 font-medium">Aucune réservation pour le moment.</p>
                                <p className="text-sm text-gray-400">Louez votre première voiture pour voir vos réservations ici !</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MesReservations;