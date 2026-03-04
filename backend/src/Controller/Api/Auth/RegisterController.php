<?php

namespace App\Controller\Api\Auth;

use App\Entity\Utilisateur;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/register', name: 'app_api_register')]
final class RegisterController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em
    ) {
    }

    #[Route('', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        UserPasswordHasherInterface $hasher
    ): JsonResponse {
        // 1. Récupérer les données JSON envoyées
        $data = json_decode($request->getContent(), true);
        
        // 2. Vérifier que les champs obligatoires sont présents
        if (!isset($data['email']) || !isset($data['password'])) {
            return $this->json([
                'error' => 'Email et mot de passe sont obligatoires'
            ], 400);
        }
        
        // 3. Vérifier si l'email existe déjà
        $existingUser = $this->em->getRepository(Utilisateur::class)->findOneBy(['email' => $data['email']]);
        
        if ($existingUser) {
            return $this->json([
                'error' => 'Cet email est déjà utilisé'
            ], 409); // 409 = Conflict
        }
        
        // 4. Créer un nouvel utilisateur
        $user = new Utilisateur();
        $user->setEmail($data['email']);
        
        // Nom et prénom (optionnels)
        if (isset($data['nom'])) {
            $user->setNom($data['nom']);
        } else {
            $user->setNom('');
        }
        
        if (isset($data['prenom'])) {
            $user->setPrenom($data['prenom']);
        } else {
            $user->setPrenom('');
        }
        
        // Rôle par défaut : ROLE_USER (pas admin)
        $user->setRoles(['ROLE_USER']);
        
        // 5. Hacher le mot de passe (sécurité)
        $hashedPassword = $hasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);
        
        // 6. Sauvegarder dans la base de données
        $this->em->persist($user);
        $this->em->flush();
        
        // 7. Renvoyer une réponse de succès
        return $this->json([
            'message' => 'Utilisateur créé avec succès !',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'nom' => $user->getNom(),
                'prenom' => $user->getPrenom()
            ]
        ], 201); // 201 = Created
    }
}