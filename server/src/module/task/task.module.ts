import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskEntity } from './entity/task.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
    imports: [TypeOrmModule.forFeature([TaskEntity])],
    controllers: [TaskController],
    providers: [TaskService],
    exports: [TaskService]
})
export class TaskModule { }
