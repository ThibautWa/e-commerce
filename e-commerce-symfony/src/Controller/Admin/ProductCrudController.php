<?php

namespace App\Controller\Admin;

use App\Entity\Product;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;

class ProductCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Product::class;
    }

    
    public function configureFields(string $pageName): iterable
    {
         return [
            TextField::new('reference'),
            TextField::new('category'),
            TextField::new('title'),
            TextField::new('description'),
            TextField::new('color'),
            TextField::new('size'),
            ImageField::new('photo')
                    ->setBasePath(' uploads/')
                    ->setUploadDir('public/resources/images')
                ->setUploadedFileNamePattern('http://127.0.0.1:8000/resources/images/[randomhash].[extension]')
,
            NumberField::new('price'),
            NumberField::new('stock')
            
        ];
    }
}
