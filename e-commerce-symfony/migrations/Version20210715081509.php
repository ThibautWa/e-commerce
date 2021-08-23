<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210715081509 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE product (id INT AUTO_INCREMENT NOT NULL, id_product INT NOT NULL, reference VARCHAR(20) NOT NULL, category VARCHAR(20) NOT NULL, title VARCHAR(100) NOT NULL, description VARCHAR(255) NOT NULL, color VARCHAR(20) NOT NULL, size VARCHAR(5) NOT NULL, photo VARCHAR(255) NOT NULL, price VARCHAR(3) NOT NULL, stock VARCHAR(3) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE commande');
        $this->addSql('DROP TABLE detail_commande');
        $this->addSql('DROP TABLE product');
        $this->addSql('DROP TABLE users');
    }
}
