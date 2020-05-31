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

    @Get('list/group/by')
    async getListBy(@Query() query: any): Promise<Consequencer> {
        const { rootid } = query

        if (!rootid) return consequencer.error('参数有误');

        return await this.service.getListBy(rootid)
    }

    @Get('random')
    async getByRandom(@Query() query: any): Promise<Consequencer> {
        return await this.service.getByRandom()
    }

    @Get('id')
    async getById(@Query() query: any): Promise<Consequencer> {
        const { id } = query

        if (!id) return consequencer.error('参数有误');

        return await this.service.getById(id)
    }

    @Post('modify/parentid')
    async modifyParentid(@Body() body: any): Promise<Consequencer> {
        const { oldId, newId } = body

        if (!oldId || !newId) return consequencer.error('参数有误');

        return await this.service.modifyParentid({ oldId, newId })
    }

    @Post('accomplish')
    async accomplish(@Body() body: any): Promise<Consequencer> {
        const { id } = body

        if (!id) return consequencer.error('参数有误');

        return await this.service.accomplish(id)
    }

    @Post('bind/link')
    async bindLink(@Body() body: any): Promise<Consequencer> {
        const { id, link } = body

        if (!id || !link) return consequencer.error('参数有误');

        return await this.service.bindLink(id, link)
    }

    @Post('set/putoff')
    async setPutoff(@Body() body: any): Promise<Consequencer> {
        const { id, putoff } = body

        if (!id || !putoff) return consequencer.error('参数有误');

        return await this.service.setPutoff(id, putoff)
    }

    @Post('clear/putoff')
    async clearPutoff(@Body() body: any): Promise<Consequencer> {
        const { id } = body

        if (!id) return consequencer.error('参数有误');

        return await this.service.clearPutoff(id)
    }

    @Post('del')
    async delTask(@Body() body: any): Promise<Consequencer> {
        const { id } = body

        if (!id) return consequencer.error('参数有误');

        return await this.service.delTask(id)
    }
}
