<?php

namespace App\Service;

use App\Repository\ReservationRepository;

class ReservationService
{
    public function __construct(
        private ReservationRepository $reservationRepository
    ) {}

    public function isAvailable(int $voitureId, \DateTime $dateDebut, \DateTime $dateFin): bool
    {
        $conflits = $this->reservationRepository->checkConflict($voitureId, $dateDebut, $dateFin);
        return count($conflits) === 0;
    }
}