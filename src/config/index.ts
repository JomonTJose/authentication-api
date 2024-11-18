import { IDatabaseConfig, databaseConfig } from './database.config';

export interface IConfig {
    env: string;
    port: number;
    host: string;
    logLevel: string;
    clustering: string;
    database: IDatabaseConfig;
}

export const configuration = (): Partial<IConfig> => ({
    env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10) || 3000,
    host: process.env.HOST || '127.0.0.1',
    logLevel: process.env.LOG_LEVEL,
    database: databaseConfig(),
});