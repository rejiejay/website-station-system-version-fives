import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskAssisPlan } from './entity/plan.entity';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({
    imports: [TypeOrmModule.forFeature([TaskAssisPlan])],
    controllers: [PlanController],
    providers: [PlanService],
    exports: [PlanService]
})
export class PlanModule { }
