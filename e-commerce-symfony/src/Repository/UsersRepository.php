<?php

namespace App\Repository;

use App\Entity\Users;
use App\Security\EmailVerifier;
use Symfony\Component\Mime\Address;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * @method Users|null find($id, $lockMode = null, $lockVersion = null)
 * @method Users|null findOneBy(array $criteria, array $orderBy = null)
 * @method Users[]    findAll()
 * @method Users[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UsersRepository extends ServiceEntityRepository
{

    public function __construct(
        ManagerRegistry $registry,
        EntityManagerInterface $manager,
        EmailVerifier $emailVerifier
    ) {
        $this->emailVerifier = $emailVerifier;
        parent::__construct($registry, Users::class);
        $this->manager = $manager;
    }

    public function saveUser($name, $lastName, $email, $mdp, $city, $postalCode, $adress, $validator, $passwordEncoder)
    {
        $newUser = new Users();

        $newUser
            ->setName($name)
            ->setLastName($lastName)
            ->setEmail($email)
            ->setCity($city)
            ->setMdp(
                $passwordEncoder->encodePassword(
                    $newUser,
                    $mdp
                )
            )->setPostalCode($postalCode)
            ->setAdress($adress)
            ->setStatut(0)
            ->setRoles(["ROLE_USER"]);



        $errors = $validator->validate($newUser);

        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            return $errorsString;
        }

        $this->manager->persist($newUser);
        $this->manager->flush();

        $this->emailVerifier->sendEmailConfirmation(
            'app_verify_email',
            $newUser,
            (new TemplatedEmail())
                ->from(new Address('support@retrowave.rw', 'Retrowave Bot'))
                ->to($newUser->getEmail())
                ->subject('Please Confirm your Email')
                ->htmlTemplate('registration/confirmation_email.html.twig')
        );
    }

    public function updateUser(Users $users): Users
    {
        $this->manager->persist($users);
        $this->manager->flush();

        return $users;
    }

    public function removeUser(Users $users)
    {
        $this->manager->remove($users);
        $this->manager->flush();
    }

    public function countAll()
    {
        $repoArticles = $this->manager->getRepository(Users::class);

        $totalArticles = $repoArticles->createQueryBuilder('users')
            ->select('count(users.id)')
            ->getQuery()
            ->getSingleScalarResult();

        return $totalArticles;
    }

    // /**
    //  * @return Users[] Returns an array of Users objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Users
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
