<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210730134738 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE carte_bancaire ADD CONSTRAINT FK_59E3C22D67B3B43D FOREIGN KEY (id_users) REFERENCES users (id)');
        $this->addSql('CREATE INDEX IDX_59E3C22D67B3B43D ON carte_bancaire (id_users)');
        $this->addSql('ALTER TABLE commande ADD CONSTRAINT FK_6EEAA67D67B3B43D FOREIGN KEY (id_users) REFERENCES users (id)');
        $this->addSql('CREATE INDEX IDX_6EEAA67D67B3B43D ON commande (id_users)');
        $this->addSql('ALTER TABLE commentaire ADD CONSTRAINT FK_67F068BC67B3B43D FOREIGN KEY (id_users) REFERENCES users (id)');
        $this->addSql('CREATE INDEX IDX_67F068BC67B3B43D ON commentaire (id_users)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE carte_bancaire DROP FOREIGN KEY FK_59E3C22D67B3B43D');
        $this->addSql('DROP INDEX IDX_59E3C22D67B3B43D ON carte_bancaire');
        $this->addSql('ALTER TABLE carte_bancaire DROP id_users');
        $this->addSql('ALTER TABLE commande DROP FOREIGN KEY FK_6EEAA67D67B3B43D');
        $this->addSql('DROP INDEX IDX_6EEAA67D67B3B43D ON commande');
        $this->addSql('ALTER TABLE commande DROP id_users');
        $this->addSql('ALTER TABLE commentaire DROP FOREIGN KEY FK_67F068BC67B3B43D');
        $this->addSql('DROP INDEX IDX_67F068BC67B3B43D ON commentaire');
        $this->addSql('ALTER TABLE commentaire DROP id_users');
        $this->addSql('ALTER TABLE product DROP id_product');
        $this->addSql('ALTER TABLE users ADD roles JSON NOT NULL, ADD is_verified TINYINT(1) NOT NULL');
    }
}
