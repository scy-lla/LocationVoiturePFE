<?php

namespace App\Controller\Api\Admin;

use App\Repository\UtilisateurRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin')]
class UserController extends AbstractController
{
    #[Route('/clients', name: 'api_admin_clients', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function listClients(UtilisateurRepository $utilisateurRepository): JsonResponse
    {
        // Récupère tous les utilisateurs ayant le rôle ROLE_USER (pas les admins)
        $utilisateurs = $utilisateurRepository->findAll();
        
        $data = [];
        foreach ($utilisateurs as $utilisateur) {
            // On filtre pour n'afficher que les clients (ROLE_USER)
            if (in_array('ROLE_USER', $utilisateur->getRoles())) {
                $data[] = [
                    'id' => $utilisateur->getId(),
                    'email' => $utilisateur->getEmail(),
                    'nom' => $utilisateur->getNom(),
                    'prenom' => $utilisateur->getPrenom(),
                    'roles' => $utilisateur->getRoles(),
                    'created_at' => $utilisateur->getCreatedAt()?->format('Y-m-d H:i:s'),
                ];
            }
        }
        
        return new JsonResponse([
            'message' => 'Liste des clients récupérée avec succès',
            'count' => count($data),
            'clients' => $data
        ], Response::HTTP_OK);
    }
}