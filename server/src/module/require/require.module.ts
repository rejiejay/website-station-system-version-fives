import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RequireEntity } from './entity/require.entity';
import { RequireController } from './require.controller';
import { RequireService } from './require.service';

@Module({
    imports: [TypeOrmModule.forFeature([RequireEntity])],
    controllers: [RequireController],
    providers: [RequireService],
    exports: [RequireService]
})
export class RequireModule { }
