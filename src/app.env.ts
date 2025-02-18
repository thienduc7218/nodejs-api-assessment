import { registerAs } from '@nestjs/config';

type EnvType = {
    port: number;
    prefix: string;
};

export const APP_ENV = 'app';

export const appEnv = registerAs(APP_ENV, (): EnvType => {

    return {
        prefix: process.env.API_PREFIX || 'api',
        port: parseInt(process.env.PORT || '3333', 10),
    };
});