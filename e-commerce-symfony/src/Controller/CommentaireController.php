<?php

namespace App\Controller;

use Firebase\JWT\JWT;
use App\Entity\Commentaire;
use App\Form\CommentaireType;
use App\Repository\UsersRepository;
use App\Repository\CommentaireRepository;
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
 * @Route("/commentaire")
 */
class CommentaireController extends AbstractController
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
     * @Route("/new", name="commentaire_new", methods={"POST"})
     */
    public function new(Request $request, UsersRepository $usersRepository): Response
    {
        if (strlen(trim($request->get("comment"))) === 0 ) {
            return new JsonResponse(["Status" => "Error", "Msg" => "No comment"], Response::HTTP_ACCEPTED);
        }
        $em = $this->getDoctrine()->getManager();

        $credentials = $request->headers->get("Authorization");
        $jwt = (array) JWT::decode(
            $credentials,
            $this->params->get('jwt_secret'),
            ['HS256']
        );
        $user = $usersRepository->findOneBy(["email" => $jwt["user"]]);

        $comment = new Commentaire();
        $comment->setIdProduit(intval($request->get("id_produit")));
        $comment->setUsers($user);
        $comment->setCommentaire($request->get("comment"));
        $now = new \DateTime();
        $now->format('Y-m-d H:i:s');
        $now->getTimestamp();
        $comment->setDate($now);

        $em->persist($comment);
        $em->flush();

        return new JsonResponse(["Status" => "Success"], Response::HTTP_ACCEPTED);
    }

    /**
     * @Route("/{id}", name="commentaire_show", methods={"GET"})
     */
    public function show(Request $request, CommentaireRepository $commentaireRepository): Response
    {
        $comments = $commentaireRepository->findBy(["id_produit" => $request->get("id")]);
        $data = $this->serializer->serialize($comments, "json", [AbstractNormalizer::IGNORED_ATTRIBUTES => ["users"]]);
        $data = json_decode($data);
        foreach ($comments as $key => $value) {
            $data[$key] = ["comment" => json_decode($this->serializer->serialize($value, "json", [AbstractNormalizer::IGNORED_ATTRIBUTES => ["users"]])), "email" => $value->getUsers()->getEmail()];
        }
        return new JsonResponse($data, Response::HTTP_ACCEPTED);
    }
}
