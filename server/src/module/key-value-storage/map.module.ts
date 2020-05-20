import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MapEntity } from './entity/map.entity';
import { MapController } from './map.controller';
import { MapService } from './map.service';

@Module({
    imports: [TypeOrmModule.forFeature([MapEntity])],
    controllers: [MapController],
    providers: [MapService],
    exports: [MapService]
})
export class MapModule { }
