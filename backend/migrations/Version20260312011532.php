<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260312011532 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Création de la table voiture uniquement';
    }

    public function up(Schema $schema): void
    {
        // ✅ Créer uniquement la table 'voiture'
        $this->addSql('CREATE TABLE IF NOT EXISTS voiture (
            id INT AUTO_INCREMENT NOT NULL, 
            marque VARCHAR(100) NOT NULL, 
            modele VARCHAR(100) NOT NULL, 
            annee INT NOT NULL, 
            prixJour NUMERIC(10, 2) NOT NULL, 
            disponibilite TINYINT(1) DEFAULT NULL, 
            immatriculation VARCHAR(20) NOT NULL, 
            categorie VARCHAR(100) DEFAULT NULL, 
            carburant VARCHAR(50) DEFAULT NULL, 
            transmission VARCHAR(20) NOT NULL, 
            image VARCHAR(255) DEFAULT NULL, 
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        // ✅ Supprimer uniquement la table 'voiture'
        $this->addSql('DROP TABLE IF EXISTS voiture');
    }
}