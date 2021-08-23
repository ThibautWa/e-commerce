<?php

namespace App\Controller;

use App\Entity\Product;
use App\Form\ProductType;
use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @Route("/product")
 */
class ProductController extends AbstractController
{
    /**
     * @Route("/", name="product_index", methods={"GET"})
     */ 
    public function index(ProductRepository $productRepository): Response
    {
        // return $this->render('product/index.html.twig', [
        //     'products' => $productRepository->findAll(),
        // ]);
        $productData = $productRepository->findAll();
        $serializer = $this->container->get('serializer');
        $product = $serializer->serialize($productData, 'json');
        return new Response($product);
    }

    /**
     * @Route("/new", name="product_new", methods={"GET","POST"})
     */
    public function new(Request $request, SluggerInterface $slugger): Response
    {
        $product = new Product();
        $form = $this->createForm(ProductType::class, $product, [
            "new_product" => true
        ]);
        // dd($form);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $pictureFile = $form->get('photo')->getData();
            // dd($pictureFile);
            if($pictureFile){
                $originalFileName = pathinfo($pictureFile->getClientOriginalName(), PATHINFO_FILENAME);
                // dd($originalFileName);
                $safeFileName = $slugger->slug($originalFileName);
                $newFileName = "http://127.0.0.1:8000/resources/images/".$safeFileName.'-'.uniqid().'.'.$pictureFile->guessExtension();
                // dd($newFileName);
                try {
                    // dd($this->getParameter('b'))
                    $pictureFile->move(
                        $this->getParameter('picture_directory'),
                        $newFileName
                    );
                } catch (FileException $e) {
                    // ... handle exception if something happens during file upload
                }
                $product->setPhoto($newFileName);
            }

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($product);
            $entityManager->flush();

            return $this->redirectToRoute('product_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('product/new.html.twig', [
            'product' => $product,
            'form' => $form,
        ]);
    }
    /**
     * @Route("/search", name="product_search", methods={"POST"})
     */
    public function search(ProductRepository $productRepository, Request $request): Response
    {
        $search = $request->request->get("title");
        $findProduct = $productRepository->findBy(array("title"=>$search));
        $serializer = $this->container->get('serializer');
        $product = $serializer->serialize($findProduct, 'json');
        return new Response($product);
        // dd($productRepository);
    }

    /**
     * @Route("/{id}", name="product_show", methods={"GET"})
     */
    public function show(Product $product): Response
    {
        // var_dump($product);

        $serializer = $this->container->get('serializer');
        $OneProduct = $serializer->serialize($product, 'json');
        return new Response($OneProduct);
        // return $this->render('product/show.html.twig', [
        //     'product' => $product,
        // ]);
        
    }

    /**
     * @Route("/{id}/edit", name="product_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Product $product): Response
    {
        // dd($request);
        // dd($product);

        $form = $this->createForm(ProductType::class, $product, [
            "new_product" => false
        ]);
        // // dd($form);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('product_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('product/edit.html.twig', [
            'product' => $product,
            'form' => $form,
        ]);
    }

    /**
     * @Route("/{id}", name="product_delete", methods={"POST"})
     */
    public function delete(Request $request, Product $product): Response
    {
        if ($this->isCsrfTokenValid('delete'.$product->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($product);
            $entityManager->flush();
        }

        return $this->redirectToRoute('product_index', [], Response::HTTP_SEE_OTHER);
    }


}
