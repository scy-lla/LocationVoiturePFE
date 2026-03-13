<?php
// ce fichier contient du code PHP
// Tout fichier PHP doit commencer par cette ligne

namespace App\Controller\Api;
// Espace de noms : indique où se trouve ce contrôleur dans l'architecture du projet
// Tous les contrôleurs API sont dans App\Controller\Api\


//                          IMPORTS (USE)
// On importe toutes les classes dont on a besoin pour faire fonctionner ce controleur
use App\Service\ReservationService;

use App\Entity\Reservation;
//  L'Entité Reservation = le "moule" qui définit ce qu'est une réservation
// C'est cette classe qui représente une ligne dans la table MySQL "reservation"

use App\Entity\Voiture;
// L'Entité Voiture = pour gérer la relation réservation voiture

use App\Entity\Utilisateur;
// L'Entité Utilisateur = pour gérer la relation réservation utilisateur

use App\Repository\ReservationRepository;
// Le Repository = l'outil spécialisé pour LIRE les réservations en base de données
// Méthodes disponibles : findAll(), find(1), findBy()...

use Doctrine\ORM\EntityManagerInterface;
// L'EntityManager = l'outil pour ecrire dans la base de données
// Méthodes : persist() (préparer) + flush() (sauvegarder)

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
// Le contrôleur de base de Symfony
// Notre classe va "hériter" de ses fonctionnalités pratiques (comme $this->json())

use Symfony\Component\HttpFoundation\JsonResponse;
// La classe pour renvoyer des réponses au format JSON (pour React/Postman)
// C'est la "boîte" qui emballe tes données PHP en texte JSON

use Symfony\Component\HttpFoundation\Request;
// La classe pour lire ce que le frontend envoie (params, body JSON, headers...)

use Symfony\Component\HttpFoundation\Response;
// Les codes HTTP standards : 200 OK, 201 Created, 400 Bad Request, 404 Not Found...

use Symfony\Component\Routing\Attribute\Route;
// L'annotation pour transformer une fonction PHP en "route web accessible"
// C'est ça qui dit : "Quand on va sur /api/...exécute cette fonction"

// 🔐 permet de restreindre l'accès aux routes selon le rôle de l'utilisateur
use Symfony\Component\Security\Http\Attribute\IsGranted; //Sans cet import symfony ne reconnaîtrait pas #[IsGranted]


//                          CONTRÔLEUR PRINCIPAL
#[Route('/api/reservation')]
// PRÉFIXE DE ROUTE : Toutes les fonctions de ce contrôleur répondront à des URLs
// qui commencent par /api/reservation
// Ex:
//   - GET  /api/reservation/          → liste toutes
//   - POST /api/reservation/          → crée une nouvelle
//   - PUT  /api/reservation/1/cancel  → annule la réservation n°1

class ReservationController extends AbstractController
// Déclaration de la classe :
// - "class ReservationController" = on crée un nouveau type d'objet
// - "extends AbstractController" = on hérite des outils pratiques de Symfony
{
    //                          CONSTRUCTEUR (Injection de Dépendances)
    // ============================================================================
    
    public function __construct(
    //Le constructeur : exécuté automatiquement quand Symfony utilise ce contrôleur
    // C'est ici qu'on reçoit les "outils" dont on a besoin pour travailler
    
        private EntityManagerInterface $entityManager,
        // Outil pour ecrire en base (ajouter/modifier/supprimer)
        // "private" = seul ce contrôleur peut l'utiliser
        // Symfony injecte automatiquement cet outil (Dependency Injection)
        
        private ReservationRepository $reservationRepository,
        // Outil pour LIRE en base (trouver/lister/chercher des réservations)
        // Spécialisé pour l'entité Reservation
        // Injecté automatiquement par Symfony
         private ReservationService $reservationService 
    ) {}
    // Fin du constructeur : les accolades sont vides car Symfony fait tout le travail

    //                    ENDPOINT 1 : GET /api/reservation/
    //                    → Lister TOUTES les réservations
    // ============================================================================

    #[Route('/', name: 'api_reservation_get', methods: ['GET'])]
    // Configuration de la route :
    // - '/' = complète le préfixe → URL finale : /api/reservation/
    // - name: 'api_reservation_get' = nom unique pour générer des URLs ailleurs
    // - methods: ['GET'] = cette fonction ne répond QU'aux requêtes GET (lecture seule)
    #[IsGranted('ROLE_ADMIN')]  // 🔐 Seul un admin peut voir toutes les reservations
    public function getReservations(): JsonResponse
    //  Signature de la fonction :
    // - public = accessible depuis l'extérieur (React, Postman...)
    // - : JsonResponse = cette fonction renvoie obligatoirement du JSON
    {
        
        // ÉTAPE 1 : Lire toutes les réservations depuis la base de données
        
        $reservations = $this->reservationRepository->findAll();
        //  Demande au Repository de récupérer tous les enregistrements de la table
        // Retourne un tableau d'objets Reservation (ou [] si vide)

        
        // ÉTAPE 2 : Préparer les données pour le JSON (éviter les boucles infinies)
        
        $data = [];
        // Tableau PHP vide qui va contenir les données "aplaties" pour le JSON
        // Pourquoi ? Les objets Doctrine ont des relations complexes.
        // Si on les envoie tels quels → boucle infinie → erreur 500 
        
        foreach ($reservations as $reservation) {
        // Boucle : pour CHAQUE réservation trouvée en base...
            
            $data[] = [
            // On ajoute un nouvel élément au tableau $data
                
                'id' => $reservation->getId(),
                // On récupère l'ID unique de la réservation
                
                'dateDebut' => $reservation->getDateDebut()?->format('Y-m-d H:i:s'),
                //  Formatage de la date de début :
                // - getDateDebut() = retourne un objet DateTime ou null
                // - ?-> = opérateur "null-safe" : si c'est null, on ne plante pas !
                // - format('Y-m-d H:i:s') = transforme en texte "2026-03-15 10:00:00"
                
                'dateFin' => $reservation->getDateFin()?->format('Y-m-d H:i:s'),
                //  Même chose pour la date de fin
                
                'statut' => $reservation->getStatut(),
                // Statut de la réservation : "confirmee", "en_attente", "annulee"...
                
                // On n'inclut PAS les objets voiture/utilisateur complets ici
                // Pourquoi ? Relations complexes → risque de boucle infinie en JSON
                // Si le frontend a besoin des IDs, on les ajoute via des getters spécifiques
            ];
        }
        // Fin de la boucle : $data contient maintenant un tableau de tableaux simples

        // ÉTAPE 3 : Renvoyer la réponse JSON au frontend
        
        return new JsonResponse($data, Response::HTTP_OK);
        // On crée et renvoie une réponse JSON :
        // - $data = le tableau préparé ci-dessus
        // - Response::HTTP_OK = code 200 "Tout s'est bien passé"
        // Symfony convertit automatiquement le tableau PHP en texte JSON
    }

    
    //                    ENDPOINT 2 : GET /api/reservation/my
    //                    → Lister MES réservations (filtré par utilisateur)

    #[Route('/my', name: 'api_reservation_my', methods: ['GET'])]
    // Route : /api/reservation/my → URL complète avec le préfixe de la classe
    // Méthode GET uniquement (lecture seule)
    #[IsGranted('IS_AUTHENTICATED_FULLY')]  // 🔐 Seul un utilisateur connecté peut voir ses réservations
    public function getMyReservations(Request $request): JsonResponse
    // $request permet de lire les paramètres de l'URL (?utilisateur_id=3)
    {
        // ÉTAPE 1 : Récupérer l'ID de l'utilisateur depuis l'URL
        
        $utilisateurId = $request->query->get('utilisateur_id');
        //exp : /api/reservation/my?utilisateur_id=3 → $utilisateurId = "3"
        // $request->query = accède aux paramètres de la requête GET (après le ?)

        // ÉTAPE 2 : Validation du paramètre
        
        if (!$utilisateurId || !is_numeric($utilisateurId)) {
        // Si l'ID est manquant ou n'est pas un nombre → on bloque
            return new JsonResponse([
                'error' => 'utilisateur_id requis et doit être un nombre'
            ], Response::HTTP_BAD_REQUEST);
            // Code 400 = "Erreur du client : paramètre invalide"
        }
        
        // ÉTAPE 3 : Vérifier que l'utilisateur existe en base
        
        $utilisateur = $this->entityManager->getRepository(Utilisateur::class)->find($utilisateurId);
        // On cherche l'utilisateur dans la table "utilisateur" par son ID
        
        if (!$utilisateur) {
        // Si aucun utilisateur trouvé avec cet ID...
            return new JsonResponse([
                'error' => 'Utilisateur non trouvé'
            ], Response::HTTP_NOT_FOUND);
            // Code 404 = "Ressource demandée n'existe pas"
        }
        
        // ÉTAPE 4 : Filtrer les réservations de CET utilisateur
        
        $toutesReservations = $this->reservationRepository->findAll();
        // On récupère TOUTES les réservations (on pourrait optimiser avec une requête filtrée)
        
        $data = [];
        foreach ($toutesReservations as $reservation) {
        // Pour chaque réservation en base...
            
            if ($reservation->getUtilisateur() && $reservation->getUtilisateur()->getId() == $utilisateurId) {
            // On garde SEULEMENT si :
            // 1. La réservation a bien un utilisateur lié (pas null)
            // 2. ET cet utilisateur a l'ID qu'on cherche
                $data[] = [
                    'id' => $reservation->getId(),
                    'dateDebut' => $reservation->getDateDebut()?->format('Y-m-d H:i:s'),
                    'dateFin' => $reservation->getDateFin()?->format('Y-m-d H:i:s'),
                    'statut' => $reservation->getStatut(),
                    'voiture_id' => $reservation->getVoiture()?->getId(),
                    //On inclut l'ID de la voiture pour que le frontend puisse l'afficher
                ];
            }
        }
        // Fin du filtrage : $data ne contient que les réservations de l'utilisateur
        
        // ÉTAPE 5 : Renvoyer la liste filtrée
        
        return new JsonResponse($data, Response::HTTP_OK);
        //  Code 200 + les données en JSON
    }

    //                    ENDPOINT 3 : POST /api/reservation/
    //                    → Créer une NOUVELLE réservation


    #[Route('/', name: 'api_reservation_post', methods: ['POST'])]
    // Même URL que GET mais méthode POST différente → Symfony fait la distinction
    // POST = méthode HTTP pour CRÉER de nouvelles ressources
    #[IsGranted('IS_AUTHENTICATED_FULLY')]  // 🔐 Seul un utilisateur connecté peut créer une réservation
    public function createReservation(Request $request): JsonResponse
    // $request contient le corps JSON envoyé par le frontend (React)
    {
        // ÉTAPE 1 : Décoder le JSON reçu en tableau PHP
        
        $data = json_decode($request->getContent(), true);
        // Transforme le texte JSON en tableau PHP associatif
        // - $request->getContent() = corps brut de la requête (texte JSON)
        // - json_decode(..., true) = retourne un tableau (pas un objet)
        // Exemple : '{"dateDebut":"2026-03-15"}' → ['dateDebut' => '2026-03-15']

        // ÉTAPE 2 : Vérifier que le JSON est valide
        
        if (json_last_error() !== JSON_ERROR_NONE) {
        // Si json_decode() a échoué (JSON mal formé)...
            return new JsonResponse(['error' => 'JSON invalide'], Response::HTTP_BAD_REQUEST);
            // Code 400 = "Erreur client : JSON incorrect"
        }
        // ... après avoir décodé les données JSON ...


// VÉRIFIER LA DISPONIBILITÉ DE LA VOITURE

if (isset($data['voiture_id']) && is_numeric($data['voiture_id'])) {
    $disponible = $this->reservationService->isAvailable(
        $data['voiture_id'],
        new \DateTime($data['dateDebut']),
        new \DateTime($data['dateFin'])
    );
    
    if (!$disponible) {
        return new JsonResponse([
            'error' => 'Cette voiture n\'est pas disponible sur cette période',
            'voiture_id' => $data['voiture_id'],
            'dateDebut' => $data['dateDebut'],
            'dateFin' => $data['dateFin']
        ], Response::HTTP_CONFLICT);  // Code 409 = Conflit
    }
}

        // ÉTAPE 3 : Valider les champs obligatoires
        
        if (!isset($data['dateDebut']) || !isset($data['dateFin']) || !isset($data['statut'])
            || trim($data['dateDebut']) === '' || trim($data['dateFin']) === '' || trim($data['statut']) === '') {
        // Si un champ obligatoire manque ou est vide/espaces → on bloque
            return new JsonResponse(['error' => 'Données incomplètes'], Response::HTTP_BAD_REQUEST);
        }

        // ÉTAPE 4 : Créer et remplir l'objet Reservation
        
        $reservation = new Reservation();
        // Nouvel objet Reservation vide (en mémoire PHP, pas encore en base)
        
        $reservation->setDateDebut(new \DateTime($data['dateDebut']));
        // Convertit le texte "2026-03-15 10:00:00" en objet DateTime que Doctrine comprend
        $reservation->setDateFin(new \DateTime($data['dateFin']));
        $reservation->setStatut($data['statut']);
        
        // GESTION DES RELATIONS : Voiture et Utilisateur

        
        // ➤ Lier la VOITURE si un ID est envoyé
        if (isset($data['voiture_id']) && is_numeric($data['voiture_id'])) {
        // Si le frontend a envoyé un voiture_id valide...
            $voiture = $this->entityManager->getRepository(Voiture::class)->find($data['voiture_id']);
            // On cherche la voiture en base par son ID
            if ($voiture) {
            // Si la voiture existe...
                $reservation->setVoiture($voiture);
                // On lie la voiture à la réservation (clé étrangère voiture_id)
            }
            // Si pas trouvée → voiture_id reste NULL (car nullable: true dans l'entité)
        }
        
        // ➤ Lier l'UTILISATEUR si un ID est envoyé
        if (isset($data['utilisateur_id']) && is_numeric($data['utilisateur_id'])) {
            $utilisateur = $this->entityManager->getRepository(Utilisateur::class)->find($data['utilisateur_id']);
            if ($utilisateur) {
                $reservation->setUtilisateur($utilisateur);
                // On lie l'utilisateur à la réservation (clé étrangère utilisateur_id)
            }
        }

        // 💾 SAUVEGARDE EN BASE DE DONNÉES
        
        $this->entityManager->persist($reservation);
        // "persist" = prépare l'objet à être inséré (marqué comme "nouveau")
        // L'objet est maintenant géré par Doctrine, mais pas encore écrit en base
        
        $this->entityManager->flush();
        // "flush" = exécute VRAIMENT la requête SQL INSERT
        // Après flush(), $reservation->getId() contient le nouvel ID généré par MySQL

        // ÉTAPE 5 : Renvoyer une confirmation au frontend
        
        return new JsonResponse([
            'success' => true,
            'message' => 'Réservation créée avec succès',
            'id' => $reservation->getId()
            // On renvoie le nouvel ID pour que le frontend puisse l'utiliser
        ], Response::HTTP_CREATED);
        // Code 201 = "Ressource créée avec succès" (standard HTTP pour POST)
    }
    //                    ENDPOINT 4 : PUT /api/reservation/{id}/cancel
    //                    → Annuler une réservation existante

    #[Route('/{id}/cancel', name: 'api_reservation_cancel', methods: ['PUT'])]
    // Route avec paramètre dynamique {id} :
    // Ex: PUT /api/reservation/5/cancel → $id = 5
    // Méthode PUT = pour modifier une ressource existante
    #[IsGranted('IS_AUTHENTICATED_FULLY')]  // 🔐 Seul un utilisateur connecté peut annuler
    public function cancelReservation(int $id): JsonResponse
    // $id est extrait automatiquement de l'URL par Symfony
    {

        // ÉTAPE 1 : Trouver la réservation par son ID

        
        $reservation = $this->reservationRepository->find($id);
        // Cherche la réservation dont l'ID = $id (retourne l'objet ou null)

        // ÉTAPE 2 : Vérifier qu'elle existe
        
        if (!$reservation) {
            return new JsonResponse([
                'error' => 'Réservation non trouvée'
            ], Response::HTTP_NOT_FOUND);
            // Code 404 = n'existe pas
        }
        

        // ÉTAPE 3 : Vérifier qu'elle n'est pas déjà annulée
        
        if ($reservation->getStatut() === 'annulee') {
        // Si le statut est déjà "annulee"...
            return new JsonResponse([
                'error' => 'Cette réservation est déjà annulée'
            ], Response::HTTP_BAD_REQUEST);
            // Code 400 = "Requête invalide : action déjà effectuée"
        }
        
        // ÉTAPE 4 : Changer le statut en "annulee"
        
        $reservation->setStatut('annulee');
        // Modifie l'objet en mémoire : statut passe à "annulee"
        // Pas encore sauvegardé en base tant qu'on n'a pas fait flush()

  
        // ÉTAPE 5 : Sauvegarder la modification en base de données

        
        $this->entityManager->flush();
        //  Écrit VRAIMENT la modification en base (requête SQL UPDATE)
        // La colonne "statut" de cette ligne passe à "annulee" dans MySQL


        // ÉTAPE 6 : Renvoyer une confirmation de succès

        
        return new JsonResponse([
            'success' => true,
            'message' => 'Réservation annulée avec succès',
            'id' => $reservation->getId(),
            'statut' => $reservation->getStatut()
            // On confirme le nouveau statut pour que le frontend mette à jour l'interface
        ], Response::HTTP_OK);
        // Code 200 = succès
    }


    // 🔐 admin Liste toutes les réservations
    // But : Permettre à l'admin de voir toutes les réservations 
    // Sécurité : Seul un utilisateur avec ROLE_ADMIN peut accéder à cette route.
    
    #[Route('/admin/reservations', name: 'api_admin_reservations', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]  // 🔐 FADMA : Accès réservé aux admins
    public function getAllReservations(): JsonResponse
    {
        // Récupère toutes les réservations depuis la base de données
        $reservations = $this->reservationRepository->findAll();
        
        // Tableau qui va contenir les données formatées pour le JSON
        $data = [];
        
        // Boucle sur chaque réservation pour préparer les données
        foreach ($reservations as $reservation) {
            $data[] = [
                'id' => $reservation->getId(),  // ID de la réservation
                'dateDebut' => $reservation->getDateDebut()?->format('Y-m-d H:i:s'),  // Date début formatée
                'dateFin' => $reservation->getDateFin()?->format('Y-m-d H:i:s'),  // Date fin formatée
                'statut' => $reservation->getStatut(),  // Statut actuel
                'utilisateur_email' => $reservation->getUtilisateur()?->getEmail(),  // Email du client
                'utilisateur_nom' => $reservation->getUtilisateur()?->getNom(),  // Nom du client
                'voiture_id' => $reservation->getVoiture()?->getId(),  // ID de la voiture
            ];
        }
        
        // Renvoie la liste au format JSON avec le code 200 (OK)
        return new JsonResponse($data, Response::HTTP_OK);
    }

    // 🔐 admin modifie le statut d'une réservation
    // But : Permettre à l'admin de changer le statut d'une réservation
    // (confirmee, en_attente, annulee) via une requête PUT.
    // Sécurité : Seul un admin peut modifier un statut.
    
    #[Route('/admin/reservations/{id}/status', name: 'api_admin_reservation_status', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]  // 🔐 Accès réservé aux admins
    public function updateReservationStatus(int $id, Request $request): JsonResponse
    {
        // Cherche la réservation par son ID dans la base
        $reservation = $this->reservationRepository->find($id);
        
        // Si la réservation n'existe pas, on renvoie une erreur 404
        if (!$reservation) {
            return new JsonResponse(['error' => 'Réservation non trouvée'], Response::HTTP_NOT_FOUND);
        }
        
        // Décode le JSON envoyé dans le corps de la requête
        $data = json_decode($request->getContent(), true);
        
        // 🔐Liste des statuts autorisés pour éviter les valeurs incorrectes
        $statutsAutorises = ['confirmee', 'en_attente', 'annulee'];
        
        // Vérifie que le statut envoyé est valide
        if (!isset($data['statut']) || !in_array($data['statut'], $statutsAutorises)) {
            return new JsonResponse(['error' => 'Statut invalide'], Response::HTTP_BAD_REQUEST);
        }
        
        // Met à jour le statut de la réservation
        $reservation->setStatut($data['statut']);
        
        // Sauvegarde la modification dans la base de données
        $this->entityManager->flush();
        
        // Renvoie une confirmation avec le nouveau statut
        return new JsonResponse([
            'success' => true,
            'message' => 'Statut mis à jour',
            'id' => $reservation->getId(),
            'statut' => $reservation->getStatut()
        ], Response::HTTP_OK);
    }

    // 🔐 admin confirme une réservation
    // But : Permettre à ladmin de confirmer une reservation sans avoir à envoyer un JSON avec le statut.
    // Sécurité : Seul un admin peut confirmer une réservation.
    
    #[Route('/admin/reservations/{id}/confirm', name: 'api_admin_reservation_confirm', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]  // 🔐 Accès réserve aux admins
    public function confirmReservation(int $id): JsonResponse
    {
        // Cherche la réservation par son ID dans la base
        $reservation = $this->reservationRepository->find($id);
        
        if (!$reservation) {
            return new JsonResponse(['error' => 'Réservation non trouvée'], Response::HTTP_NOT_FOUND);
        }
        
        // 🔐forcer le statut à "confirmee" pour cette reservation
        $reservation->setStatut('confirmee');
        
        // Sauvegarde la modification dans la base de données
        $this->entityManager->flush();
        
        // Renvoie une confirmation avec le nouveau statut
        return new JsonResponse([
            'success' => true,
            'message' => 'Réservation confirmée',
            'id' => $reservation->getId(),
            'statut' => $reservation->getStatut()
        ], Response::HTTP_OK);
    }
}
// Fin de la classe ReservationController
