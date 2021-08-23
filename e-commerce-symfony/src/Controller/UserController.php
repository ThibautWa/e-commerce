<?php

namespace App\Controller;

use stdClass;
use Firebase\JWT\JWT;
use App\Repository\UsersRepository;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;

class UserController extends AbstractController
{
    private $usersRepository;
    private $limit = 10;

    public function __construct(UsersRepository $usersRepository, ContainerBagInterface $params)
    {

        $this->usersRepository = $usersRepository;
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
     * @Route("/user/add", name="add_user", methods={"POST"})
     */
    public function add(Request $request, ValidatorInterface $validator, UserPasswordEncoderInterface $passwordEncoder): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data["name"]) || empty($data["lastname"]) || empty($data["email"]) || empty($data["password"]) || empty($data["confirmPassword"]) || empty($data["city"]) || empty($data["postalCode"]) || empty($data["adress"])) {
            return new JsonResponse(['error' => 'Expecting mandatory parameters!']);
        }

        $name = $data['name'];
        $lastName = $data['lastname'];
        $email = $data['email'];
        $mdp = $data["password"];
        $confirmMdp = $data["confirmPassword"];
        $adress = $data["adress"];
        $city = $data["city"];
        $postalCode = $data["postalCode"];

        if ($mdp !== $confirmMdp) {
            return new JsonResponse(['error' => 'Mismatched passwords!'], Response::HTTP_BAD_REQUEST);
        }


        $res = $this->usersRepository->saveUser($name, $lastName, $email, $mdp, $city, $postalCode, $adress, $validator, $passwordEncoder);

        if ($res !== null) {
            return new JsonResponse(['error' => 'Invalid email!'], Response::HTTP_BAD_REQUEST);
        }

        return new JsonResponse(['status' => 'User created!'], Response::HTTP_CREATED);
    }

    /**
     * @Route("/user/profile", name="get_user_profile", methods={"GET"})
     */
    public function profile(Request $request, UsersRepository $usersRepository): JsonResponse
    {
        $credentials = $request->headers->get("Authorization");
        $jwt = (array) JWT::decode(
            $credentials,
            $this->params->get('jwt_secret'),
            ['HS256']
        );

        $user = $usersRepository->findOneBy(["email" => $jwt["user"]]);

        if (empty($user)) {
            return new JsonResponse(['error' => 'User not found!'], Response::HTTP_BAD_REQUEST);
        }

        $data = $this->serializer->serialize($user, 'json', [AbstractNormalizer::IGNORED_ATTRIBUTES => ['mdp', 'password']]);

        return new JsonResponse(json_decode($data), Response::HTTP_OK);
    }


    /**
     * @Route("/user/update", name="update_customer", methods={"POST"})
     */
    public function update(Request $request, UserPasswordEncoderInterface $encoder): JsonResponse
    {

        $credentials = $request->headers->get("Authorization");
        $jwt = (array) JWT::decode(
            $credentials,
            $this->params->get('jwt_secret'),
            ['HS256']
        );

        $user = $this->usersRepository->findOneBy(["email" => $jwt["user"]]);

        if (empty($user)) {
            return new JsonResponse(['error' => 'User not found at all!'], Response::HTTP_BAD_REQUEST);
        }

        $data = json_decode($request->getContent(), true);

        empty($data['name']) ? true : $user->setName($data['name']);
        empty($data['lastname']) ? true : $user->setLastname($data['lastname']);
        empty($data['email']) ? true : $user->setEmail($data['email']);

        if (!empty($data['confirmPassword']) && $data['confirmPassword'] === $data['password']) {
            empty($data['password']) ? true : $user->setMdp($encoder->encodePassword($user, $data['password']));
        }
        empty($data['adress']) ? true : $user->setAdress($data['adress']);
        empty($data['city']) ? true : $user->setCity($data['city']);
        empty($data['postalCode']) ? true : $user->setPostalCode($data['postalCode']);

        $updatedUser = $this->usersRepository->updateUser($user);
        return new JsonResponse(["status" => "User succesfully updated!"], Response::HTTP_OK);
    }


    /**
     * @Route("/user/{id}", name="get_one_user", methods={"GET"})
     */
    public function get($id): JsonResponse
    {
        $user = $this->usersRepository->findOneBy(['id' => $id]);

        if (empty($user)) {
            return new JsonResponse(['error' => 'User not found!'], Response::HTTP_BAD_REQUEST);
        }

        $data = $this->serializer->serialize($user, 'json');

        return new JsonResponse(json_decode($data), Response::HTTP_OK);
    }

    /**
     * @Route("/users", name="get_all_users", methods={"GET"})
     */
    public function getAll(Request $request): JsonResponse
    {
        if ($request->query->get("page") === null) {
            $page = 1;
        } else {
            $page = $request->query->get("page");
        }
        $total = $this->usersRepository->countAll();
        $offset = $page - 1;
        $nxt = $page + 1;
        $pre = $page - 1;
        $links = [];
        $links["self"] = $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
        if ($nxt * $this->limit < $total + $this->limit) {
            $links["next"] = $_SERVER["SERVER_NAME"] . "/users?page=" . $nxt;
        } else {
            $links["next"] = null;
        }
        if ($pre * $this->limit > 0 && $pre * $this->limit < $total) {
            $links["previous"] = $_SERVER["SERVER_NAME"] . "/users?page=" . $pre;
        } else {
            $links["previous"] = null;
        }
        $users = $this->usersRepository->findBy([], [], $this->limit, $offset  * $this->limit);
        $res = new stdClass();
        $res->links = json_decode(json_encode($links));
        $res->data = json_decode($this->serializer->serialize($users, 'json'));
        return new JsonResponse($res, Response::HTTP_OK);
    }

    /**
     * @Route("/user/delete/{id}", name="delete_customer", methods={"DELETE"})
     */
    public function delete($id): JsonResponse
    {
        $user = $this->usersRepository->findOneBy(['id' => $id]);

        if (empty($user)) {
            return new JsonResponse(['error' => 'User not found!'], Response::HTTP_BAD_REQUEST);
        }

        $this->usersRepository->removeUser($user);

        return new JsonResponse(['status' => 'User deleted'], Response::HTTP_NO_CONTENT);
    }
}
