import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {

  constructor(
    @InjectRepository(Report) private repo: Repository<Report>
  ) { }

  getList() {
    return this.repo.find({
      select:['id','make','model','year'],
      order:{
        year: 'DESC'
      }
    })
  }

  // get a single report and return only the fields make, model, year
  async getReport(id: string) { 
    const report = await this.repo.findOne({
      where: { id: parseInt(id) },
      select: ['id', 'make', 'model', 'year']
    })
    if(!report){  
      throw new NotFoundException('report not found')
    } 
    return report
  }

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto)
    report.user = user
    return this.repo.save(report)
  }
  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } })
    if(!report){
      throw new NotFoundException('report not found')
    }
    report.approved = approved
    return this.repo.save(report)
  }
  createEstimate({make, model, lng, lat, year, mileage}: GetEstimateDto){
    return this.repo.createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', {model})
      .andWhere('lng - :lng BETWEEN -5 and 5', {lng})
      .andWhere('lat - :lat BETWEEN -5 and 5', {lat})
      .andWhere('year - :year BETWEEN -3 and 3', {year})
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({mileage})
      .andWhere('approved IS TRUE')
      .limit(3)
      .getRawOne()
  }

  

}
