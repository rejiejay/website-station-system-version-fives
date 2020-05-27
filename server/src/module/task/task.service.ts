import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { consequencer, Consequencer } from 'src/utils/consequencer';

import { TaskEntity } from './entity/task.entity';


@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly repository: Repository<TaskEntity>,
    ) { }

    async getRootList(): Promise<Consequencer> {
        const result = await this.repository.query(`select * from task_entity where parentid = "root" AND complete IS NULL order by timestamp desc;`);
        if (!result || result instanceof Array === false) return consequencer.error('sql incorrect query');
        if (result.length === 0) return consequencer.error('数据为空');
        return consequencer.success(result);
    }
}
