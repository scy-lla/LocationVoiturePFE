<?php
// src/Controller/VoitureUploadController.php

namespace App\Controller;

use App\Entity\Voiture;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class VoitureUploadController extends AbstractController
{
    #[Route('/api/admin/voitures', name: 'api_admin_voitures_create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function createVoiture(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        // Récupérer les données du formulaire
        $marque = $request->request->get('marque');
        $modele = $request->request->get('modele');
        $annee = $request->request->get('annee');
        $prixJour = $request->request->get('prixJour');
        $immatriculation = $request->request->get('immatriculation');
        $categorie = $request->request->get('categorie');
        $carburant = $request->request->get('carburant');
        $transmission = $request->request->get('transmission');
        
        // Récupérer le fichier image
        /** @var UploadedFile|null $imageFile */
        $imageFile = $request->files->get('imageFile');
        
        // Créer la voiture
        $voiture = new Voiture();
        $voiture->setMarque($marque);
        $voiture->setModele($modele);
        $voiture->setAnnee((int) $annee);
        $voiture->setPrixJour((float) $prixJour);
        $voiture->setImmatriculation($immatriculation);
        $voiture->setCategorie($categorie);
        $voiture->setCarburant($carburant);
        $voiture->setTransmission($transmission);
        $voiture->setDisponibilite(true);
        
        // Définir le fichier image pour VichUploader
        if ($imageFile) {
            $voiture->setImageFile($imageFile);
        }
        
        // Sauvegarder en base
        $em->persist($voiture);
        $em->flush();
        
        // Retourner la réponse JSON
        return $this->json($voiture, 201, [], ['groups' => 'voiture:read']);
    }
}