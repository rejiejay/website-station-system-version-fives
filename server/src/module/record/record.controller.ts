import { Controller, Get, Query, Post, Body } from '@nestjs/common';

import { consequencer, Consequencer } from 'src/utils/consequencer';

import { RecordService } from './record.service';

@Controller('record')
export class RecordController {
    constructor(private readonly service: RecordService) { }

    @Get()
    testrecord(): string {
        return 'This Action is Test record';
    }

    @Get('get/list')
    async getList(@Query() query: any): Promise<Consequencer> {
        const { pageNo, pageSize, tag, type, minTimestamp, maxTimestamp } = query

        if (!pageNo || !pageSize) return consequencer.error('参数有误');

        return await this.service.getList({ pageNo, pageSize, tag, type, minTimestamp, maxTimestamp })
    }

    @Get('statistics/list')
    async statisticsList(@Query() query: any): Promise<Consequencer> {
        const { tag, type, minTimestamp, maxTimestamp } = query

        return await this.service.statisticsList({ tag, type, minTimestamp, maxTimestamp })
    }

    @Get('search')
    async getBySearch(@Query() query: any): Promise<Consequencer> {
        const { keyword, searchSize, tag, type } = query

        if (!keyword || !searchSize) return consequencer.error('参数有误');

        return await this.service.getBySearch(keyword, searchSize, { tag, type })
    }

    @Get('get/random')
    async getRandom(@Query() query: any): Promise<Consequencer> {
        const { size, tag, type } = query

        if (!size) return consequencer.error('参数有误');

        return await this.service.getRandom(size, { tag, type })
    }

    @Get('get/one')
    async getOne(@Query() query: any): Promise<Consequencer> {
        const { id } = query

        if (!id) return consequencer.error('参数有误');

        return await this.service.getOne({ id })
    }

    @Post('del/id')
    async delById(@Body() body: any): Promise<Consequencer> {
        const { id } = body

        if (!id) return consequencer.error('参数有误');

        return await this.service.delById({ id })
    }
}
