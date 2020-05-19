import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WebsiteStationUser } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([WebsiteStationUser])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }
