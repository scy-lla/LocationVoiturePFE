<?php

// ============================================================================
// FICHIER : src/Controller/Api/ReservationController.php
// RÔLE : Gère toutes les opérations liées aux réservations (CRUD + Logique métier)
// ============================================================================

namespace App\Controller\Api;

// --- IMPORTS DES CLASSES NÉCESSAIRES ---
use App\Entity\Reservation;      // Le modèle "Réservation" (table SQL)
use App\Entity\Voiture;          // Le modèle "Voiture" (pour lier une résa à une voiture)
use App\Entity\Utilisateur;      // Le modèle "Utilisateur" (pour lier une résa à un client)
use App\Service\ReservationService; // NOTRE SERVICE PERSONNALISÉ (contient la logique anti-conflit)
use App\Repository\ReservationRepository; // Outil pour lire les résas en BDD
use Doctrine\ORM\EntityManagerInterface;  // Outil pour écrire en BDD (persist/flush)
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController; // Classe de base Symfony
use Symfony\Component\HttpFoundation\JsonResponse; // Pour renvoyer du JSON
use Symfony\Component\HttpFoundation\Request; // Pour lire les données envoyées par React
use Symfony\Component\HttpFoundation\Response; // Pour les codes HTTP (200, 404, etc.)
use Symfony\Component\Routing\Attribute\Route; // Pour définir les URLs
use Symfony\Component\Security\Http\Attribute\IsGranted; // Pour sécuriser les routes (JWT)

// ============================================================================
// DÉFINITION DU CONTRÔLEUR
// ============================================================================

#[Route('/api/reservation')]
// PRÉFIXE GLOBAL : Toutes les routes de ce fichier commenceront par /api/reservation
// Ex: La fonction getReservations sera accessible via GET /api/reservation/

class ReservationController extends AbstractController
{
    // --- CONSTRUCTEUR (INJECTION DE DÉPENDANCES) ---
    // Symfony injecte automatiquement ces outils quand on utilise le contrôleur.
    
    public function __construct(
        private EntityManagerInterface $entityManager, // Outil d'écriture (Ajout/Modif/Suppr)
        private ReservationRepository $reservationRepository, // Outil de lecture (Recherche)
        private ReservationService $reservationService // Outil de logique métier (Vérif conflits)
    ) {
        // Rien à faire ici, Symfony a déjà rempli les variables privées ci-dessus.
    }

    // ==========================================================================
    // ENDPOINT 1 : GET /api/reservation/admin/reservations
    // RÔLE : Liste TOUTES les réservations (Réservé aux ADMINS)
    // ==========================================================================
    
    #[Route('/admin/reservations', name: 'api_admin_reservations_list', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')] // 🔐 SÉCURITÉ : Seul un utilisateur avec le rôle ROLE_ADMIN peut entrer ici.
    public function getAllReservations(): JsonResponse
    {
        // 1. Lecture : On récupère toutes les lignes de la table "reservation"
        $reservations = $this->reservationRepository->findAll();

        // 2. Formatage : On prépare les données pour le JSON (on évite les boucles infinies)
        $data = [];
        foreach ($reservations as $reservation) {
            $data[] = [
                'id' => $reservation->getId(),
                'dateDebut' => $reservation->getDateDebut()?->format('Y-m-d H:i:s'),
                'dateFin' => $reservation->getDateFin()?->format('Y-m-d H:i:s'),
                'statut' => $reservation->getStatut(),
                'prixTotal' => $reservation->getPrixTotal(), // ✅ Le prix figé
                // Infos sur le client (pour que l'admin sache qui a réservé)
                'client_email' => $reservation->getUtilisateur()?->getEmail(),
                'client_nom' => $reservation->getUtilisateur()?->getNom(),
                // Infos sur la voiture (pour que l'admin sache quelle voiture est prise)
                'voiture_id' => $reservation->getVoiture()?->getId(),
                'voiture_modele' => $reservation->getVoiture()?->getModele(),
            ];
        }

        // 3. Réponse : On renvoie le tableau au frontend avec le code 200 (OK)
        return new JsonResponse($data, Response::HTTP_OK);
    }

    // ==========================================================================
    // ENDPOINT 2 : PUT /api/reservation/admin/reservations/{id}/confirm
    // RÔLE : Un admin confirme une réservation (Change le statut à 'confirmee')
    // ==========================================================================

    #[Route('/admin/reservations/{id}/confirm', name: 'api_admin_reservation_confirm', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')] // 🔐 SÉCURITÉ : Réservé aux admins
    public function confirmReservation(int $id): JsonResponse
    {
        // 1. Recherche : On cherche la réservation par son ID
        $reservation = $this->reservationRepository->find($id);

        // 2. Vérification : Si elle n'existe pas, on renvoie une erreur 404
        if (!$reservation) {
            return new JsonResponse(['error' => 'Réservation introuvable'], Response::HTTP_NOT_FOUND);
        }

        // 3. Modification : On change le statut
        $reservation->setStatut('confirmee');

        // 4. Sauvegarde : On écrit le changement dans la base de données
        $this->entityManager->flush();

        // 5. Réponse : On confirme le succès
        return new JsonResponse([
            'success' => true,
            'message' => 'Réservation confirmée avec succès',
            'nouveau_statut' => $reservation->getStatut()
        ], Response::HTTP_OK);
    }

    // ==========================================================================
    // ENDPOINT 3 : PUT /api/reservation/admin/reservations/{id}/cancel
    // RÔLE : Un admin annule une réservation (Change le statut à 'annulee')
    // ==========================================================================

    #[Route('/admin/reservations/{id}/cancel', name: 'api_admin_reservation_cancel', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')] // 🔐 SÉCURITÉ : Réservé aux admins
    public function cancelReservation(int $id): JsonResponse
    {
        $reservation = $this->reservationRepository->find($id);

        if (!$reservation) {
            return new JsonResponse(['error' => 'Réservation introuvable'], Response::HTTP_NOT_FOUND);
        }

        $reservation->setStatut('annulee');
        $this->entityManager->flush();

        return new JsonResponse([
            'success' => true,
            'message' => 'Réservation annulée',
            'nouveau_statut' => $reservation->getStatut()
        ], Response::HTTP_OK);
    }

    // ==========================================================================
    // ENDPOINT 4 : GET /api/reservation/my
    // RÔLE : Un client voit SES propres réservations
    // ==========================================================================

    #[Route('/my', name: 'api_reservation_my', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')] // 🔐 SÉCURITÉ : Il faut être connecté (n'importe quel rôle)
    public function getMyReservations(): JsonResponse
    {
        // 1. Récupération de l'utilisateur connecté grâce au Token JWT
        /** @var \App\Entity\Utilisateur $user */
        $user = $this->getUser();

        // 2. Recherche : On demande au repository de trouver toutes les résas de CET utilisateur
        // (On suppose que tu as ajouté une méthode findByUtilisateur dans ton Repository, 
        // sinon on filtre manuellement ci-dessous)
        $toutesLesResas = $this->reservationRepository->findAll();
        $mesResas = [];

        foreach ($toutesLesResas as $resa) {
            // On garde seulement si la réservation appartient à l'utilisateur connecté
            if ($resa->getUtilisateur() && $resa->getUtilisateur()->getId() === $user->getId()) {
                $mesResas[] = [
                    'id' => $resa->getId(),
                    'dateDebut' => $resa->getDateDebut()?->format('Y-m-d'),
                    'dateFin' => $resa->getDateFin()?->format('Y-m-d'),
                    'statut' => $resa->getStatut(),
                    'prixTotal' => $resa->getPrixTotal(),
                    'voiture' => [
                        'id' => $resa->getVoiture()?->getId(),
                        'marque' => $resa->getVoiture()?->getMarque(),
                        'modele' => $resa->getVoiture()?->getModele(),
                        'image' => $resa->getVoiture()?->getImage(), // Pour afficher la photo
                    ]
                ];
            }
        }

        return new JsonResponse($mesResas, Response::HTTP_OK);
    }

    // ==========================================================================
    // ENDPOINT 5 : POST /api/reservation/
    // RÔLE : Un client crée une nouvelle réservation (CŒUR DU SYSTÈME)
    // ==========================================================================

    #[Route('/', name: 'api_reservation_create', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')] // 🔐 SÉCURITÉ : Il faut être connecté pour réserver
    public function createReservation(Request $request): JsonResponse
    {
        // --- ÉTAPE 1 : LECTURE DES DONNÉES ENVOYÉES PAR LE FRONTEND ---
        
        $data = json_decode($request->getContent(), true);
        
        // Vérifie si le JSON est valide
        if (json_last_error() !== JSON_ERROR_NONE) {
            return new JsonResponse(['error' => 'Format JSON invalide'], Response::HTTP_BAD_REQUEST);
        }

        // Vérifie les champs obligatoires
        if (!isset($data['dateDebut'], $data['dateFin'], $data['voiture_id'])) {
            return new JsonResponse([
                'error' => 'Données incomplètes. Il faut : dateDebut, dateFin, voiture_id'
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            // Convertit les chaînes de dates en objets DateTime PHP
            $dateDebut = new \DateTime($data['dateDebut']);
            $dateFin = new \DateTime($data['dateFin']);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Format de date incorrect (utilisez YYYY-MM-DD)'], Response::HTTP_BAD_REQUEST);
        }

        // Vérification logique simple : La fin ne peut pas être avant le début
        if ($dateFin <= $dateDebut) {
            return new JsonResponse(['error' => 'La date de fin doit être après la date de début'], Response::HTTP_BAD_REQUEST);
        }

        // --- ÉTAPE 2 : VÉRIFICATION DE LA VOITURE ---

        $voiture = $this->entityManager->getRepository(Voiture::class)->find($data['voiture_id']);
        
        if (!$voiture) {
            return new JsonResponse(['error' => 'La voiture demandée n\'existe pas'], Response::HTTP_NOT_FOUND);
        }

        // --- ÉTAPE 3 : VÉRIFICATION DES CONFLITS (LA MAGIE OPÈRE ICI) ---
        
        // On appelle notre Service personnalisé qui contient la logique de chevauchement
        $estDisponible = $this->reservationService->isAvailable($voiture, $dateDebut, $dateFin);

        if (!$estDisponible) {
            // Code 409 = Conflict. Le frontend devra afficher un message d'erreur.
            return new JsonResponse([
                'error' => 'Ce véhicule n\'est pas disponible sur cette période.',
                'details' => 'Il existe déjà une réservation confirmée ou en attente qui chevauche vos dates.'
            ], Response::HTTP_CONFLICT);
        }

        // --- ÉTAPE 4 : CALCUL DU PRIX TOTAL ---

        // Calcule la différence entre les deux dates
        $interval = $dateDebut->diff($dateFin);
        $nbJours = $interval->days;
        
        // Sécurité : Si la différence est de 0 jour (même jour), on compte 1 jour minimum
        if ($nbJours === 0) {
            $nbJours = 1;
        }

        // Prix Total = Nombre de jours × Prix journalier de la voiture
        $prixTotal = $nbJours * $voiture->getPrixJour();

        // --- ÉTAPE 5 : RÉCUPÉRATION DE L'UTILISATEUR CONNECTÉ (SÉCURITÉ) ---

        // ⚠️ IMPORTANT : On NE FAIT PAS CONFIANCE au frontend pour l'ID utilisateur.
        // On récupère directement l'utilisateur authentifié via son Token JWT.
        /** @var \App\Entity\Utilisateur $utilisateur */
        $utilisateur = $this->getUser();

        if (!$utilisateur) {
            return new JsonResponse(['error' => 'Erreur interne : Utilisateur non identifié'], Response::HTTP_UNAUTHORIZED);
        }

        // --- ÉTAPE 6 : CRÉATION DE L'OBJET RÉSERVATION ---

        $reservation = new Reservation();
        $reservation->setDateDebut($dateDebut);
        $reservation->setDateFin($dateFin);
        $reservation->setStatut('en_attente'); // Par défaut, toute nouvelle résa est en attente de validation admin
        $reservation->setPrixTotal($prixTotal); // On fige le prix calculé
        $reservation->setVoiture($voiture);     // On lie la voiture
        $reservation->setUtilisateur($utilisateur); // On lie le client connecté

        // --- ÉTAPE 7 : SAUVEGARDE EN BASE DE DONNÉES ---

        $this->entityManager->persist($reservation); // Prépare l'insertion
        $this->entityManager->flush(); // Exécute l'insertion SQL réelle

        // --- ÉTAPE 8 : RÉPONSE DE SUCCÈS AU FRONTEND ---

        return new JsonResponse([
            'success' => true,
            'message' => 'Votre demande de réservation a été envoyée avec succès !',
            'data' => [
                'id' => $reservation->getId(),
                'prixTotal' => $reservation->getPrixTotal(),
                'statut' => $reservation->getStatut(),
                'nbJours' => $nbJours
            ]
        ], Response::HTTP_CREATED); // Code 201 = Ressource créée
    }
}