/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormDataModule } from './report_screen_api/form_data_module';
import { DashBoardModule } from './dashboard_screen_api/dashboard_module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '../.env'),
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    FormDataModule,
    DashBoardModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
