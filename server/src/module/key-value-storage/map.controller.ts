import { Controller, Get, Query, Post, Body } from '@nestjs/common';

import { consequencer } from 'src/utils/consequencer';

import { MapService } from './map.service';

@Controller('map')
export class MapController {
    constructor(private readonly service: MapService) { }

    @Get()
    testUser(): string {
        return 'This action is test target';
    }

    @Get('get')
    async getValue(@Query() query: any): Promise<object> {
        const { key } = query

        if (!key) return consequencer.error('参数有误');

        return this.service.getValue(key);
    }

    @Post('set')
    async setValue(@Body() body: any): Promise<object> {
        const { key, value } = body

        if (!key || !value) return consequencer.error('参数有误');

        return this.service.setValue(key, value);
    }

    @Get('clear')
    async clearValue(@Query() query: any): Promise<object> {
        const { key } = query

        if (!key) return consequencer.error('参数有误');

        return this.service.clearValue(key);
    }
}
