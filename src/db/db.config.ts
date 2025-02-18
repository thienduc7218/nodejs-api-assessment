import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { configDotenv } from 'dotenv';
import { TeacherStudentEntity } from 'src/entities/student-teacher.entity';
import { StudentEntity } from 'src/entities/student.entity';
import { TeacherEntity } from 'src/entities/teacher.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { databaseEnv } from './db.env';

configDotenv();
const entities = [StudentEntity, TeacherEntity, TeacherStudentEntity];

export const dbConfig: DataSourceOptions & SeederOptions = {
    type: 'mysql',
    database: process.env.MYSQL_DATABASE || 'server',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT) || 3306,
    username: process.env.POSTGRES_USER || 'user',
    password: process.env.POSTGRES_PASSWORD || 'user123',
    entities,
    migrations: [`src/migrations/*.ts`],
    synchronize: false,
    seeds: ['src/db/seeds/*.seed{.ts,.js}'],
};

export default new DataSource(dbConfig);

@Injectable()
export class PostgresConfig implements TypeOrmOptionsFactory {
    constructor(@Inject(databaseEnv.KEY) private readonly env: ConfigType<typeof databaseEnv>) { }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            database: this.env.database,
            host: this.env.host,
            port: this.env.port,
            username: this.env.username,
            password: this.env.password,
            entities,
            migrations: [`${__dirname}/src/migrations/*.{ts,js}`],
            synchronize: false,
            retryAttempts: 1,
        };
    }
}