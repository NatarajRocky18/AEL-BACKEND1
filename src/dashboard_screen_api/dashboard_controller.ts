import { Controller, Get, Param, Query } from '@nestjs/common';
import { DashboardService } from './dashboard_service';


@Controller('dashboard')
export class DashboardController {
   constructor(private dashBoardService: DashboardService) { }

   @Get('drop_down/:master')
   async dropDownApi(@Param('master') modelName?: string) {
      return this.dashBoardService.getDropDownData(modelName);
   }

   @Get('all_student_records/:formdatas')
   async getFormData(
      @Query('disability') disability?: string,
      @Query('schoolStatus') schoolStatus?: string,
      @Query('employmentStatus') employmentStatus?: string,
      @Param('formdatas') modelName?: string
   ) {
      const filters = {
         disability: disability ? disability.split(',') : undefined,
         schoolStatus: schoolStatus ? schoolStatus.split(',') : undefined,
         employmentStatus: employmentStatus ? employmentStatus.split(',') : undefined
      };
      return this.dashBoardService.getAllFormData(filters, modelName);
   }

   @Get('card_value/:formdatas')
   async getDashboardCardData(@Param('formdatas') collectionName?:string) {
      return this.dashBoardService.dashboardCardValue(collectionName);
   }

   @Get('chart_value/:formdatas')
   async getDashboardChartData(@Param('formdatas') collectionName?:string) {
      return this.dashBoardService.dashboardChartValue(collectionName);
   }

}