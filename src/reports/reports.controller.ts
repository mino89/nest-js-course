import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(
    private repotrsService: ReportsService
  ){}

  @Get()
  getList(){
    return this.repotrsService.getList()
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
    getReport(@Param('id') id: string){
      return this.repotrsService.getReport(id)
    }
    
  @Get('/getestimate')
  getEstimate(@Query() query: GetEstimateDto){
    return this.repotrsService.createEstimate(query)
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User){
    return this.repotrsService.create(body, user)
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto){
    return this.repotrsService.changeApproval(id,body.approved)
  }


}
