<?php
// src/Controller/AvailabilityController.php

namespace App\Controller;

use App\Repository\VoitureRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

#[Route('/api/voitures')]
class AvailabilityController extends AbstractController
{
    #[Route('/disponibles', name: 'api_voitures_disponibles', methods: ['GET'])]
    public function getDisponibles(
        Request $request,
        VoitureRepository $voitureRepository
    ): JsonResponse {
        $dateDebut = new \DateTime($request->query->get('dateDebut', 'today'));
        $dateFin = new \DateTime($request->query->get('dateFin', '+7 days'));

        $voituresDisponibles = $voitureRepository->findDisponibles($dateDebut, $dateFin);

        return $this->json($voituresDisponibles, 200, [], ['groups' => 'voiture:read']);
    }
}