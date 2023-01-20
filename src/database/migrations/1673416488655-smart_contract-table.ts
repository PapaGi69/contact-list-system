import { MigrationInterface, QueryRunner } from 'typeorm';

export class smartContractTable1673416488655 implements MigrationInterface {
  name = 'smartContractTable1673416488655';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "smart_contract" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "channelId" character varying NOT NULL, "deployer" character varying NOT NULL, "address" character varying NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "chainId" character varying NOT NULL, "network" character varying NOT NULL, "revision" character varying NOT NULL, "archived" character varying NOT NULL DEFAULT 'false', "archivedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_27627aca2eebd2eb72f26f6399a" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "smart_contract"`);
  }
}
