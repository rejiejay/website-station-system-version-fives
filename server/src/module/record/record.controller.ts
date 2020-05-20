import { Controller, Get, Query } from '@nestjs/common';

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
        const { keyword, tag, type } = query

        if (!keyword) return consequencer.error('参数有误');

        return await this.service.getBySearch(keyword, { tag, type })
    }

    @Get('get/random')
    async getRandom(@Query() query: any): Promise<Consequencer> {
        const { tag, type } = query

        return await this.service.getRandom({ tag, type })
    }
}
