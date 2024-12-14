// form-data.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { FormDataService } from './form_data_service';

@Controller('single_student')
export class FormDataController {
  constructor(private readonly formDataService: FormDataService) { }

  @Get(':collectionName/:id')   //collection ='formadatas/1'
  async getFormDataById(@Param('id') id: string, @Param('collectionName') modelName?: string) {
    return this.formDataService.getAllFormDataByAggregation(id,modelName);
  }

}
