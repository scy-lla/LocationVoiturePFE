<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use App\Repository\VoitureRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\HttpFoundation\File\File;
//modification 
#[ORM\Entity(repositoryClass: VoitureRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(
             security: "true", 
            securityMessage: "Accès public autorisé"),
        new Get(
            security: "true"
        ),
        new Post(security: "is_granted('ROLE_ADMIN')",
         securityMessage: "Accès réservé à l'administrateur",
         inputFormats: ['json' => ['application/json'], 
         'multipart' => ['multipart/form-data']]),
        new Put(security: "is_granted('ROLE_ADMIN')",
        inputFormats: ['json' => ['application/json'], 
        'multipart' => ['multipart/form-data']]),
        new Delete(security: "is_granted('ROLE_ADMIN')"),
    ],
    normalizationContext: ['groups' => ['voiture:read']],
    denormalizationContext: ['groups' => ['voiture:write']],
    filters: [SearchFilter::class, RangeFilter::class]
)]

#[ApiFilter(SearchFilter::class, properties: [
    'marque' => 'partial',      // Recherche partielle sur la marque
    'modele' => 'partial',      // Recherche partielle sur le modèle
    'categorie' => 'exact',     // Filtre exact sur la catégorie
    'carburant' => 'exact',     // Filtre exact sur le carburant
    'transmission' => 'exact',  // Filtre exact sur la transmission
])]
#[ApiFilter(RangeFilter::class, properties: [
    'prixJour',                 // Filtre de plage sur le prix
    'annee',                    // Filtre de plage sur l'année
])]
#[Vich\Uploadable]
class Voiture
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['voiture:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    #[Groups(['voiture:read', 'voiture:write'])]
    private ?string $marque = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    #[Groups(['voiture:read', 'voiture:write'])]
    private ?string $modele = null;

    #[ORM\Column]
    #[Groups(['voiture:read', 'voiture:write'])]
    private ?int $annee = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    #[Assert\Positive]
    #[Groups(['voiture:read', 'voiture:write'])]
    private ?string $prixJour = null;

    #[ORM\Column]
    #[Groups(['voiture:read'])]
    private ?bool $disponibilite = true;

    #[ORM\Column(length: 20)]
    #[Assert\NotBlank]
    #[Groups(['voiture:read', 'voiture:write'])]
    private ?string $immatriculation = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['voiture:read', 'voiture:write'])]
    private ?string $categorie = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['voiture:read', 'voiture:write'])]
    private ?string $carburant = null;

    #[ORM\Column(length: 20)]
    #[Groups(['voiture:read', 'voiture:write'])]
    private ?string $transmission = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['voiture:read'])]
    private ?string $image = null;

    #[Vich\UploadableField(mapping: "voiture_images", fileNameProperty: "image")]
    #[Groups(['voiture:write'])]
    private ?File $imageFile = null;

    #[ORM\OneToMany(targetEntity: Reservation::class, mappedBy: 'voiture')]
    #[Groups(['voiture:read:admin'])]
    private Collection $reservations;

    public function __construct()
    {
        $this->reservations = new ArrayCollection();
    }

    // === Getters & Setters ===
    public function getId(): ?int { return $this->id; }

    public function getMarque(): ?string { return $this->marque; }
    public function setMarque(string $marque): static { $this->marque = $marque; return $this; }

    public function getModele(): ?string { return $this->modele; }
    public function setModele(string $modele): static { $this->modele = $modele; return $this; }

    public function getAnnee(): ?int { return $this->annee; }
    public function setAnnee(int $annee): static { $this->annee = $annee; return $this; }

    public function getPrixJour(): ?string { return $this->prixJour; }
    public function setPrixJour(string $prixJour): static { $this->prixJour = $prixJour; return $this; }

    public function isDisponibilite(): ?bool { return $this->disponibilite; }
    public function setDisponibilite(bool $disponibilite): static { $this->disponibilite = $disponibilite; return $this; }

    public function getImmatriculation(): ?string { return $this->immatriculation; }
    public function setImmatriculation(string $immatriculation): static { $this->immatriculation = $immatriculation; return $this; }

    public function getCategorie(): ?string { return $this->categorie; }
    public function setCategorie(?string $categorie): static { $this->categorie = $categorie; return $this; }

    public function getCarburant(): ?string { return $this->carburant; }
    public function setCarburant(?string $carburant): static { $this->carburant = $carburant; return $this; }

    public function getTransmission(): ?string { return $this->transmission; }
    public function setTransmission(string $transmission): static { $this->transmission = $transmission; return $this; }

    public function getImage(): ?string { return $this->image; }
    public function setImage(?string $image): static { $this->image = $image; return $this; }

    // === Méthodes pour VichUploader (OBLIGATOIRES) ===
    public function setImageFile(?File $imageFile = null): void
    {
        $this->imageFile = $imageFile;
    }

    public function getImageFile(): ?File
    {
        return $this->imageFile;
    }

    // === Relation Reservations ===
    public function getReservations(): Collection { return $this->reservations; }

    public function addReservation(Reservation $reservation): static
    {
        if (!$this->reservations->contains($reservation)) {
            $this->reservations->add($reservation);
            $reservation->setVoiture($this);
        }

        return $this;
    }

    public function removeReservation(Reservation $reservation): static
    {
        if ($this->reservations->removeElement($reservation)) {
            if ($reservation->getVoiture() === $this) {
                $reservation->setVoiture(null);
            }
        }
        return $this;
    }
}
