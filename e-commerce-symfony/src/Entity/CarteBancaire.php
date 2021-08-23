<?php

namespace App\Entity;

use App\Repository\CarteBancaireRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=CarteBancaireRepository::class)
 */
class CarteBancaire
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string")
     */
    private $numCb;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $date_exp;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $nomPrenom;

    /**
     * @ORM\ManyToOne(targetEntity=Users::class, inversedBy="cartebancaire")
     * @ORM\JoinColumn(nullable=false)
     */
    private $users;
    

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNumCb(): ?string
    {
        return $this->numCb;
    }

    public function setNumCb(int $numCb): self
    {
        $this->numCb = $numCb;

        return $this;
    }

    public function getDateExp(): ?string
    {
        return $this->date_exp;
    }

    public function setDateExp(string $date_exp): self
    {
        $this->date_exp = $date_exp;

        return $this;
    }

    public function getNomPrenom(): ?string
    {
        return $this->nomPrenom;
    }

    public function setNomPrenom(string $nomPrenom): self
    {
        $this->nomPrenom = $nomPrenom;

        return $this;
    }

    

    public function getUsers(): ?Users
    {
        return $this->users;
    }
    public function setUsers(?Users $users): self
    {
        $this->users = $users;
        return $this;
    }

   
}
