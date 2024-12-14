import { Module } from '@nestjs/common';
import { DatabaseProvider } from 'src/database/database.providers';
import { FormDataController } from './form_data_controller';
import { FormDataService } from './form_data_service';
@Module({
  controllers: [FormDataController],
  providers: [FormDataService,DatabaseProvider],
  exports: [FormDataService],
})
export class FormDataModule {}