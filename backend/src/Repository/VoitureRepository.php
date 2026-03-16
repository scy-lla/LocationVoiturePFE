<?php

namespace App\Repository;

use App\Entity\Voiture;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Voiture>
 */
class VoitureRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Voiture::class);
    }

    //    /**
    //     * @return Voiture[] Returns an array of Voiture objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('v')
    //            ->andWhere('v.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('v.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Voiture
    //    {
    //        return $this->createQueryBuilder('v')
    //            ->andWhere('v.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
    // src/Repository/VoitureRepository.php

public function findDisponibles(\DateTime $dateDebut, \DateTime $dateFin): array
{
    return $this->createQueryBuilder('v')
        ->leftJoin('v.reservations', 'r')
        ->andWhere('r.statut != :statut OR r IS NULL')
        ->orWhere('r.dateFin < :dateDebut')
        ->orWhere('r.dateDebut > :dateFin')
        ->setParameter('statut', 'confirmee')
        ->setParameter('dateDebut', $dateDebut)
        ->setParameter('dateFin', $dateFin)
        ->getQuery()
        ->getResult();
}
}
