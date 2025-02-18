import { registerAs } from '@nestjs/config';

type DatabaseEnvType = {
    database: string;
    host: string;
    port: number;
    username: string;
    password: string;
};

export const DB_ENV = 'mysql';

export const databaseEnv = registerAs(
    DB_ENV,
    (): DatabaseEnvType => ({
        database: process.env.MYSQL_DATABASE || 'server',
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT) || 3306,
        username: process.env.MYSQL_USER || 'user',
        password: process.env.MYSQL_PASSWORD || 'user123',
    })
);