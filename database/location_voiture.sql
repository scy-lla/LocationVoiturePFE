-- Base de données: location_voiture
-- Exporté le 2026-03-19 22:01:23

SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `doctrine_migration_versions`;
CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES ('DoctrineMigrations\\Version20260218143947', '2026-03-12 01:15:46', '31');
INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES ('DoctrineMigrations\\Version20260218173828', '2026-03-12 01:15:46', '13');
INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES ('DoctrineMigrations\\Version20260227140304', '2026-03-12 01:15:46', '149');
INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES ('DoctrineMigrations\\Version20260302144603', '2026-03-12 01:15:47', '55');
INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES ('DoctrineMigrations\\Version20260312011532', '2026-03-12 01:27:08', '4');

DROP TABLE IF EXISTS `reservation`;
CREATE TABLE `reservation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date_debut` datetime NOT NULL,
  `date_fin` datetime NOT NULL,
  `statut` varchar(20) NOT NULL,
  `voiture_id` int DEFAULT NULL,
  `utilisateur_id` int DEFAULT NULL,
  `prix_total` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_42C84955181A8BA` (`voiture_id`),
  KEY `IDX_42C84955FB88E14F` (`utilisateur_id`),
  CONSTRAINT `FK_42C84955181A8BA` FOREIGN KEY (`voiture_id`) REFERENCES `voiture` (`id`),
  CONSTRAINT `FK_42C84955FB88E14F` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE `utilisateur` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(180) NOT NULL,
  `roles` json NOT NULL,
  `password` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `telephone` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_IDENTIFIER_EMAIL` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `utilisateur` (`id`, `email`, `roles`, `password`, `nom`, `prenom`, `telephone`) VALUES ('1', 'admin@location.com', '[\"ROLE_ADMIN\"]', '$2y$13$7mGyB2nHdvUlSPjBk3mO3u5ENuU1nXUJ2kGzcEBhS5cy56AKREEQi', 'Admin', 'Super', NULL);

DROP TABLE IF EXISTS `voiture`;
CREATE TABLE `voiture` (
  `id` int NOT NULL AUTO_INCREMENT,
  `marque` varchar(100) NOT NULL,
  `modele` varchar(100) NOT NULL,
  `annee` int NOT NULL,
  `prix_jour` decimal(10,2) NOT NULL,
  `disponibilite` tinyint NOT NULL,
  `immatriculation` varchar(20) NOT NULL,
  `categorie` varchar(100) DEFAULT NULL,
  `carburant` varchar(50) DEFAULT NULL,
  `transmission` varchar(20) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('1', 'Toyota', 'Corolla', '2023', '50.00', '1', 'AB-123-CD', 'Berline', 'Essence', 'Automatique', '/uploads/voitures/toyota-corolla.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('2', 'BMW', 'laboriosam 7', '2023', '41.29', '1', 'QW-205-LK', 'Sport', 'Diesel', 'Manuelle', '/uploads/voitures/bmw-serie3.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('3', 'Volkswagen', 'dolores 6', '2020', '52.35', '1', 'WI-342-UN', 'Citadine', 'Diesel', 'Manuelle', '/uploads/voitures/vw-golf.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('4', 'Volkswagen', 'itaque 4', '2023', '108.02', '1', 'DB-405-SG', 'Citadine', 'Hybride', 'Manuelle', '/uploads/voitures/renault-clio.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('5', 'Volkswagen', 'numquam 8', '2023', '71.28', '1', 'NA-027-KI', 'Citadine', 'Électrique', 'Automatique', '/uploads/voitures/renault-clio.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('6', 'Renault', 'nihil 5', '2021', '119.98', '1', 'OR-214-TW', 'Sport', 'Diesel', 'Automatique', '/uploads/voitures/renault-clio.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('7', 'Mercedes', 'distinctio 8', '2022', '98.89', '1', 'RR-829-IN', 'SUV', 'Diesel', 'Automatique', '/uploads/voitures/mercedes-classe-c.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('8', 'Audi', 'rerum 4', '2024', '118.17', '1', 'YE-780-TJ', 'Citadine', 'Diesel', 'Automatique', '/uploads/voitures/audi-a4.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('9', 'BMW', 'adipisci 7', '2019', '149.82', '1', 'WM-293-AQ', 'SUV', 'Diesel', 'Automatique', '/uploads/voitures/nissan-qashqai.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('10', 'Audi', 'perferendis 5', '2020', '32.95', '1', 'TA-232-EN', 'Citadine', 'Essence', 'Manuelle', '/uploads/voitures/renault-clio.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('11', 'Renault', 'mollitia 2', '2019', '62.16', '1', 'KB-755-NN', 'SUV', 'Diesel', 'Automatique', '/uploads/voitures/nissan-qashqai.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('12', 'Peugeot', 'consequatur 7', '2021', '114.55', '1', 'ND-288-JK', 'Berline', 'Essence', 'Manuelle', '/uploads/voitures/peugeot-308.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('13', 'Nissan', 'ad 6', '2024', '97.08', '1', 'JI-820-US', 'Citadine', 'Hybride', 'Manuelle', '/uploads/voitures/nissan-qashqai.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('14', 'Peugeot', 'soluta 1', '2019', '121.84', '1', 'UJ-729-MX', 'Luxe', 'Hybride', 'Manuelle', '/uploads/voitures/mercedes-classe-c.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('15', 'Toyota', 'assumenda 6', '2019', '34.24', '1', 'SJ-039-KJ', 'Compacte', 'Hybride', 'Manuelle', '/uploads/voitures/vw-golf.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('16', 'Toyota', 'in 6', '2019', '140.85', '1', 'YA-167-HY', 'SUV', 'Hybride', 'Automatique', '/uploads/voitures/nissan-qashqai.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('17', 'Renault', 'perferendis 4', '2019', '72.24', '1', 'QZ-629-LL', 'Citadine', 'Hybride', 'Manuelle', '/uploads/voitures/renault-clio.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('18', 'Renault', 'commodi 1', '2020', '90.24', '1', 'IP-050-KP', 'Luxe', 'Hybride', 'Automatique', '/uploads/voitures/mercedes-classe-c.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('19', 'Nissan', 'quaerat 4', '2018', '72.42', '1', 'OW-119-CL', 'Compacte', 'Électrique', 'Manuelle', '/uploads/voitures/vw-golf.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('20', 'Mercedes', 'dicta 2', '2019', '75.86', '1', 'EJ-460-WH', 'SUV', 'Électrique', 'Automatique', '/uploads/voitures/nissan-qashqai.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('21', 'Audi', 'veniam 7', '2022', '46.43', '1', 'KI-514-CA', 'Citadine', 'Électrique', 'Manuelle', '/uploads/voitures/renault-clio.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('22', 'Renault', 'voluptatem 3', '2020', '49.78', '1', 'EE-970-AM', 'Citadine', 'Électrique', 'Automatique', '/uploads/voitures/renault-clio.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('23', 'Ford', 'provident 4', '2020', '69.43', '1', 'QM-221-ST', 'SUV', 'Diesel', 'Automatique', '/uploads/voitures/ford-focus.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('24', 'Toyota', 'vitae 7', '2018', '45.29', '1', 'WV-534-GT', 'Luxe', 'Essence', 'Manuelle', '/uploads/voitures/mercedes-classe-c.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('25', 'Citroën', 'laboriosam 8', '2020', '77.97', '1', 'SL-537-AW', 'Berline', 'Essence', 'Manuelle', '/uploads/voitures/peugeot-308.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('26', 'Volkswagen', 'autem 9', '2023', '32.87', '1', 'SA-810-NF', 'Compacte', 'Diesel', 'Automatique', '/uploads/voitures/vw-golf.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('27', 'Renault', 'accusantium 4', '2018', '38.99', '1', 'BG-596-UF', 'SUV', 'Essence', 'Automatique', '/uploads/voitures/porsche-911.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('28', 'Audi', 'quia 4', '2020', '43.32', '1', 'FC-676-LR', 'Luxe', 'Électrique', 'Manuelle', '/uploads/voitures/mercedes-classe-c.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('29', 'Toyota', 'Corolla', '2023', '50.00', '1', 'AB-123-CD', 'Berline', 'Essence', 'Automatique', '/uploads/voitures/toyota-corolla.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('30', 'Toyota', 'Corolla', '2023', '50.00', '1', 'AB-123-CD', 'Berline', 'Essence', 'Automatique', '/uploads/voitures/toyota-corolla.jpg');
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('31', 'Renault', 'Clio', '2022', '150.00', '1', 'AB-123-CD', 'Citadine', 'Essence', 'Manuelle', NULL);
INSERT INTO `voiture` (`id`, `marque`, `modele`, `annee`, `prix_jour`, `disponibilite`, `immatriculation`, `categorie`, `carburant`, `transmission`, `image`) VALUES ('32', 'Renault', 'Clio', '2022', '150.00', '1', 'AB-123-CD', 'Citadine', 'Essence', 'Manuelle', NULL);

SET FOREIGN_KEY_CHECKS=1;
