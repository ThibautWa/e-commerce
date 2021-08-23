<?php

namespace App\Controller;

use Firebase\JWT\JWT;
use App\Entity\Product;
use App\Entity\Commande;
use App\Form\CommandeType;
use App\Entity\DetailCommande;
use App\Repository\UsersRepository;
use App\Repository\CommandeRepository;
use App\Repository\DetailCommandeRepository;
use App\Repository\ProductRepository;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;

/**
 * @Route("/commande")
 */
class CommandeController extends AbstractController
{

    public function __construct(ContainerBagInterface $params)
    {
        $this->encoders = [new XmlEncoder(), new JsonEncoder()];
        $defaultContext = [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($object, $format, $context) {
                return $object->getId();
            },
        ];
        $this->normalizers = [new DateTimeNormalizer(), new ObjectNormalizer(null, null, null, null, null, null, $defaultContext)];
        $this->serializer = new Serializer($this->normalizers, $this->encoders);
        $this->params = $params;
    }

    /**
     * @Route("/", name="commande_index", methods={"GET"})
     */
    public function index(Request $request, UsersRepository $usersRepository, CommandeRepository $commandeRepository): Response
    {
        $credentials = $request->headers->get("Authorization");
        $jwt = (array) JWT::decode(
            $credentials,
            $this->params->get('jwt_secret'),
            ['HS256']
        );

        $user = $usersRepository->findOneBy(["email" => $jwt["user"]]);

        $commandes = $commandeRepository->findBy(["users" => $user]);

        $data = $this->serializer->serialize($commandes, 'json', ['groups' => ['commande'], AbstractNormalizer::IGNORED_ATTRIBUTES => ['users', 'commande']]);

        return new JsonResponse(json_decode($data), Response::HTTP_OK);
    }

    /**
     * @Route("/new", name="commande_new", methods={"GET","POST"})
     */
    public function new(Request $request, UsersRepository $usersRepository, CommandeRepository $commandeRepository, DetailCommandeRepository $detailCommandeRepository, ProductRepository $productRepository): Response
    {
        if ($request->get("quantity") === null || $request->get("quantity") <= 0) {
            return new JsonResponse(["Status" => "Error", "Msg" => "Invalid quantity"], Response::HTTP_BAD_REQUEST);
        }

        $em = $this->getDoctrine()->getManager();

        $credentials = $request->headers->get("Authorization");
        $jwt = (array) JWT::decode(
            $credentials,
            $this->params->get('jwt_secret'),
            ['HS256']
        );

        $user = $usersRepository->findOneBy(["email" => $jwt["user"]]);

        $panier = $commandeRepository->findOneBy(["users" => $user, "etat" => "Panier"]);

        // IF THERE IS NO CART FOR USER CREATE ONE 

        if (empty($panier)) {
            $newPanier = new Commande();
            $newPanier->setEtat("Panier");
            $newPanier->setUsers($user);
            $newPanier->setMontant(0);
            $now = new \DateTime();
            $now->format('Y-m-d H:i:s');
            $now->getTimestamp();
            $newPanier->setDateEnregistrement($now);
            $em->persist($newPanier);
            $em->flush();
            $panier = $commandeRepository->findOneBy(["users" => $user, "etat" => "Panier"]);
        }

        $produit = $productRepository->findOneBy(["id" => $request->get("id_produit")]);
        // INSERT PRODUCT INTO CART
        $dopple = $detailCommandeRepository->findOneBy(["id_produit" => $request->get("id_produit"), "commande" => $panier]);

        if ($dopple !== null) {
            $dopple->setQuantité($dopple->getQuantité() + $request->get("quantity"));
            $dopple->setPrix($produit->getPrice() * $dopple->getQuantité());
            $price = $request->get("quantity") * $produit->getPrice();
            $panier->setMontant($panier->getMontant() + $price);
            $em->persist($dopple);
            $em->flush();
            return new JsonResponse(["Status" => "Success", "Dopple" => true], Response::HTTP_ACCEPTED);
        }

        $newProduit = new DetailCommande();
        $newProduit->setIdProduit($request->get("id_produit"));
        $newProduit->setQuantité($request->get("quantity"));
        $newProduit->setPrix($produit->getPrice() * $newProduit->getQuantité());
        $newProduit->setCommande($panier);
        $panier->setMontant($panier->getMontant() + $newProduit->getPrix());
        $em->persist($newProduit);
        $em->flush();

        return new JsonResponse(["Status" => "Success", "Dopple" => false], Response::HTTP_ACCEPTED);
    }

    /**
     * @Route("/confirm", name="commande_confirm", methods={"POST"})
     */
    public function confirm(Request $request, UsersRepository $usersRepository, CommandeRepository $commandeRepository): Response
    {
        $em = $this->getDoctrine()->getManager();

        $credentials = $request->headers->get("Authorization");
        $jwt = (array) JWT::decode(
            $credentials,
            $this->params->get('jwt_secret'),
            ['HS256']
        );

        $user = $usersRepository->findOneBy(["email" => $jwt["user"]]);

        $commandes = $commandeRepository->findOneBy(["users" => $user, "etat" => "Panier"]);

        $commandes->setEtat("En cours de validation");

        $em->persist($commandes);
        $em->flush();

        return new JsonResponse(["Status" => "Success"], Response::HTTP_ACCEPTED);
    }
}
