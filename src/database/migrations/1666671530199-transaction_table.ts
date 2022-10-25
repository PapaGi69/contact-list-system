import { MigrationInterface, QueryRunner } from 'typeorm';

export class transactionTable1666671530199 implements MigrationInterface {
  name = 'transactionTable1666671530199';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "requestId" character varying NOT NULL, "from" character varying, "to" character varying, "amount" numeric NOT NULL, "type" character varying NOT NULL, "status" character varying NOT NULL, "ownerId" character varying NOT NULL, "channelId" uuid NOT NULL, "webhookURL" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
