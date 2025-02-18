import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1739258375603 implements MigrationInterface {
    name = 'Init1739258375603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`student\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`isSuspended\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`teacher\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`teacher_student\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`studentId\` varchar(255) NOT NULL, \`teacherId\` varchar(255) NOT NULL, PRIMARY KEY (\`studentId\`, \`teacherId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`teacher_student\` ADD CONSTRAINT \`FK_2c4afeff8a893f2ae6396d65004\` FOREIGN KEY (\`studentId\`) REFERENCES \`student\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`teacher_student\` ADD CONSTRAINT \`FK_038c1d8047679fefd41b6bffa28\` FOREIGN KEY (\`teacherId\`) REFERENCES \`teacher\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`teacher_student\` DROP FOREIGN KEY \`FK_038c1d8047679fefd41b6bffa28\``);
        await queryRunner.query(`ALTER TABLE \`teacher_student\` DROP FOREIGN KEY \`FK_2c4afeff8a893f2ae6396d65004\``);
        await queryRunner.query(`DROP TABLE \`teacher_student\``);
        await queryRunner.query(`DROP TABLE \`teacher\``);
        await queryRunner.query(`DROP TABLE \`student\``);
    }

}
