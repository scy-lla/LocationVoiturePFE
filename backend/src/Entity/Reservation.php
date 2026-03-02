<?php

namespace App\Entity;

use App\Repository\ReservationRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ReservationRepository::class)]
class Reservation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['reservation:read'])] // ✅ OK
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['reservation:read'])] // ✅ OK
    private ?\DateTime $dateDebut = null;

    #[ORM\Column]
    #[Groups(['reservation:read'])] // ✅ OK
    private ?\DateTime $dateFin = null;

    #[ORM\Column(length: 20)]
    #[Groups(['reservation:read'])] // ✅ OK
    private ?string $statut = null;

    // ❌ VOITURE : PAS de #[Groups] ! C'est le secret !
    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[ORM\JoinColumn(nullable: true)]
    private ?Voiture $voiture = null;

    // ❌ UTILISATEUR : PAS de #[Groups] ! C'est le secret !
    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[ORM\JoinColumn(nullable: true)]
    private ?Utilisateur $utilisateur = null;

    // ==================== GETTERS & SETTERS ====================
    // (Je ne les répète pas ici pour alléger, garde les tiens)
    // Assure-toi juste d'avoir getId(), getDateDebut(), etc.
    
    public function getId(): ?int { return $this->id; }
    public function getDateDebut(): ?\DateTime { return $this->dateDebut; }
    public function setDateDebut(\DateTime $dateDebut): static { $this->dateDebut = $dateDebut; return $this; }
    public function getDateFin(): ?\DateTime { return $this->dateFin; }
    public function setDateFin(\DateTime $dateFin): static { $this->dateFin = $dateFin; return $this; }
    public function getStatut(): ?string { return $this->statut; }
    public function setStatut(string $statut): static { $this->statut = $statut; return $this; }
    public function getVoiture(): ?Voiture { return $this->voiture; }
    public function setVoiture(?Voiture $voiture): static { $this->voiture = $voiture; return $this; }
    public function getUtilisateur(): ?Utilisateur { return $this->utilisateur; }
    public function setUtilisateur(?Utilisateur $utilisateur): static { $this->utilisateur = $utilisateur; return $this; }
}