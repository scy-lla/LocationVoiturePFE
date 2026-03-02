<?php
// 👆 Cette ligne indique que c'est un fichier PHP
// Tout code PHP doit commencer par <?php

namespace App\Controller\Api;
// 👆 "Mon contrôleur habite dans le dossier virtuel App\Controller\Api"
// C'est l'organisation logique de ton code dans le projet
// Tous les contrôleurs API sont dans ce "dossier virtuel"

// ============================================================================
//                          IMPORTS (USE)
// ============================================================================
// Ici, on importe toutes les classes dont on a besoin pour ce contrôleur
// C'est comme dire : "Pour travailler, j'ai besoin de ces outils"

use App\Entity\Reservation;
// 👆 On importe l'Entité Reservation (le "moule" qui définit une réservation)
// C'est cette classe qui représente une ligne dans la table "reservation" de la BDD
// Quand tu fais new Reservation(), tu utilises cette classe

use App\Repository\ReservationRepository;
// 👆 On importe le Repository (l'outil qui parle à la base de données pour LIRE)
// Il permet de faire des recherches : findAll(), find(1), findBy(...), etc.
// C'est comme un bibliothécaire qui cherche des livres pour toi

use Doctrine\ORM\EntityManagerInterface;
// 👆 On importe l'EntityManager (l'outil qui parle à la base de données pour ÉCRIRE)
// Il permet de faire : persist() (préparer) + flush() (écrire vraiment)
// C'est comme un secrétaire qui enregistre tes documents dans les archives

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
// 👆 On importe le contrôleur de base de Symfony
// Notre contrôleur va "hériter" de ses super-pouvoirs (comme $this->json())
// "extends" = on récupère toutes ses fonctionnalités gratuitement

use Symfony\Component\HttpFoundation\JsonResponse;
// 👆 On importe JsonResponse pour renvoyer des données JSON à React
// (pas du HTML, mais des données brutes que le frontend peut comprendre)
// C'est la "boîte" qui emballe tes données pour les envoyer au navigateur

use Symfony\Component\HttpFoundation\Request;
// 👆 On importe Request pour récupérer ce que le frontend envoie
// (les données du formulaire, les headers, le corps de la requête, etc.)
// C'est comme une enveloppe qui contient tout ce que React t'envoie

use Symfony\Component\HttpFoundation\Response;
// 👆 On importe Response pour utiliser les codes HTTP standards
// 200 = OK, 201 = Créé, 400 = Erreur client, 404 = Non trouvé, 500 = Erreur serveur
// Ces codes disent à React si ça a marché ou pas

use Symfony\Component\Routing\Attribute\Route;
// 👆 On importe Route pour transformer une fonction en "adresse web accessible"
// C'est ça qui dit : "Quand on va sur /api/..., exécute cette fonction"
// Sans ça, ta fonction serait juste du code PHP normal, pas une page web

// ============================================================================
//                          CONTRÔLEUR PRINCIPAL
// ============================================================================

#[Route('/api/reservation')]
// 👆 C'EST L'ADRESSE DE BASE DE TON API !
// Toutes les fonctions dans ce contrôleur répondront à des URLs qui commencent par /api/reservation
// Exemple : 
//   - GET  /api/reservation/     → liste toutes les réservations
//   - POST /api/reservation/     → crée une nouvelle réservation
//   - PUT  /api/reservation/1    → (si on l'ajoute) modifie la réservation n°1
// C'est comme le nom de ta rue : toutes tes fonctions habitent à cette adresse

class ReservationController extends AbstractController
// 👆 On crée la classe ReservationController
// "class" = on définit un nouveau type d'objet
// "extends AbstractController" = elle hérite des outils pratiques de Symfony
// (comme $this->json(), $this->render(), etc.)
{
    // ============================================================================
    //                          CONSTRUCTEUR
    // ============================================================================
    
    public function __construct(
    // 👆 Le CONSTRUCTEUR : exécuté automatiquement quand le contrôleur est utilisé
    // C'est ici qu'on prépare les outils dont on a besoin avant de commencer à travailler
    // "public" = accessible par Symfony
    // "function __construct" = nom spécial que PHP reconnaît comme constructeur
    
        private EntityManagerInterface $entityManager,
        // 👆 Outil pour ÉCRIRE dans la base de données (ajouter, modifier, supprimer)
        // "private" = seul ce contrôleur peut l'utiliser
        // "EntityManagerInterface" = le type de l'outil (contrat que Symfony doit respecter)
        // "$entityManager" = le nom de la variable dans laquelle on stocke l'outil
        // On l'utilisera dans createReservation() pour persist() + flush()
        // Symfony injecte automatiquement cet outil (Injection de Dépendances)
        
        private ReservationRepository $reservationRepository
        // 👆 Outil pour LIRE dans la base de données (trouver, lister, chercher)
        // "private" = seul ce contrôleur peut l'utiliser
        // "ReservationRepository" = le type de l'outil (spécialisé pour les réservations)
        // "$reservationRepository" = le nom de la variable
        // On l'utilisera dans getReservations() pour findAll()
        // Symfony injecte automatiquement cet outil aussi
    ) {}
    // 👆 Fin du constructeur
    // Les accolades sont vides car Symfony injecte automatiquement les dépendances
    // Pas besoin d'écrire du code ici, Symfony fait tout le travail !
    // C'est ce qu'on appelle l'Injection de Dépendances ou "Dependency Injection"

    // ============================================================================
    //                    ENDPOINT GET : LIRE LES RÉSERVATIONS
    // ============================================================================

    /**
     * GET /api/reservation
     * Récupère et renvoie toutes les réservations au format JSON
     * 
     * @return JsonResponse Liste des réservations ou tableau vide
     */
    // 👆 Ceci est un COMMENTAIRE PHPDoc (Symfony l'ignore, mais c'est utile pour les développeurs)
    // Il explique ce que fait la fonction, ses paramètres et ce qu'elle renvoie
    // Les outils comme VS Code utilisent ces commentaires pour l'autocomplétion

    #[Route('/', name: 'api_reservation_get', methods: ['GET'])]
    // 👆 Cette annotation définit la ROUTE de cette fonction :
    //   - '/' = complète le '/api/reservation' du haut → URL finale : /api/reservation/
    //   - name: 'api_reservation_get' = un nom unique pour cette route (utile pour générer des URLs)
    //   - methods: ['GET'] = cette fonction ne répond QUE si la requête est de type GET
    //   GET = méthode HTTP pour LIRE des données (sans modifier la base)
    // C'est comme dire : "Quand quelqu'un demande à VOIR les réservations, exécute cette fonction"
    
    public function getReservations(): JsonResponse
    // 👆 Signature de la fonction :
    //   - public = accessible depuis l'extérieur (par React, curl, Postman...)
    //   - function getReservations() = nom de la fonction (descriptif : ce qu'elle fait)
    //   - : JsonResponse = cette fonction RENVOIE OBLIGATOIREMENT un objet JsonResponse
    //   Le nom "getReservations" suit la convention : get + NomDeLaChose (clair et explicite)
    {
        // ------------------------------------------------------------------------
        // ÉTAPE 1 : Récupérer les données depuis la base de données
        // ------------------------------------------------------------------------
        
        $reservations = $this->reservationRepository->findAll();
        // 👆 On demande au Repository de TOUT récupérer dans la table "reservation"
        //   - $this->reservationRepository = l'outil injecté dans le constructeur
        //   - ->findAll() = méthode qui retourne TOUS les enregistrements de la table
        //   - $reservations = variable qui contient un tableau d'objets Reservation
        //   - Si la table est vide → $reservations = tableau vide []
        //   - Chaque élément du tableau est un objet Reservation (avec ses getters/setters)

        // ------------------------------------------------------------------------
        // ÉTAPE 2 : Préparer les données pour le JSON (évite les boucles infinies)
        // ------------------------------------------------------------------------
        
        $data = [];
        // 👆 On crée un tableau PHP vide qui va contenir les données "aplaties"
        // Pourquoi ? Parce que les objets Doctrine ont des relations complexes
        // Si on les envoie tels quels en JSON → boucle infinie → erreur 500 💥
        // [] = syntaxe PHP pour créer un tableau vide
        
        foreach ($reservations as $reservation) {
        // 👆 Boucle "pour chaque" : on parcourt TOUTES les réservations trouvées
        //   - foreach = "pour chaque élément dans..."
        //   - $reservations = le tableau à parcourir (toutes les réservations de la BDD)
        //   - as $reservation = à chaque tour, $reservation contient l'objet actuel
        //   - { } = tout ce qui est entre ces accolades est répété pour chaque réservation
            
            $data[] = [
            // 👆 On ajoute un NOUVEL ÉLÉMENT au tableau $data
            // [] = on ajoute à la fin du tableau (comme push en JavaScript)
            // [ ... ] = on crée un nouveau tableau associatif (avec des clés nommées)
                
                'id' => $reservation->getId(),
                // 👆 On récupère l'ID de la réservation et on le met dans le JSON
                // 'id' = la clé qui sera dans le JSON (ce que React verra)
                // => = associe la clé à la valeur
                // $reservation->getId() = appelle la méthode getId() sur l'objet Reservation
                // getId() retourne l'ID unique de cette réservation (ex: 1, 2, 3...)
                
                'dateDebut' => $reservation->getDateDebut()?->format('Y-m-d H:i:s'),
                // 👆 On récupère la date de début et on la formate pour le JSON
                //   - getDateDebut() = retourne un objet DateTime ou null
                //   - ?-> = "opérateur null-safe" : si c'est null, on ne plante pas !
                //   - ->format('Y-m-d H:i:s') = transforme la date en texte "2026-03-15 10:00:00"
                //   - Y = année (4 chiffres), m = mois, d = jour, H = heure, i = minutes, s = secondes
                // Sans le ?, si dateDebut est null → erreur PHP → page blanche 💥
                
                'dateFin' => $reservation->getDateFin()?->format('Y-m-d H:i:s'),
                // 👆 Même chose pour la date de fin
                // On utilise le même format pour être cohérent dans toute l'API
                
                'statut' => $reservation->getStatut(),
                // 👆 On récupère le statut (ex: "confirmee", "en_attente", "annulee")
                // getStatut() retourne une chaîne de texte simple, pas besoin de formatage
                
                // ❌ On n'inclut PAS $voiture ni $utilisateur ici !
                // Pourquoi ? Ce sont des objets complexes avec des relations inverses
                // Si on les inclut → Reservation → Voiture → Reservation → ... → boucle infinie 💥
                // Si React a besoin de l'ID de la voiture, on ajoutera un getter spécial plus tard
                // Règle d'or : en API, on envoie le minimum nécessaire, pas tout l'objet Doctrine
            ];
            // 👆 Fin de l'élément ajouté au tableau
            // À ce stade, $data contient un tableau de tableaux simples (parfait pour JSON)
        }
        // 👆 Fin de la boucle : on a traité TOUTES les réservations
        // $data contient maintenant quelque chose comme :
        // [
        //   ['id' => 1, 'dateDebut' => '2026-03-15...', 'dateFin' => '...', 'statut' => '...'],
        //   ['id' => 2, 'dateDebut' => '...', 'dateFin' => '...', 'statut' => '...'],
        //   ...
        // ]

        // ------------------------------------------------------------------------
        // ÉTAPE 3 : Renvoyer la réponse JSON à React
        // ------------------------------------------------------------------------
        
        return new JsonResponse($data, Response::HTTP_OK);
        // 👆 On crée et renvoie une réponse JSON :
        //   - return = on termine la fonction et on renvoie ce résultat
        //   - new JsonResponse() = classe Symfony qui transforme un tableau PHP en JSON
        //   - $data = le tableau préparé ci-dessus (contient les réservations "aplaties")
        //   - Response::HTTP_OK = code HTTP 200 ("Tout s'est bien passé")
        // Résultat envoyé à React : [{"id":1,"dateDebut":"2026-03-15...",...}, {...}]
        // Symfony se charge de convertir le tableau PHP en texte JSON automatiquement
    }
    // 👆 Fin de la fonction getReservations()
    // L'accolade } ferme la fonction, tout ce qui est après appartient à une autre fonction

    // ============================================================================
    //                   ENDPOINT POST : CRÉER UNE RÉSERVATION
    // ============================================================================

    /**
     * POST /api/reservation
     * Crée une nouvelle réservation à partir des données envoyées par React
     * 
     * @param Request $request Les données envoyées par le frontend
     * @return JsonResponse Confirmation de création ou erreur
     */
    // 👆 Commentaire PHPDoc expliquant cette fonction
    // @param = décrit les paramètres de la fonction
    // @return = décrit ce que la fonction renvoie
    // Ces commentaires aident les autres développeurs (et toi dans 6 mois !) à comprendre le code

    #[Route('/', name: 'api_reservation_post', methods: ['POST'])]
    // 👆 Route pour cette fonction :
    //   - '/' = URL finale : /api/reservation/ (même adresse que GET, mais méthode différente)
    //   - name: 'api_reservation_post' = nom unique pour cette route
    //   - methods: ['POST'] = cette fonction ne répond QUE si la requête est de type POST
    //   POST = méthode HTTP pour CRÉER de nouvelles données (modifie la base de données)
    // C'est comme dire : "Quand quelqu'un veut CRÉER une réservation, exécute cette fonction"
    
    public function createReservation(Request $request): JsonResponse
    // 👆 Signature de la fonction :
    //   - public = accessible depuis l'extérieur (par React, curl, Postman...)
    //   - (Request $request) = on récupère l'objet Request qui contient TOUT ce que React a envoyé
    //   - : JsonResponse = cette fonction renvoie obligatoirement une réponse JSON
    // Le nom "createReservation" suit la convention : create + NomDeLaChose (clair et explicite)
    {
        // ------------------------------------------------------------------------
        // ÉTAPE 1 : Décoder les données JSON envoyées par React
        // ------------------------------------------------------------------------
        
        $data = json_decode($request->getContent(), true);
        // 👆 On transforme le texte JSON reçu en tableau PHP utilisable :
        //   - $request->getContent() = récupère le corps brut de la requête (texte JSON)
        //   - json_decode() = fonction PHP qui convertit JSON → tableau PHP
        //   - true = on veut un tableau associatif (avec des clés nommées) et non un objet
        // Exemple : '{"dateDebut":"2026-03-15"}' → ['dateDebut' => '2026-03-15']
        // Sans le true, on recevrait un objet PHP, moins pratique à manipuler

        // ------------------------------------------------------------------------
        // ÉTAPE 2 : Vérifier que le JSON a été correctement décodé
        // ------------------------------------------------------------------------
        
        if (json_last_error() !== JSON_ERROR_NONE) {
        // 👆 On vérifie s'il y a eu une erreur lors du décodage JSON
        //   - json_last_error() = retourne le code d'erreur du dernier json_decode()
        //   - JSON_ERROR_NONE = constante qui signifie "aucune erreur"
        //   - !== = "n'est pas égal à" (comparaison stricte, vérifie type et valeur)
        //   - if () {} = "si cette condition est vraie, alors exécute ce code"
            
            return new JsonResponse([
                'error' => 'JSON invalide'
                // 👆 On renvoie une erreur descriptive à React
                // 'error' = la clé que React va lire pour savoir qu'il y a un problème
            ], Response::HTTP_BAD_REQUEST);
            // 👆 Response::HTTP_BAD_REQUEST = code HTTP 400 ("Erreur du client")
            // Cela dit à React : "C'est toi qui as envoyé un JSON mal formé"
        }
        // 👆 Fin de la vérification JSON
        // Si on arrive ici, c'est que le JSON est valide ✅

        // ------------------------------------------------------------------------
        // ÉTAPE 3 : Vérifier que les données obligatoires sont présentes
        // ------------------------------------------------------------------------
        
        if (!isset($data['dateDebut']) || !isset($data['dateFin']) || !isset($data['statut'])
            || trim($data['dateDebut']) === '' || trim($data['dateFin']) === '' || trim($data['statut']) === '') {
        // 👆 Validation robuste des données :
        //   - !isset($data['dateDebut']) = "la clé dateDebut n'existe pas dans le tableau"
        //   - || = opérateur "OU logique" (si une condition est vraie, tout le test est vrai)
        //   - trim($data['dateDebut']) === '' = "la valeur est vide ou ne contient que des espaces"
        //   - ! = "NON" (inverse la condition)
        // En résumé : si un champ obligatoire manque OU est vide → on bloque
        // C'est une sécurité pour éviter d'enregistrer des données incomplètes en BDD
        
            return new JsonResponse(['error' => 'Données incomplètes'], Response::HTTP_BAD_REQUEST);
            // 👆 On renvoie une erreur claire à React avec le code 400
            // React pourra afficher un message à l'utilisateur : "Veuillez remplir tous les champs"
        }
        // 👆 Fin de la validation des données
        // Si on arrive ici, c'est que toutes les données sont présentes et valides ✅

        // ------------------------------------------------------------------------
        // ÉTAPE 4 : Créer et remplir l'objet Reservation
        // ------------------------------------------------------------------------
        
        $reservation = new Reservation();
        // 👆 On crée un NOUVEL objet Reservation vide (comme une fiche blanche)
        // C'est une instance de la classe App\Entity\Reservation
        // new = opérateur PHP pour créer un nouvel objet
        // À ce stade, l'objet existe en mémoire PHP, mais PAS encore dans la base de données
        
        $reservation->setDateDebut(new \DateTime($data['dateDebut']));
        // 👆 On remplit la date de début :
        //   - setDateDebut() = méthode "setter" générée automatiquement dans l'Entité
        //   - new \DateTime() = on convertit le texte "2026-03-15 10:00:00" en objet DateTime
        //   - Le \ devant DateTime = on utilise la classe PHP native (pas une classe du projet)
        //   - $data['dateDebut'] = la valeur qu'on a reçue de React
        // Doctrine sait comment stocker un objet DateTime dans une colonne DATE de MySQL
        
        $reservation->setDateFin(new \DateTime($data['dateFin']));
        // 👆 Même chose pour la date de fin
        // On utilise le même processus pour garantir la cohérence des données
 
                $reservation->setStatut($data['statut']);
        
        // ========================================================================
        // 🔗 GESTION DES RELATIONS : Voiture et Utilisateur
        // ========================================================================
        
        // 1️⃣ Lier la VOITURE si un ID est envoyé
        // ========================================================================
        // 🔗 GESTION DES RELATIONS : Voiture et Utilisateur
        // ========================================================================
        // Ici, on lie la réservation à une voiture et/ou un utilisateur
        // Si React envoie les IDs, on cherche les entités en base et on les attache
        // Si aucun ID n'est envoyé, les champs restent NULL (car nullable: true)
        
        // ------------------------------------------------------------------------
        // 1️⃣ Lier la VOITURE (si un ID est envoyé depuis React)
        // ------------------------------------------------------------------------
        
        if (isset($data['voiture_id']) && is_numeric($data['voiture_id'])) {
        // 👆 On vérifie DEUX choses :
        //   - isset($data['voiture_id']) = "la clé voiture_id existe-t-elle dans le JSON reçu ?"
        //   - is_numeric(...) = "la valeur est-elle bien un nombre (ex: 1, 2, 3) et pas du texte ?"
        //   - && = "ET logique" : les deux conditions doivent être vraies pour entrer dans le if
        //   - if () {} = "si c'est vrai, alors exécute ce code"
            
            $voiture = $this->entityManager->getRepository(Voiture::class)->find($data['voiture_id']);
            // 👆 On cherche la voiture dans la base de données :
            //   - $this->entityManager = l'outil injecté dans le constructeur (pour parler à la BDD)
            //   - ->getRepository(Voiture::class) = on demande le repository spécialisé pour les Voitures
            //   - Voiture::class = constante PHP qui retourne le nom complet de la classe "App\Entity\Voiture"
            //   - ->find($data['voiture_id']) = on cherche l'enregistrement dont l'ID = la valeur reçue
            //   - $voiture = variable qui contient l'objet Voiture trouvé, ou NULL si pas trouvé
            //   - Exemple : si voiture_id = 1 → on récupère la voiture avec id=1 dans la table "voiture"
            
            if ($voiture) {
            // 👆 On vérifie que la voiture a bien été trouvée :
            //   - if ($voiture) = "si $voiture n'est pas null (donc si on a trouvé quelque chose)"
            //   - C'est une sécurité pour éviter d'attacher une réservation à une voiture qui n'existe pas
                
                $reservation->setVoiture($voiture);
                // 👆 On lie la voiture à la réservation :
                //   - $reservation = l'objet qu'on est en train de créer
                //   - ->setVoiture() = méthode "setter" générée dans l'Entité Reservation
                //   - ($voiture) = on lui passe l'objet Voiture qu'on vient de trouver
                //   - Résultat : en mémoire PHP, $reservation "sait" qu'elle appartient à cette voiture
                //   - En base de données : la colonne voiture_id sera remplie avec l'ID de cette voiture
            }
            // ❌ Si $voiture est null (pas trouvée), on ne fait rien → voiture_id restera NULL en base
            // C'est OK car dans l'entité, on a #[ORM\JoinColumn(nullable: true)]
        }
        // 👆 Fin du bloc "Lier la voiture"
        // Si voiture_id n'était pas dans le JSON, on saute tout ce bloc → voiture reste NULL ✅

        // ------------------------------------------------------------------------
        // 2️⃣ Lier l'UTILISATEUR (si un ID est envoyé depuis React)
        // ------------------------------------------------------------------------
        
        if (isset($data['utilisateur_id']) && is_numeric($data['utilisateur_id'])) {
        // 👆 Même logique que pour la voiture :
        //   - On vérifie que utilisateur_id existe ET que c'est un nombre valide
        //   - Si oui, on entre dans le bloc pour chercher et attacher l'utilisateur
            
            $utilisateur = $this->entityManager->getRepository(Utilisateur::class)->find($data['utilisateur_id']);
            // 👆 On cherche l'utilisateur dans la base de données :
            //   - getRepository(Utilisateur::class) = repository spécialisé pour les Utilisateurs
            //   - ->find($data['utilisateur_id']) = cherche l'utilisateur avec cet ID
            //   - $utilisateur = objet Utilisateur trouvé, ou NULL si pas trouvé
            
            if ($utilisateur) {
            // 👆 Si on a bien trouvé un utilisateur...
                
                $reservation->setUtilisateur($utilisateur);
                // 👆 On lie l'utilisateur à la réservation :
                //   - setUtilisateur() = méthode setter de l'Entité Reservation
                //   - En base de données : la colonne utilisateur_id sera remplie avec cet ID
            }
            // ❌ Si pas trouvé → utilisateur_id reste NULL (car nullable: true)
        }
        // 👆 Fin du bloc "Lier l'utilisateur"

        // ========================================================================
        // 📊 RÉCAP : Ce qui se passe en base de données
        // ========================================================================
        // Après ce code, avant le flush(), l'objet $reservation contient :
        //   - dateDebut, dateFin, statut → valeurs reçues de React ✅
        //   - voiture → objet Voiture SI voiture_id était valide, sinon NULL ✅
        //   - utilisateur → objet Utilisateur SI utilisateur_id était valide, sinon NULL ✅
        //
        // Quand on fera flush(), Doctrine va générer ce SQL :
        //   INSERT INTO reservation (dateDebut, dateFin, statut, voiture_id, utilisateur_id)
        //   VALUES ('2026-03-16...', '2026-03-20...', 'confirmee', 1, NULL)
        //                                                      ↑        ↑
        //                                         voiture_id=1    utilisateur_id=NULL
        // ========================================================================

        $this->entityManager->persist($reservation);
        // 👆 On dit à Doctrine : "Prépare à enregistrer cet objet"
        //   - $this->entityManager = l'outil injecté dans le constructeur
        //   - ->persist() = marque l'objet comme "à insérer" mais n'écrit pas encore en base
        //   - C'est comme mettre un document dans une pile "à traiter"
        //   - L'objet est maintenant "géré" par Doctrine (il sait qu'il doit l'insérer)
        
        $this->entityManager->flush();
        // 👆 On dit à Doctrine : "Exécute maintenant toutes les opérations en attente !"
        //   - ->flush() = écrit VRAIMENT dans la base de données (INSERT SQL)
        //   - Sans flush(), persist() ne fait rien de concret !
        //   - Après flush(), $reservation->getId() contient le nouvel ID généré par la BDD
        //   - C'est à ce moment précis que la ligne est ajoutée dans la table MySQL

        // ------------------------------------------------------------------------
        // ÉTAPE 6 : Renvoyer une confirmation à React
        // ------------------------------------------------------------------------
        
        return new JsonResponse([
            'success' => true,
            // 👆 Indicateur booléen pour que React sache que l'opération a réussi
            // true = ça a marché, false = ça a planté
            // React peut utiliser ça pour afficher une notification verte "Succès !"
            
            'message' => 'Réservation créée avec succès',
            // 👆 Message texte pour afficher une notification à l'utilisateur
            // Ce message peut être affiché tel quel dans l'interface React
            
            'id' => $reservation->getId()
            // 👆 On renvoie l'ID de la nouvelle réservation
            // Utile pour que React puisse mettre à jour l'interface ou faire d'autres requêtes
            // Exemple : après création, React peut rediriger vers /reservation/{id}
        ], Response::HTTP_CREATED);
        // 👆 Response::HTTP_CREATED = code HTTP 201 ("Ressource créée avec succès")
        // C'est le code standard pour une création POST réussie (différent de 200 OK)
        // Les navigateurs et outils comme Postman utilisent ce code pour savoir ce qui s'est passé
    }
    // 👆 Fin de la fonction createReservation()
    // L'accolade } ferme la fonction

}
// 👆 Fin de la classe ReservationController
// Toutes les accolades sont fermées, le fichier est complet et valide ✅
// Tout le code de ce fichier appartient à la classe ReservationController