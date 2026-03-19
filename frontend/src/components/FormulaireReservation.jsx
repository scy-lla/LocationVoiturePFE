import { useState } from 'react';
import api from '../services/api'; // Assure-toi que ce fichier existe et pointe vers ton backend
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormulaireReservation = ({ voiture, onClose, onSuccess }) => {
    // États pour stocker les valeurs des inputs
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    
    // États pour le calcul automatique
    const [nbJours, setNbJours] = useState(0);
    const [prixTotal, setPrixTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // Fonction appelée à chaque changement de date pour recalculer le prix
    const calculerPrix = (debut, fin) => {
        if (!debut || !fin) return;

        const start = new Date(debut);
        const end = new Date(fin);

        // Vérification logique : la fin doit être après le début
        if (end <= start) {
            setNbJours(0);
            setPrixTotal(0);
            return;
        }

        // Calcul de la différence en millisecondes, puis conversion en jours
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        const jours = diffDays === 0 ? 1 : diffDays;
        
        setNbJours(jours);
        // Prix Total = Jours × Prix Journalier de la voiture
        setPrixTotal(jours * voiture.prix_jour);
    };

    // Gestionnaire de soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Préparation des données au format ISO attendu par Symfony
            const reservationData = {
                dateDebut: new Date(dateDebut).toISOString(),
                dateFin: new Date(dateFin).toISOString(),
                voiture_id: voiture.id
                // Note: L'utilisateur est récupéré automatiquement par le Backend via le Token JWT
            };

            // Envoi de la requête POST à l'API
            const response = await api.post('/reservation/', reservationData);

            // Succès !
            toast.success(response.data.message || 'Réservation créée avec succès !');
            
            if (onSuccess) onSuccess(); // Callback pour prévenir le parent
            onClose(); // Fermer le modal

        } catch (error) {
            console.error("Erreur réservation:", error);
            
            // Gestion des erreurs spécifiques renvoyées par Symfony
            if (error.response) {
                if (error.response.status === 409) {
                    // Code 409 = Conflit (Voiture déjà réservée)
                    toast.error(error.response.data.error || 'Ce véhicule n\'est pas disponible sur ces dates.');
                } else if (error.response.status === 400) {
                    toast.error(error.response.data.error || 'Données invalides.');
                } else {
                    toast.error('Une erreur est survenue.');
                }
            } else {
                toast.error('Erreur de connexion au serveur.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        // Overlay sombre en arrière-plan
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <ToastContainer position="top-right" />
            
            {/* Boîte blanche du Modal */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                
                {/* En-tête coloré */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <h2 className="text-2xl font-bold mb-1">Réserver ce véhicule</h2>
                    <p className="text-blue-100 text-sm">{voiture.marque} {voiture.modele}</p>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {/* Input Date Début */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Date de début</label>
                        <input 
                            type="date" required
                            min={new Date().toISOString().split('T')[0]} // Empêche de choisir une date passée
                            value={dateDebut}
                            onChange={(e) => {
                                setDateDebut(e.target.value);
                                calculerPrix(e.target.value, dateFin);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Input Date Fin */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Date de fin</label>
                        <input 
                            type="date" required
                            min={dateDebut || new Date().toISOString().split('T')[0]}
                            value={dateFin}
                            onChange={(e) => {
                                setDateFin(e.target.value);
                                calculerPrix(dateDebut, e.target.value);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Résumé du Prix (Affiché seulement si calcul valide) */}
                    {nbJours > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Durée :</span>
                                <span className="font-medium">{nbJours} jour(s)</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Prix / jour :</span>
                                <span className="font-medium">{voiture.prix_jour} MAD</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-800">Total à payer :</span>
                                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                    {prixTotal} MAD
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex gap-3 pt-4">
                        <button 
                            type="button" onClick={onClose} disabled={loading}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit" disabled={loading || nbJours === 0}
                            className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-all ${
                                loading || nbJours === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg'
                            }`}
                        >
                            {loading ? 'Traitement...' : 'Confirmer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormulaireReservation;