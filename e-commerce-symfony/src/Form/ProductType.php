<?php

namespace App\Form;

use App\Entity\Product;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\File;

class ProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        // dd($builder);
        // dd($options["new_product"]);

        if($options["new_product"] == true){
            $builder
                // ->add('id_product')
                ->add('reference')
                ->add('category')
                ->add('title')
                ->add('description')
                ->add('color')
                ->add('size')
                ->add('photo', FileType::class, [
                    'label' => 'Picture (jpg/png)',
                    'constraints' => [
                        new File([
                            'maxSize' => '1024k',
                            'mimeTypes' => [
                                // 'application/pdf',
                                'image/jpeg',
                                'image/png'
                            ],
                            'mimeTypesMessage' => 'Please upload a valid image (png/jpg)'
                        ])
                    ]
    
                ])
                ->add('price')
                ->add('stock')
            ;
        }else{
            $builder
                // ->add('id_product')
                ->add('reference')
                ->add('category')
                ->add('title')
                ->add('description')
                ->add('color')
                ->add('size')
                ->add('photo')
                ->add('price')
                ->add('stock')
            ;
        }
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Product::class,
            "new_product" => false,
        ]);
    }
}
