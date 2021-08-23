<?php

namespace App\Repository;

use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @method Product|null find($id, $lockMode = null, $lockVersion = null)
 * @method Product|null findOneBy(array $criteria, array $orderBy = null)
 * @method Product[]    findAll()
 * @method Product[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(
        ManagerRegistry $registry,
        EntityManagerInterface $manager
    ) {
        parent::__construct($registry, Product::class);
        $this->manager = $manager;
    }

    public function saveProduct($reference, $category, $title, $description, $color, $size, $photo, $price, $stock)
    {
        $newProduct = new Product();

        $newProduct
            // ->setIdProduct($idProduct)
            ->setReference($reference)
            ->setCategory($category)
            ->setTitle($title)
            ->setDescription($description)
            ->setColor($color)
            ->setSize($size)
            ->setPhoto($photo)
            ->setPrice($price)
            ->setStock($stock);

        $this->manager->persist($newProduct);
        $this->manager->flush();
    }

    public function updateProduct(Product $product): Product
    {
        $this->manager->persist($product);
        $this->manager->flush();

        return $product;
    }

    public function removeProduct(Product $product)
    {
        $this->manager->remove($product);
        $this->manager->flush();
    }

    public function countAll()
    {
        $repoArticles = $this->manager->getRepository(Product::class);

        $totalArticles = $repoArticles->createQueryBuilder('product')
            ->select('count(product.id)')
            ->getQuery()
            ->getSingleScalarResult();

        return $totalArticles;
    }

    // /**
    //  * @return Product[] Returns an array of Product objects
    //  */
    
    // public function findByExampleField($value)
    // {
    //     return $this->createQueryBuilder('p')
    //         ->andWhere('p.title = :val')
    //         ->setParameter('val', $value)
    //         ->orderBy('p.id', 'ASC')
    //         ->setMaxResults(10)
    //         ->getQuery()
    //         ->getResult()
    //     ;
    // }
    

    /*
    public function findOneBySomeField($value): ?Product
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
