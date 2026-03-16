import { useEffect, useState } from 'react';
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await api.get('/admin/clients');
            setClients(response.data.clients || []);
        } catch (error) {
            toast.error('Erreur lors du chargement des clients');
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
                <h1 className="text-3xl font-bold mb-8">👥 Liste des Clients</h1>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {clients.map((client) => (
                                <tr key={client.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{client.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{client.nom} {client.prenom}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {client.roles?.includes('ROLE_ADMIN') ? (
                                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Admin</span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Client</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Clients;