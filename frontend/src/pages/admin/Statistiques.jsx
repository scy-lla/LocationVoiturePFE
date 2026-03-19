import { useEffect, useState } from 'react';
import api from '../../services/api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Statistiques = () => {
    const [vueAnnuelle, setVueAnnuelle] = useState(true); // true = Annuelle, false = Mensuelle
    const [stats, setStats] = useState({ total: 0, revenu: 0, taux: 0 });
    const [revenusMensuels, setRevenusMensuels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, [vueAnnuelle]); // Re-fetch quand on change de vue

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await api.get('/reservation/admin/reservations');
            const allRes = Array.isArray(res.data) ? res.data : [];

            // --- CALCULS GLOBAUX ---
            const now = new Date();
            const currentMonth = now.getMonth(); // 0-11
            const currentYear = now.getFullYear();

            // Filtrer les réservations confirmées pour les calculs de revenus
            const confirmedRes = allRes.filter(r => r.statut === 'confirmee');
            
            // Réservations et Revenus du Mois/Année en cours
            const filteredForPeriod = confirmedRes.filter(r => {
                const dateRes = new Date(r.dateDebut); // Ou dateFin, selon ta logique
                if (vueAnnuelle) {
                    return dateRes.getFullYear() === currentYear;
                } else {
                    return dateRes.getMonth() === currentMonth && dateRes.getFullYear() === currentYear;
                }
            });

            const totalPeriod = filteredForPeriod.length;
            const revenuPeriod = filteredForPeriod.reduce((acc, curr) => acc + (curr.prix_total || 0), 0);
            
            // Taux de confirmation global
            const totalAll = allRes.length;
            const tauxConfirmation = totalAll > 0 ? Math.round((confirmedRes.length / totalAll) * 100) : 0;

            setStats({
                total: totalPeriod,
                revenu: revenuPeriod,
                taux: tauxConfirmation
            });

            // --- PRÉPARATION DES DONNÉES POUR LE TABLEAU (Revenus Mensuels) ---
            const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
            const monthlyData = [];

            if (vueAnnuelle) {
                // Vue Annuelle : On affiche les 12 mois de l'année en cours
                for (let i = 0; i < 12; i++) {
                    const monthRes = confirmedRes.filter(r => {
                        const d = new Date(r.dateDebut);
                        return d.getMonth() === i && d.getFullYear() === currentYear;
                    });
                    const monthRevenue = monthRes.reduce((acc, curr) => acc + (curr.prix_total || 0), 0);
                    
                    monthlyData.push({
                        month: months[i],
                        revenue: monthRevenue,
                        count: monthRes.length
                    });
                }
            } else {
                // Vue Mensuelle : On pourrait afficher les jours, mais gardons simple pour l'instant
                // Ou on affiche juste un message "Détail par jour à venir"
                monthlyData.push({ month: 'Détail par jour', revenue: 0, count: 0, isPlaceholder: true });
            }

            setRevenusMensuels(monthlyData);

        } catch (error) {
            console.error("Erreur stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Chargement des statistiques...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <ToastContainer position="top-right" />
            <div className="max-w-6xl mx-auto">
                
                {/* --- EN-TÊTE AVEC BOUTONS --- */}
                <div className="flex justify-center mb-10">
                    <div className="bg-white p-1 rounded-full shadow-sm border border-gray-200 inline-flex">
                        <button
                            onClick={() => setVueAnnuelle(false)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                                !vueAnnuelle 
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Vue Mensuelle
                        </button>
                        <button
                            onClick={() => setVueAnnuelle(true)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                                vueAnnuelle 
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Vue Annuelle
                        </button>
                    </div>
                </div>

                {/* --- CARTES STATISTIQUES --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Carte 1 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
                        <h3 className="text-gray-600 text-sm font-medium mb-2">
                            {vueAnnuelle ? `Réservations ${new Date().getFullYear()}` : 'Réservations ce mois'}
                        </h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-orange-500">{stats.total}</span>
                            <span className="text-gray-400 text-sm">réservations</span>
                        </div>
                    </div>

                    {/* Carte 2 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
                        <h3 className="text-gray-600 text-sm font-medium mb-2">
                            {vueAnnuelle ? `Revenus ${new Date().getFullYear()}` : 'Revenus ce mois'}
                        </h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-green-500">{stats.revenu}</span>
                            <span className="text-gray-400 text-sm">MAD</span>
                        </div>
                    </div>

                    {/* Carte 3 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                        <h3 className="text-gray-600 text-sm font-medium mb-2">
                            {vueAnnuelle ? 'Revenu moyen/mois' : 'Taux de confirmation'}
                        </h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-purple-500">
                                {vueAnnuelle 
                                    ? (stats.revenu / 12).toFixed(0) 
                                    : stats.taux
                                }
                            </span>
                            <span className="text-gray-400 text-sm">
                                {vueAnnuelle ? 'MAD' : '%'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- TABLEAU REVENUS MENSUELS --- */}
                {vueAnnuelle && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800">Revenus mensuels {new Date().getFullYear()}</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {revenusMensuels.map((data, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-gray-600 font-medium w-24">{data.month}</span>
                                        <div className="flex-1 mx-4">
                                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                                {/* Barre de progression simulée */}
                                                <div 
                                                    className="bg-gradient-to-r from-blue-400 to-purple-500 h-2.5 rounded-full" 
                                                    style={{ width: `${Math.min((data.revenue / (stats.revenu || 1)) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <span className="text-gray-800 font-bold w-32 text-right">
                                            {data.revenue} MAD <span className="text-gray-400 text-xs font-normal">({data.count} rés.)</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {!vueAnnuelle && (
                    <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
                        <p className="text-gray-500">📊 Détail jour par jour disponible prochainement...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Statistiques;