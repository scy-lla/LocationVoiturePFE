import { useState, useEffect } from 'react';
import axios from 'axios';
// Import des icônes pour l'affichage
import { FaUser, FaCalendar, FaCog, FaGasPump } from 'react-icons/fa';
// ✅ IMPORT DU NOUVEAU COMPOSANT MODAL
import FormulaireReservation from '../components/FormulaireReservation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Voitures = () => {
    const [voitures, setVoitures] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // État pour gérer l'ouverture du modal de réservation
    // Si voitureSelectionnee est null, le modal est fermé. Sinon, il s'ouvre avec cette voiture.
    const [voitureSelectionnee, setVoitureSelectionnee] = useState(null);

    const [filtres, setFiltres] = useState({
        categorie: 'Tous types',
        transmission: 'Toutes',
        carburant: 'Tous',
        prixMax: ''
    });

    useEffect(() => {
        chargerVoitures();
    }, []);

    const chargerVoitures = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/voitures');
            console.log('✅ Réponse API Voitures:', response.data);
            
            const voituresData = response.data.member || response.data['hydra:member'] || response.data;
            
            if (Array.isArray(voituresData)) {
                setVoitures(voituresData);
            } else {
                console.error('❌ Erreur format données');
                setVoitures([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Erreur API:', error);
            setLoading(false);
        }
    };

    // Fonction de filtrage des voitures selon les critères choisis
    const filtrerVoitures = () => {
        return voitures.filter(voiture => {
            const matchCategorie = filtres.categorie === 'Tous types' || voiture.categorie === filtres.categorie;
            const matchTransmission = filtres.transmission === 'Toutes' || voiture.transmission === filtres.transmission;
            const matchCarburant = filtres.carburant === 'Tous' || voiture.carburant === filtres.carburant;
            const matchPrix = filtres.prixMax === '' || parseFloat(voiture.prix_jour) <= parseFloat(filtres.prixMax);
            return matchCategorie && matchTransmission && matchCarburant && matchPrix;
        });
    };

    const voituresFiltrees = filtrerVoitures();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-6 text-gray-600 text-xl">Chargement des voitures...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer position="top-right" />
            
            {/* Header */}
            <div className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">Notre Collection DriveNow</h1>
                    <p className="text-2xl text-gray-400">Découvrez nos véhicules d'exception</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filtres (Gauche) */}
                    <div className="w-full lg:w-80 bg-white rounded-2xl shadow-xl p-8 h-fit sticky top-4">
                        <h3 className="text-2xl font-bold mb-8 text-gray-800">Filtres de recherche</h3>
                        
                        {/* Select Catégorie */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Type de voiture</label>
                            <select 
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filtres.categorie}
                                onChange={(e) => setFiltres({...filtres, categorie: e.target.value})}
                            >
                                <option>Tous types</option>
                                <option>Berline</option>
                                <option>SUV</option>
                                <option>Sport</option>
                                <option>Citadine</option>
                                <option>Luxe</option>
                            </select>
                        </div>

                        {/* Select Transmission */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Transmission</label>
                            <select 
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filtres.transmission}
                                onChange={(e) => setFiltres({...filtres, transmission: e.target.value})}
                            >
                                <option>Toutes</option>
                                <option>Manuelle</option>
                                <option>Automatique</option>
                            </select>
                        </div>

                        {/* Select Carburant */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Type de carburant</label>
                            <select 
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filtres.carburant}
                                onChange={(e) => setFiltres({...filtres, carburant: e.target.value})}
                            >
                                <option>Tous</option>
                                <option>Essence</option>
                                <option>Diesel</option>
                                <option>Électrique</option>
                                <option>Hybride</option>
                            </select>
                        </div>

                        {/* Input Prix Max */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Prix maximum (MAD/jour)</label>
                            <input 
                                type="number" min="0" step="10" placeholder="Ex: 500"
                                value={filtres.prixMax}
                                onChange={(e) => setFiltres({...filtres, prixMax: e.target.value})}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Bouton Reset */}
                        <button 
                            onClick={() => setFiltres({categorie: 'Tous types', transmission: 'Toutes', carburant: 'Tous', prixMax: ''})}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                        >
                            Réinitialiser
                        </button>
                    </div>

                    {/* Grille des voitures (Droite) */}
                    <div className="flex-1">
                        <div className="mb-8 flex justify-between items-center bg-white rounded-xl p-6 shadow-lg">
                            <p className="text-xl text-gray-700">
                                <span className="font-bold text-2xl text-blue-600">{voituresFiltrees.length}</span> véhicules disponibles
                            </p>
                        </div>

                        {voituresFiltrees.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                                <div className="text-6xl mb-4">😔</div>
                                <p className="text-gray-500 text-xl">Aucun véhicule ne correspond à vos critères</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {voituresFiltrees.map(voiture => (
                                    <div key={voiture.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                        {/* Image de la voiture */}
                                        <div className="relative">
                                            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                                                {voiture.image ? (
                                                    <img src={`http://127.0.0.1:8000${voiture.image}`} alt={voiture.modele} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-gray-400 text-6xl">🚗</span>
                                                )}
                                            </div>
                                            <span className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                                {voiture.categorie}
                                            </span>
                                        </div>

                                        {/* Contenu de la carte */}
                                        <div className="p-5">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{voiture.marque}</h3>
                                            <p className="text-sm text-gray-500 mb-5">{voiture.modele}</p>
                                            
                                            {/* Icônes caractéristiques */}
                                            <div className="grid grid-cols-2 gap-2 mb-5">
                                                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-2 py-2">
                                                    <FaCalendar className="text-purple-500" size={16} />
                                                    <span className="text-gray-600 text-xs">{voiture.annee}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-2 py-2">
                                                    <FaCog className="text-gray-400" size={16} />
                                                    <span className="text-gray-600 text-xs">{voiture.transmission}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-2 py-2">
                                                    <FaGasPump className="text-orange-500" size={16} />
                                                    <span className="text-gray-600 text-xs">{voiture.carburant}</span>
                                                </div>
                                            </div>

                                            {/* Prix et Bouton Réserver */}
                                            <div className="border-t border-gray-200 pt-4">
                                                <div className="mb-4">
                                                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                                        {voiture.prix_jour} MAD
                                                    </span>
                                                    <span className="text-gray-400 text-xs ml-1">/ jour</span>
                                                </div>
                                                
                                                {/* 👇 BOUTON QUI OUVRE LE MODAL */}
                                                <button 
                                                    onClick={() => setVoitureSelectionnee(voiture)}
                                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                                                >
                                                    Réserver
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 👇 AFFICHAGE CONDITIONNEL DU MODAL DE RÉSERVATION */}
            {voitureSelectionnee && (
                <FormulaireReservation 
                    voiture={voitureSelectionnee} 
                    onClose={() => setVoitureSelectionnee(null)}
                    onSuccess={() => {
                        // Quand la réservation réussit, on ferme le modal et on recharge la page (optionnel)
                        setVoitureSelectionnee(null);
                        chargerVoitures(); 
                    }}
                />
            )}
        </div>
    );
};

export default Voitures;