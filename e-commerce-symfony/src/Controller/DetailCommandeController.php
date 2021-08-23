<?php

namespace App\Controller;

use Firebase\JWT\JWT;
use App\Repository\UsersRepository;
use App\Repository\ProductRepository;
use App\Repository\CommandeRepository;
use App\Repository\DetailCommandeRepository;
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
 * @Route("/detail/commande")
 */
class DetailCommandeController extends AbstractController
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
     * @Route("/panier", name="detail_commande_panier", methods={"GET"})
     */
    public function panier(Request $request, UsersRepository $usersRepository, CommandeRepository $commandeRepository, DetailCommandeRepository $detailCommandeRepository, ProductRepository $productRepository): Response
    {
        $credentials = $request->headers->get("Authorization");
        $jwt = (array) JWT::decode(
            $credentials,
            $this->params->get('jwt_secret'),
            ['HS256']
        );

        $user = $usersRepository->findOneBy(["email" => $jwt["user"]]);
        $commandes = $commandeRepository->findOneBy(["users" => $user, "etat" => "Panier"]);
        if($commandes === null) {
        return new JsonResponse(["Status" => "Success", "Msg" => "Panier inexistant"], Response::HTTP_ACCEPTED);
        }
        $commande = $detailCommandeRepository->findBy(["commande" => $commandes]);
        $response = [];
        foreach ($commande as $key => $value) {
            $productById = $productRepository->findOneBy(["id" => $value->getIdProduit()]);
            $product = $this->serializer->serialize($productById, "json");
            $response[$key] = [json_decode($product)];
            array_push($response[$key], json_decode($this->serializer->serialize($commande[$key], "json", [AbstractNormalizer::IGNORED_ATTRIBUTES => ['users', 'commande']])));
        }
        $res = [$response, $commandes->getMontant()];
        $this->serializer->serialize($res, "json");

        return new JsonResponse($res, Response::HTTP_ACCEPTED);
    }

    /**
     * @Route("/panier/edit", name="detail_commande_panier_edit", methods={"POST"})
     */
    public function edit(Request $request, UsersRepository $usersRepository, CommandeRepository $commandeRepository, DetailCommandeRepository $detailCommandeRepository, ProductRepository $productRepository): Response
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

        $commandes = $commandeRepository->findOneBy(["users" => $user, "etat" => "Panier"]);

        $commande = $detailCommandeRepository->findOneBy(["commande" => $commandes, "id" => $request->get("id")]);
        $commande->setQuantité(intval($request->get("quantity")));
        $product = $productRepository->findOneBy(["id" => $commande->getIdProduit()]);
        $commande->setPrix($commande->getQuantité() * $product->getPrice());
        
        $commandesCalc = $detailCommandeRepository->findBy(["commande" => $commandes]);
        $total = 0;
        foreach ($commandesCalc as $value) {
            $total = $total + $value->getPrix();
        }
        $commandes->setMontant($total);

        $em->persist($commande);
        $em->flush();

        return new JsonResponse(["Status" => "Success"], Response::HTTP_ACCEPTED);
    }

    /**
     * @Route("/panier/delete", name="detail_commande_panier_delete", methods={"POST"})
     */
    public function delete(Request $request, UsersRepository $usersRepository, CommandeRepository $commandeRepository, DetailCommandeRepository $detailCommandeRepository, ProductRepository $productRepository): Response
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

        $commande = $detailCommandeRepository->findOneBy(["commande" => $commandes, "id" => $request->get("id")]);

        
        $em->remove($commande);
        $em->flush();

        $commandesCalc = $detailCommandeRepository->findBy(["commande" => $commandes]);
        $total = 0;
        foreach ($commandesCalc as $value) {
            $total = $total + $value->getPrix();
        }
        $commandes->setMontant($total);
        $em->persist($commandes);
        $em->flush();

        return new JsonResponse(["Status" => "Success"], Response::HTTP_ACCEPTED);
    }

    /**
     * @Route("/{id}", name="detail_commande_show", methods={"GET"})
     */
    public function show(Request $request, DetailCommandeRepository $detailCommandeRepository, ProductRepository $productRepository): Response
    {
        $commande = $detailCommandeRepository->findBy(["commande" => $request->get("id")]);
        $response = [];
        foreach ($commande as $key => $value) {
            $productById = $productRepository->findOneBy(["id" => $value->getIdProduit()]);
            $product = $this->serializer->serialize($productById, "json");
            $response[$key] = [json_decode($product)];
            array_push($response[$key], json_decode($this->serializer->serialize($commande[$key], "json", [AbstractNormalizer::IGNORED_ATTRIBUTES => ['users', 'commande']])));
        }
        $this->serializer->serialize($response, "json");

        return new JsonResponse($response, Response::HTTP_ACCEPTED);
    }
}
