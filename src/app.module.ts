import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appEnv } from './app.env';
import { PostgresConfig } from './db/db.config';
import { databaseEnv } from './db/db.env';
import { TeachersModule } from './teachers/teachers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appEnv, databaseEnv] }),
    TypeOrmModule.forRootAsync({ useClass: PostgresConfig }),
    TeachersModule
  ]
})
export class AppModule { }
