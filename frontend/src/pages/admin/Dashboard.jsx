import { useEffect, useState } from 'react';
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
    const [stats, setStats] = useState({ clients: 0, reservations: 0, voitures: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const clientsRes = await api.get('/admin/clients');
            setStats(prev => ({ ...prev, clients: clientsRes.data.count || 0 }));
        } catch (error) {
            toast.error('Erreur lors du chargement des statistiques');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <ToastContainer />
            <div className="max-w-7xl mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold mb-8">📊 Dashboard Admin</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-2">👥 Clients</h3>
                        <p className="text-4xl font-bold text-blue-600">{stats.clients}</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-2">📅 Réservations</h3>
                        <p className="text-4xl font-bold text-green-600">{stats.reservations}</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-2">🚗 Voitures</h3>
                        <p className="text-4xl font-bold text-yellow-600">{stats.voitures}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;