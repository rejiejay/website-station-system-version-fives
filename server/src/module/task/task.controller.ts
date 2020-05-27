import { Controller, Get, Query, Post, Body } from '@nestjs/common';

import { consequencer, Consequencer } from 'src/utils/consequencer';

import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
    constructor(private readonly service: TaskService) { }

    @Get()
    test(): string {
        return 'This Action is Test task';
    }

    @Get('list/root')
    async getRootList(@Query() query: any): Promise<Consequencer> {
        return await this.service.getRootList()
    }
}
