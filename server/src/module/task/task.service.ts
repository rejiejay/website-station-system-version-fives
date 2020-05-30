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
        const result = await this.repository.query('select * from task_entity where parentid="root" AND complete IS NULL order by timestamp desc;');
        if (!result || result instanceof Array === false) return consequencer.error('sql incorrect query');
        if (result.length === 0) return consequencer.error('数据为空');
        return consequencer.success(result);
    }

    async getListBy(rootid): Promise<Consequencer> {
        const result = await this.repository.query(`select * from task_entity where rootid="${rootid}" AND complete IS NULL order by timestamp desc;`);
        if (!result || result instanceof Array === false) return consequencer.error('sql incorrect query');
        if (result.length === 0) return consequencer.error('数据为空');
        return consequencer.success(result);
    }

    async getByRandom(): Promise<Consequencer> {
        const result = await this.repository.query('select * from task_entity where parentid!="root" AND complete IS NULL order by rand() limit 1;');
        if (!result || result instanceof Array === false) return consequencer.error('sql incorrect query');
        if (result.length === 0) return consequencer.error('数据为空');
        return consequencer.success(result[0]);
    }

    async getById(id): Promise<Consequencer> {
        const result = await this.repository.findOne({ id });
        if (!result) return consequencer.error('This record does not exist');
        return consequencer.success(result);
    }

    async modifyParentid({ oldId, newId }): Promise<Consequencer> {
        let oldTask = await this.repository.findOne({ id: oldId });
        if (!oldTask) return consequencer.error('This record does not exist');
        const newTask = await this.repository.findOne({ id: newId });
        if (!newTask) return consequencer.error('This record does not exist');

        let update = JSON.parse(JSON.stringify(oldTask))
        update.parentid = `${newTask.id}`
        update.rootid = newTask.rootid

        const updateRoot = await this.updateRootTimestamp(oldTask.rootid)
        if (updateRoot.result !== 1) return updateRoot

        const result = await this.repository.update(oldTask, update);
        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success(update);
        return consequencer.error('Update root timestamp false');
    }

    async updateRootTimestamp(id): Promise<Consequencer> {
        const task = await this.repository.findOne({ id });
        if (!task) return consequencer.error('This record does not exist');
        let update = JSON.parse(JSON.stringify(task))

        update.timestamp = new Date().getTime()
        const result = await this.repository.update(task, update);

        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success(update);
        return consequencer.error('Update root timestamp false');
    }
}
