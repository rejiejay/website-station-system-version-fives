import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RecordEntity } from './entity/record.entity';

@Injectable()
export class RecordService {
    constructor(
        @InjectRepository(RecordEntity)
        private readonly repository: Repository<RecordEntity>,
    ) { }
}
