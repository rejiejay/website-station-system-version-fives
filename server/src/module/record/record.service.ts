import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WebsiteStationRecord } from './entity/record.entity';

@Injectable()
export class RecordService {
    constructor(
        @InjectRepository(WebsiteStationRecord)
        private readonly repository: Repository<WebsiteStationRecord>,
    ) { }
}
