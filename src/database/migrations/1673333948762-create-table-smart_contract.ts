import { MigrationInterface, QueryRunner } from "typeorm";

export class createTableSmartContract1673333948762 implements MigrationInterface {
    name = 'createTableSmartContract1673333948762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "smart_contract" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "channelId" character varying NOT NULL, "deployer" character varying NOT NULL, "address" character varying NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "chainId" character varying NOT NULL, "network" character varying NOT NULL, "revision" character varying NOT NULL, "archived" character varying NOT NULL, "archivedAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_27627aca2eebd2eb72f26f6399a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "smart_contract"`);
    }

}
