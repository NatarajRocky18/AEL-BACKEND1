import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard_controller';
import { DashboardService } from './dashboard_service';
import { DatabaseProvider } from 'src/database/database.providers';

@Module({
    controllers: [DashboardController],
    providers: [DashboardService, DatabaseProvider],
    exports: [DashboardService]
})
export class DashBoardModule { }