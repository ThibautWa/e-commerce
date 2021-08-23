<?php

namespace App\Controller;

use Firebase\JWT\JWT;
use App\Entity\CarteBancaire;
use App\Form\CarteBancaireType;
use App\Repository\UsersRepository;
use App\Repository\CarteBancaireRepository;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @Route("/cb")
 */
class CarteBancaireController extends AbstractController
{
    

    public function __construct(ContainerBagInterface $params)
    {
        $this->encoders = [new XmlEncoder(), new JsonEncoder()];
        $defaultContext = [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($object, $format, $context) {
                return $object->getId();
            },
        ];
        $this->normalizers = [new ObjectNormalizer(null, null, null, null, null, null, $defaultContext)];
        $this->serializer = new Serializer($this->normalizers, $this->encoders);
        $this->params = $params;
    }

    /**
     * @Route("/", name="carte_bancaire_index", methods={"GET"})
     */

    public function index(CarteBancaireRepository $carteBancaireRepository, Request $request, UsersRepository $usersRepository): Response
    {
        $credentials = $request->headers->get("Authorization");
        $jwt = (array) JWT::decode(
            $credentials,
            $this->params->get('jwt_secret'),
            ['HS256']
        );
        $user = $usersRepository->findOneBy(["email" => $jwt["user"]]);
        $cb = $carteBancaireRepository->findBy(["users" => $user]);
        $data = $this->serializer->serialize($cb, 'json', [AbstractNormalizer::IGNORED_ATTRIBUTES => ['users']]);
        return new JsonResponse(json_decode($data), Response::HTTP_OK);
    }

    /**
     * @Route("/new", name="carte_bancaire_new", methods={"GET","POST"})
     */
    public function new(Request $request, UsersRepository $usersRepository, CarteBancaireRepository $carteBancaireRepository): Response
    {
        $num_cb = $request->get('num_cb');
        $date_exp = $request->get('date_exp');
        $nom_prenom = $request->get('nom_prenom');
        
        $credentials = $request->headers->get("Authorization");
        $jwt = (array) JWT::decode(
            $credentials,
            $this->params->get('jwt_secret'),
            ['HS256']
        );
        $user = $usersRepository->findOneBy(["email" => $jwt["user"]]);
        
        $cb = new CarteBancaire();
        $cb->setDateExp($date_exp);
        $cb->setNumCb($num_cb);
        $cb->setNomPrenom($nom_prenom);
        $cb->setUsers($user);

        
        $em = $this->getDoctrine()->getManager();
        
        $em->persist($cb);
        $em->flush();
        
        return $this->json([
        'status' => "sucess"
        ]);

    
        
        

        
    }

    /**
     * @Route("/{id}", name="carte_bancaire_show", methods={"GET"})
     */
    public function show(CarteBancaire $carteBancaire): Response
    {
        return $this->render('carte_bancaire/show.html.twig', [
            'carte_bancaire' => $carteBancaire,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="carte_bancaire_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, CarteBancaire $carteBancaire): Response
    {
        $form = $this->createForm(CarteBancaireType::class, $carteBancaire);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('carte_bancaire_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('carte_bancaire/edit.html.twig', [
            'carte_bancaire' => $carteBancaire,
            'form' => $form,
        ]);
    }

    /**
     * @Route("/delete/{id}", name="carte_bancaire_delete", methods={"DELETE"})
     */
    public function delete(Request $request, CarteBancaireRepository $carteBancaireRepository ): Response
    {   
        $cb = $carteBancaireRepository->findOneBy(["id" => $request->get("id")]);
        
            $entityManager = $this->getDoctrine()->getManager();

            $entityManager->remove($cb);
            $entityManager->flush();
            return $this->json([
                'status' => "sucess"
                ]);
        

    }
}
