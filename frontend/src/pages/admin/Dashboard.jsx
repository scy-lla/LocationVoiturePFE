import { useEffect, useState } from 'react';
import api from '../../services/api'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReservationTable from '../../components/admin/ReservationTable'; 

const Dashboard = () => {
    const [stats, setStats] = useState({ 
        enAttente: 0, 
        confirmees: 0, 
        annulees: 0, 
        totalUtilisateurs: 0 
    });
    const [reservations, setReservations] = useState([]);
    const [users, setUsers] = useState([]); 
    const [filter, setFilter] = useState('En attente');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            const [resRes, usersRes] = await Promise.all([
                api.get('/reservation/admin/reservations'),
                api.get('/admin/clients')
            ]);

            const allRes = Array.isArray(resRes.data) ? resRes.data : [];
            const userData = usersRes.data;

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
            toast.error("Impossible de charger les donnees du dashboard.");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (id) => {
        try {
            await api.put(`/reservation/admin/reservations/${id}/confirm`);
            toast.success("Reservation confirmee !");
            fetchDashboardData();
        } catch (error) {
            toast.error("Echec de la confirmation.");
        }
    };

    const handleCancel = async (id) => {
        try {
            await api.put(`/reservation/admin/reservations/${id}/cancel`);
            toast.success("Reservation annulee.");
            fetchDashboardData();
        } catch (error) {
            toast.error("Echec de l'annulation.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-3"></div>
                    <p className="text-gray-600 text-sm">Chargement...</p>
                </div>
            </div>
        );
    }

    const filteredReservations = reservations.filter(r => {
        if (filter === 'En attente') return r.statut === 'en_attente';
        if (filter === 'Confirmees') return r.statut === 'confirmee';
        if (filter === 'Annulees') return r.statut === 'annulee';
        return false;
    });

    return (
        <div className="min-h-screen bg-white">
            <ToastContainer position="top-right" />
            
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <p className="text-sm text-gray-500 mb-2">Gerez les reservations et les utilisateurs</p>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Reservations en attente</p>
                                <p className="text-4xl font-bold text-orange-500 mt-3">{stats.enAttente}</p>
                            </div>
                            <svg className="w-6 h-6 text-orange-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Reservations confirmees</p>
                                <p className="text-4xl font-bold text-green-500 mt-3">{stats.confirmees}</p>
                            </div>
                            <svg className="w-6 h-6 text-green-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
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

                <div className="mb-6">
                    <div className="inline-flex bg-gray-100 rounded-lg p-1">
                        {['En attente', 'Confirmees', 'Annulees', 'Utilisateurs'].map((tab) => (
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
                                    tab === 'Confirmees' ? stats.confirmees : 
                                    tab === 'Annulees' ? stats.annulees : 
                                    stats.totalUtilisateurs
                                })
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {filter === 'Utilisateurs' ? 'Utilisateurs enregistres' : ''}
                        </h2>
                    </div>
                    
                    <div className="p-6">
                        {filter === 'Utilisateurs' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                                            <th className="pb-4 pr-6">Nom</th>
                                            <th className="pb-4 pr-6">Email</th>
                                            <th className="pb-4 pr-6">Role</th>
                                            <th className="pb-4">Date d'inscription</th>
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
                                                    {user.roles?.includes('ROLE_ADMIN') ? (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-600 text-white">
                                                            <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
                                                            Admin
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                            Client
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 text-sm text-gray-600">
                                                    {new Date(user.createdAt || Date.now()).toLocaleDateString('fr-FR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="py-8 text-center text-sm text-gray-500">
                                                    Aucun utilisateur trouve.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            filteredReservations.length > 0 ? (
                                <ReservationTable 
                                    reservations={filteredReservations}
                                    onConfirm={handleConfirm}
                                    onCancel={handleCancel}
                                />
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-sm text-gray-500">
                                        Aucune donnee a afficher.
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;