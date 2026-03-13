<?php
// src/DataFixtures/VoitureFixtures.php

namespace App\DataFixtures;

use App\Entity\Voiture;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class VoitureFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');
        
        // Données réalistes pour les voitures
        $marques = ['Toyota', 'Peugeot', 'Renault', 'Citroën', 'Volkswagen', 'BMW', 'Mercedes', 'Audi', 'Nissan', 'Ford'];
        $categories = ['Citadine', 'Berline', 'SUV', 'Compacte', 'Luxe', 'Sport'];
        $carburants = ['Essence', 'Diesel', 'Électrique', 'Hybride'];
        $transmissions = ['Manuelle', 'Automatique'];
        
        for ($i = 0; $i < 27; $i++) {
            $voiture = new Voiture();
            
            $marque = $faker->randomElement($marques);
            $modele = $faker->word() . ' ' . $faker->numberBetween(1, 9);
            
            $voiture->setMarque($marque);
            $voiture->setModele($modele);
            $voiture->setAnnee($faker->numberBetween(2018, 2024));
            $voiture->setPrixJour($faker->randomFloat(2, 30, 150));
            $voiture->setDisponibilite(true);
            $voiture->setImmatriculation($faker->unique()->regexify('[A-Z]{2}-[0-9]{3}-[A-Z]{2}'));
            $voiture->setCategorie($faker->randomElement($categories));
            $voiture->setCarburant($faker->randomElement($carburants));
            $voiture->setTransmission($faker->randomElement($transmissions));
            $voiture->setImage(null); // Image vide pour l'instant
            
            $manager->persist($voiture);
        }
        
        $manager->flush();
        
        echo "✅ 27 voitures ajoutées avec succès !\n";
    }
}