/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntitiesHandlerController } from './controller/entitieshandler/entitieshandler.controller';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

 const envFile = ConfigModule.forRoot({
  envFilePath: join(__dirname,'../.env'),
  isGlobal: true,
})

@Module({
  imports:[envFile, DatabaseModule],
  controllers: [AppController, EntitiesHandlerController],
  providers: [AppService],
})
export class AppModule {


  
}
