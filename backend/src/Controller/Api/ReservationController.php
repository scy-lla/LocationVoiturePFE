<?php

// ============================================================================
// FICHIER : src/Controller/Api/ReservationController.php
// RÔLE : Gère toutes les opérations liées aux réservations (CRUD + Logique métier)
// ============================================================================

namespace App\Controller\Api;

// --- IMPORTS DES CLASSES NÉCESSAIRES ---
use App\Entity\Reservation;
use App\Entity\Voiture;
use App\Entity\Utilisateur;
use App\Service\ReservationService;
use App\Repository\ReservationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

// ============================================================================
// DÉFINITION DU CONTRÔLEUR
// ============================================================================

#[Route('/api/reservation')]
class ReservationController extends AbstractController
{
    // --- CONSTRUCTEUR ---
    
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ReservationRepository $reservationRepository,
        private ReservationService $reservationService
    ) {}

    // ==========================================================================
    // ENDPOINT 1 : GET /api/reservation/admin/reservations (ADMIN)
    // ==========================================================================
    
    #[Route('/admin/reservations', name: 'api_admin_reservations_list', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getAllReservations(): JsonResponse
    {
        $reservations = $this->reservationRepository->findAll();
        $data = [];

        foreach ($reservations as $reservation) {
            $data[] = [
                'id' => $reservation->getId(),
                'dateDebut' => $reservation->getDateDebut()?->format('Y-m-d H:i:s'),
                'dateFin' => $reservation->getDateFin()?->format('Y-m-d H:i:s'),
                'statut' => $reservation->getStatut(),
                'prixTotal' => $reservation->getPrixTotal(),
                'client_email' => $reservation->getUtilisateur()?->getEmail(),
                'client_nom' => $reservation->getUtilisateur()?->getNom(),
                'voiture_id' => $reservation->getVoiture()?->getId(),
                'voiture_modele' => $reservation->getVoiture()?->getModele(),
            ];
        }

        return new JsonResponse($data, Response::HTTP_OK);
    }

    // ==========================================================================
    // ENDPOINT 2 : PUT /api/reservation/admin/reservations/{id}/confirm (ADMIN)
    // ==========================================================================

    #[Route('/admin/reservations/{id}/confirm', name: 'api_admin_reservation_confirm', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function confirmReservation(int $id): JsonResponse
    {
        $reservation = $this->reservationRepository->find($id);

        if (!$reservation) {
            return new JsonResponse(['error' => 'Réservation introuvable'], Response::HTTP_NOT_FOUND);
        }

        $reservation->setStatut('confirmee');
        $this->entityManager->flush();

        return new JsonResponse([
            'success' => true,
            'message' => 'Réservation confirmée avec succès',
            'nouveau_statut' => $reservation->getStatut()
        ], Response::HTTP_OK);
    }

    // ==========================================================================
    // ENDPOINT 3 : PUT /api/reservation/admin/reservations/{id}/cancel (ADMIN)
    // ==========================================================================

    #[Route('/admin/reservations/{id}/cancel', name: 'api_admin_reservation_cancel', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
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
    // ENDPOINT 4 : GET /api/reservation/my (CLIENT)
    // ==========================================================================

    #[Route('/my', name: 'api_reservation_my', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function getMyReservations(): JsonResponse
    {
        /** @var \App\Entity\Utilisateur $user */
        $user = $this->getUser();
        $toutesLesResas = $this->reservationRepository->findAll();
        $mesResas = [];

        foreach ($toutesLesResas as $resa) {
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
                        'image' => $resa->getVoiture()?->getImage(),
                    ]
                ];
            }
        }

        return new JsonResponse($mesResas, Response::HTTP_OK);
    }

    // ==========================================================================
    // ENDPOINT 5 : POST /api/reservation/ (CRÉATION - CŒUR DU SYSTÈME)
    // ==========================================================================

    #[Route('', name: 'api_reservation_create', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function createReservation(Request $request): JsonResponse
    {
        // 1. Lecture des données JSON
        $data = json_decode($request->getContent(), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            return new JsonResponse(['error' => 'JSON invalide'], Response::HTTP_BAD_REQUEST);
        }

        if (!isset($data['dateDebut'], $data['dateFin'], $data['voiture_id'])) {
            return new JsonResponse(['error' => 'Données incomplètes'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $dateDebut = new \DateTime($data['dateDebut']);
            $dateFin = new \DateTime($data['dateFin']);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Format de date incorrect'], Response::HTTP_BAD_REQUEST);
        }

        if ($dateFin <= $dateDebut) {
            return new JsonResponse(['error' => 'La date de fin doit être après le début'], Response::HTTP_BAD_REQUEST);
        }

        // 2. Vérification de la voiture
        $voiture = $this->entityManager->getRepository(Voiture::class)->find($data['voiture_id']);
        if (!$voiture) {
            return new JsonResponse(['error' => 'Voiture introuvable'], Response::HTTP_NOT_FOUND);
        }

        // 3. Vérification des conflits (Disponibilité)
        if (!$this->reservationService->isAvailable($voiture->getId(), $dateDebut, $dateFin)) {
            return new JsonResponse([
                'error' => 'Ce véhicule n\'est pas disponible sur cette période.'
            ], Response::HTTP_CONFLICT);
        }

        // 4. Calcul du prix total
        $interval = $dateDebut->diff($dateFin);
        $nbJours = $interval->days;
        if ($nbJours === 0) $nbJours = 1;
        
        $prixTotal = $nbJours * $voiture->getPrixJour();

        // ============================================================
        // 🔧 CORRECTION CRUCIALE ICI (Récupération robuste de l'utilisateur)
        // ============================================================
        
        // A. On récupère l'utilisateur connecté via le token JWT
        $userConnecte = $this->getUser();
        
        if (!$userConnecte) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        // B. On extrait son ID
        $idUtilisateur = $userConnecte->getId();

        // C. On RECHARGE l'entité Utilisateur proprement depuis la base de données
        // Cela évite les erreurs de type "Proxy" ou incompatibilité de classe
        /** @var \App\Entity\Utilisateur $utilisateur */
        $utilisateur = $this->entityManager->getRepository(Utilisateur::class)->find($idUtilisateur);

        if (!$utilisateur) {
            return new JsonResponse(['error' => 'Erreur système: Utilisateur introuvable en base'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        // ============================================================
        // FIN DE LA CORRECTION
        // ============================================================

        // 5. Création de l'objet Réservation
        $reservation = new Reservation();
        $reservation->setDateDebut($dateDebut);
        $reservation->setDateFin($dateFin);
        $reservation->setStatut('en_attente');
        $reservation->setPrixTotal($prixTotal);
        $reservation->setVoiture($voiture);
        
        // On assigne l'utilisateur rechargé proprement
        $reservation->setUtilisateur($utilisateur);

        // 6. Sauvegarde en base de données
        try {
            $this->entityManager->persist($reservation);
            $this->entityManager->flush();

            return new JsonResponse([
                'success' => true,
                'message' => 'Votre demande de réservation a été envoyée avec succès !',
                'data' => [
                    'id' => $reservation->getId(),
                    'prixTotal' => $reservation->getPrixTotal(),
                    'statut' => $reservation->getStatut(),
                    'nbJours' => $nbJours
                ]
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            // En cas d'erreur SQL inattendue, on renvoie le message exact pour déboguer
            return new JsonResponse([
                'error' => 'Erreur lors de l\'enregistrement',
                'details' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}