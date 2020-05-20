import { Controller, Get, Query } from '@nestjs/common';

import { RecordService } from './record.service';

@Controller('record')
export class RecordController {
    constructor(private readonly service: RecordService) { }

    @Get()
    testrecord(): string {
        return 'This Action is Test record';
    }
}
