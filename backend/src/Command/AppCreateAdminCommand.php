<?php

namespace App\Command;

use App\Entity\Utilisateur;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-admin',
    description: 'Crée un utilisateur administrateur',
)]
class AppCreateAdminCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $hasher
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        
        // 1. Créer un nouvel utilisateur admin
        $admin = new Utilisateur();
        $admin->setEmail('admin@location.com');
        $admin->setNom('Admin');
        $admin->setPrenom('Super');
        $admin->setRoles(['ROLE_ADMIN']);
        
        // 2. Hacher le mot de passe (JAMAIS en clair !)
        $password = $this->hasher->hashPassword($admin, 'Adm!nL0c2024#Secure');
        $admin->setPassword($password);
        
        // 3. Sauvegarder dans la base de données
        $this->em->persist($admin);
        $this->em->flush();
        
        // 4. Afficher le succès
        $io->success('Admin créé avec succès !');
        $io->text([
            'Email: admin@location.com',
            'Mot de passe: admin123',
            'Rôle: ROLE_ADMIN'
        ]);
        
        return Command::SUCCESS;
    }
}