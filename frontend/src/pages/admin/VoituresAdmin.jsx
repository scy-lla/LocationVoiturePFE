import { useEffect, useState } from 'react';
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Voitures = () => {
    const [voitures, setVoitures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        marque: '',
        modele: '',
        annee: '',
        prixJour: '',
        disponibilite: true,
        immatriculation: '',
        categorie: '',
        carburant: '',
        transmission: '',
    });

    useEffect(() => {
        fetchVoitures();
    }, []);

    const fetchVoitures = async () => {
        try {
            const response = await api.get('/voitures');
            setVoitures(response.data['hydra:member'] || response.data || []);
        } catch (error) {
            toast.error('Erreur lors du chargement des voitures');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/voitures', {
                ...formData,
                annee: parseInt(formData.annee),
                prixJour: formData.prixJour.toString(),
            });
            toast.success('Voiture ajoutée avec succès !');
            setShowForm(false);
            setFormData({
                marque: '', modele: '', annee: '', prixJour: '',
                disponibilite: true, immatriculation: '', categorie: '',
                carburant: '', transmission: '',
            });
            fetchVoitures();
        } catch (error) {
            toast.error('Erreur lors de l\'ajout de la voiture');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Confirmer la suppression ?')) return;
        try {
            await api.delete(`/voitures/${id}`);
            toast.success('Voiture supprimée !');
            fetchVoitures();
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <ToastContainer />
            <div className="max-w-7xl mx-auto py-12 px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">🚗 Gestion des Voitures</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                    >
                        {showForm ? 'Annuler' : '+ Ajouter une voiture'}
                    </button>
                </div>

                {/* Formulaire ajout */}
                {showForm && (
                    <div className="bg-white p-6 rounded-lg shadow mb-8">
                        <h2 className="text-xl font-bold mb-4">Ajouter une voiture</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                                <input type="text" name="marque" value={formData.marque}
                                    onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                                <input type="text" name="modele" value={formData.modele}
                                    onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                                <input type="number" name="annee" value={formData.annee}
                                    onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prix/Jour (MAD)</label>
                                <input type="number" name="prixJour" value={formData.prixJour}
                                    onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Immatriculation</label>
                                <input type="text" name="immatriculation" value={formData.immatriculation}
                                    onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                <input type="text" name="categorie" value={formData.categorie}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Carburant</label>
                                <select name="carburant" value={formData.carburant}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="Essence">Essence</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Electrique">Électrique</option>
                                    <option value="Hybride">Hybride</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                                <select name="transmission" value={formData.transmission}
                                    onChange={handleChange} required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">Sélectionner</option>
                                    <option value="Manuelle">Manuelle</option>
                                    <option value="Automatique">Automatique</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <button type="submit"
                                    className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800"
                                >
                                    Ajouter la voiture
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Liste des voitures */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marque</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modèle</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Année</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix/Jour</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disponible</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {voitures.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                        Aucune voiture trouvée
                                    </td>
                                </tr>
                            ) : (
                                voitures.map((voiture) => (
                                    <tr key={voiture.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{voiture.id}</td>
                                        <td className="px-6 py-4">{voiture.marque}</td>
                                        <td className="px-6 py-4">{voiture.modele}</td>
                                        <td className="px-6 py-4">{voiture.annee}</td>
                                        <td className="px-6 py-4">{voiture.prixJour} MAD</td>
                                        <td className="px-6 py-4">
                                            {voiture.disponibilite ? (
                                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Oui</span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Non</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDelete(voiture.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                            >
                                                🗑️ Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Voitures;