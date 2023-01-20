import { MigrationInterface, QueryRunner } from "typeorm";

export class smartContractAddPublicKey1674181814897 implements MigrationInterface {
    name = 'smartContractAddPublicKey1674181814897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "smart_contract" ADD "publicKey" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "smart_contract" DROP COLUMN "publicKey"`);
    }

}
