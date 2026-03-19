import React from 'react';

/**
 * COMPOSANT : ReservationTable
 * Rôle : Afficher la liste des réservations sous forme de tableau.
 * Il reçoit les données et les fonctions d'action via les props.
 */
const ReservationTable = ({ reservations, onConfirm, onCancel }) => {
    
    // Sécurité : Si la liste est vide, on n'affiche rien.
    if (!reservations || reservations.length === 0) {
        return null;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                {/* En-tête du tableau */}
                <thead>
                    <tr className="text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                        <th className="pb-4 pr-6">Client</th>
                        <th className="pb-4 pr-6">Voiture</th>
                        <th className="pb-4 pr-6">Dates</th>
                        <th className="pb-4 pr-6">Statut</th>
                        <th className="pb-4 text-center">Actions</th>
                    </tr>
                </thead>
                
                {/* Corps du tableau */}
                <tbody className="divide-y divide-gray-100">
                    {reservations.map((res) => (
                        <tr key={res.id} className="hover:bg-gray-50">
                            
                            {/* Colonne Client */}
                            <td className="py-4 pr-6">
                                <div className="text-sm font-medium text-gray-900">{res.utilisateur_nom}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{res.utilisateur_email}</div>
                            </td>

                            {/* Colonne Voiture */}
                            <td className="py-4 pr-6">
                                <div className="text-sm text-gray-900">{res.voiture_modele}</div>
                            </td>

                            {/* Colonne Dates */}
                            <td className="py-4 pr-6">
                                <div className="text-xs text-gray-600 space-y-0.5">
                                    <div>Début: {res.dateDebut}</div>
                                    <div>Fin: {res.dateFin}</div>
                                </div>
                            </td>

                            {/* Colonne Statut (Badge coloré) */}
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

                            {/* Colonne Actions (Boutons) */}
                            <td className="py-4 text-center">
                                <div className="flex justify-center space-x-2">
                                    {/* Bouton Confirmer : Visible seulement si en attente */}
                                    {res.statut === 'en_attente' && (
                                        <button 
                                            onClick={() => onConfirm(res.id)}
                                            className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            Confirmer
                                        </button>
                                    )}
                                    
                                    {/* Bouton Annuler : Toujours visible */}
                                    <button 
                                        onClick={() => onCancel(res.id)}
                                        className="px-4 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReservationTable;