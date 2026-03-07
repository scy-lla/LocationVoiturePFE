<?php

namespace App\Controller\Api\Admin;

use App\Entity\Utilisateur;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin', name: 'app_api_admin_')]
final class UserController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em
    ) {
    }

    #[Route('/clients', name: 'clients', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function listClients(): JsonResponse
    {
        // 1. Récupérer tous les utilisateurs depuis la base de données
        $users = $this->em->getRepository(Utilisateur::class)->findAll();
        
        // 2. Préparer les données à renvoyer (sans les mots de passe !)
        $usersData = [];
        
        foreach ($users as $user) {
            $usersData[] = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'nom' => $user->getNom(),
                'prenom' => $user->getPrenom(),
                'roles' => $user->getRoles(),
                // ⚠️ IMPORTANT : On ne renvoie JAMAIS le mot de passe !
            ];
        }
        
        // 3. Renvoyer la réponse JSON
        return $this->json([
            'message' => 'Liste des clients récupérée avec succès',
            'count' => count($usersData),
            'clients' => $usersData
        ], 200);
    }
}