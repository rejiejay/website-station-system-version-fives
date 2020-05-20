import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WebsiteStationRecord } from './entity/record.entity';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';

@Module({
    imports: [TypeOrmModule.forFeature([WebsiteStationRecord])],
    controllers: [RecordController],
    providers: [RecordService],
    exports: [RecordService]
})
export class RecordModule { }
