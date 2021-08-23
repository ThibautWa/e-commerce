<?php

namespace App\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\Users;
use App\Form\UsersType;
use App\Repository\UsersRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Serializer;


/**
 * @Route("/users")
 */
class UsersController extends AbstractController
{

    /**
     * @Route("/", name="users_index", methods={"GET", "POST"})
     */
    public function index(UsersRepository $usersRepository): Response
    {
        // return $this->render('users/index.html.twig', [
        //         'users' => $usersRepository->findAll(),
        //     ]);
            

        $usersData = $usersRepository->findAll();
        $serializer = $this->container->get('serializer');
        $users = $serializer->serialize($usersData, 'json');
        return new Response($users);       
 
    }

    /**
     * @Route("/new", name="users_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {
        $user = new Users();
        $form = $this->createForm(UsersType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($user);
            $entityManager->flush();

            return $this->redirectToRoute('users_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('users/new.html.twig', [
            'user' => $user,
            'form' => $form,
        ]);
    }

    /**
     * @Route("/show", name="users_show", methods={"GET", "POST"})
     */
    public function show(Request $request): Response
    {
        // return $this->render('users/show.html.twig', [
        //     'user' => $user,
        // ]);
        $email = $request->request->get("email");
        $password = $request->request->get("password");

        // $repository = $this->getDoctrine()->getRepository(UsersController::class);
        // $user = $repository->findOneBy([
        //     "Email" => $email
        // ]);
        // dd($user);
        $serializer = $this->container->get('serializer');
        $userData = $serializer->serialize($email, 'json');
        echo($email."\n".$password);
        return new Response($userData); 
        // return new JsonResponse([
        //     'user' => $user,
        // ]);
    }

    /**
     * @Route("/{id}/edit", name="users_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Users $user): Response
    {
        $form = $this->createForm(UsersType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('users_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('users/edit.html.twig', [
            'user' => $user,
            'form' => $form,
        ]);
    }

    /**
     * @Route("/{id}", name="users_delete", methods={"POST"})
     */
    public function delete(Request $request, Users $user): Response
    {
        if ($this->isCsrfTokenValid('delete'.$user->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($user);
            $entityManager->flush();
        }

        return $this->redirectToRoute('users_index', [], Response::HTTP_SEE_OTHER);
    }
}
