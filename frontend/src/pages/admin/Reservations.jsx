import { useEffect, useState } from 'react';
import api from '../../services/api'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReservationTable from '../../components/admin/ReservationTable'; 

const Reservations = () => {
    // États pour les statistiques (comme ton ancien dashboard)
    const [stats, setStats] = useState({ 
        enAttente: 0, 
        confirmees: 0, 
        annulees: 0, 
        totalUtilisateurs: 0 
    });

    const [reservations, setReservations] = useState([]);
    const [users, setUsers] = useState([]); 
    
    // L'onglet par défaut est "En attente" comme sur ton exemple
    const [filter, setFilter] = useState('En attente');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            const [resRes, usersRes] = await Promise.all([
                api.get('/reservation/admin/reservations'), 
                api.get('/admin/clients') 
            ]);

            const allRes = Array.isArray(resRes.data) ? resRes.data : [];
            const userData = usersRes.data;

            // Gestion des utilisateurs (pour afficher le count)
            let usersList = [];
            let totalUsersCount = 0;

            if (userData && typeof userData === 'object') {
                if (userData.clients !== undefined) {
                    usersList = Array.isArray(userData.clients) ? userData.clients : [];
                    totalUsersCount = typeof userData.count === 'number' ? userData.count : usersList.length;
                } else if (Array.isArray(userData)) {
                    usersList = userData;
                    totalUsersCount = userData.length;
                }
            }

            // Mise à jour des stats
            setStats({
                enAttente: allRes.filter(r => r.statut === 'en_attente').length,
                confirmees: allRes.filter(r => r.statut === 'confirmee').length,
                annulees: allRes.filter(r => r.statut === 'annulee').length,
                totalUtilisateurs: totalUsersCount
            });

            setUsers(usersList);
            setReservations(allRes);
            
        } catch (error) {
            console.error("Erreur de chargement :", error);
            toast.error("Impossible de charger les données.");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (id) => {
        try {
            await api.put(`/reservation/admin/reservations/${id}/status`, { statut: 'confirmee' });
            toast.success("Réservation confirmée !");
            fetchData(); 
        } catch (error) {
            toast.error("Échec de la confirmation.");
        }
    };

    const handleCancel = async (id) => {
        try {
            await api.put(`/reservation/admin/reservations/${id}/status`, { statut: 'annulee' });
            toast.success("Réservation annulée.");
            fetchData(); 
        } catch (error) {
            toast.error("Échec de l'annulation.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-3"></div>
                    <p className="text-gray-600 text-sm font-medium">Chargement...</p>
                </div>
            </div>
        );
    }

    // Filtrage selon l'onglet choisi
    const filteredReservations = reservations.filter(r => {
        if (filter === 'En attente') return r.statut === 'en_attente';
        if (filter === 'Confirmées') return r.statut === 'confirmee';
        if (filter === 'Annulées') return r.statut === 'annulee';
        return false;
    });

    return (
        <div className="min-h-screen bg-white p-6">
            <ToastContainer position="top-right" />
            
            <div className="max-w-7xl mx-auto">
                {/* En-tête EXACTEMENT comme ton exemple */}
                <div className="mb-8">
                    <p className="text-sm text-gray-500 mb-2">Gérez les réservations et les utilisateurs</p>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                </div>

                {/* CARTES STATISTIQUES - Exactement comme ton exemple Figma */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Carte 1 : Réservations en attente */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Réservations en attente</p>
                                <p className="text-4xl font-bold text-orange-500 mt-3">{stats.enAttente}</p>
                            </div>
                            <svg className="w-6 h-6 text-orange-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    
                    {/* Carte 2 : Réservations confirmées */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Réservations confirmées</p>
                                <p className="text-4xl font-bold text-green-500 mt-3">{stats.confirmees}</p>
                            </div>
                            <svg className="w-6 h-6 text-green-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Carte 3 : Total utilisateurs */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Total utilisateurs</p>
                                <p className="text-4xl font-bold text-blue-500 mt-3">{stats.totalUtilisateurs}</p>
                            </div>
                            <svg className="w-6 h-6 text-blue-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* ONGLETS DE FILTRE - Exactement comme ton exemple */}
                <div className="mb-6">
                    <div className="inline-flex bg-gray-100 rounded-lg p-1">
                        {['En attente', 'Confirmées', 'Annulées', 'Utilisateurs'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                    filter === tab 
                                        ? 'bg-white text-gray-900 shadow-sm border border-gray-200' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {tab} ({
                                    tab === 'En attente' ? stats.enAttente : 
                                    tab === 'Confirmées' ? stats.confirmees : 
                                    tab === 'Annulées' ? stats.annulees : 
                                    stats.totalUtilisateurs
                                })
                            </button>
                        ))}
                    </div>
                </div>

                {/* TABLEAU - Change selon l'onglet */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {filter === 'Utilisateurs' ? 'Utilisateurs enregistrés' : `Réservations ${filter.toLowerCase()}`}
                        </h2>
                    </div>
                    
                    <div className="p-6">
                        {filter === 'Utilisateurs' ? (
                            /* Tableau des UTILISATEURS */
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                                            <th className="pb-4 pr-6">Nom</th>
                                            <th className="pb-4 pr-6">Email</th>
                                            <th className="pb-4 pr-6">Rôle</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="py-4 pr-6 text-sm font-medium text-gray-900 capitalize">
                                                    {user.nom} {user.prenom}
                                                </td>
                                                <td className="py-4 pr-6 text-sm text-gray-600">{user.email}</td>
                                                <td className="py-4 pr-6">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                                        user.roles?.includes('ROLE_ADMIN') 
                                                            ? 'bg-purple-100 text-purple-700' 
                                                            : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                        {user.roles?.includes('ROLE_ADMIN') ? 'Admin' : 'Client'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="py-8 text-center text-sm text-gray-500">
                                                    Aucun utilisateur trouvé.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            /* Tableau des RÉSERVATIONS */
                            filteredReservations.length > 0 ? (
                                <ReservationTable 
                                    reservations={filteredReservations}
                                    onConfirm={handleConfirm}
                                    onCancel={handleCancel}
                                />
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    Aucune réservation {filter.toLowerCase()} pour le moment.
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reservations;