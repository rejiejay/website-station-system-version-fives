import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { consequencer, Consequencer } from 'src/utils/consequencer';

import { RecordEntity } from './entity/record.entity';

@Injectable()
export class RecordService {
    constructor(
        @InjectRepository(RecordEntity)
        private readonly repository: Repository<RecordEntity>,
    ) { }

    conditionHandle({ initial, sql }) {
        let result = ''
        if (initial.length > 0) result = `${initial} AND `
        result += sql
        return result
    }

    async getList({ pageNo, pageSize, tag, type, minTimestamp, maxTimestamp }): Promise<Consequencer> {
        const minLimit = (pageNo > 0) ? (pageNo - 1) : 0;
        let condition = ''

        /** 标签 */
        if (!!tag) condition = this.conditionHandle({ initial: condition, sql: `tag="${tag}"` });
        /** 标签 */
        if (!!type) condition = this.conditionHandle({ initial: condition, sql: `type="${type}"` });
        /** 日期 */
        if (!!minTimestamp && !!maxTimestamp) condition = this.conditionHandle({ initial: condition, sql: `timestamp>="${minTimestamp}" AND timestamp<="${maxTimestamp}"` });

        const sql = `select * from record_entity ${condition ? `where ${condition}` : ''} order by timestamp desc limit ${(minLimit * pageSize)}, ${pageSize};`

        const result = await this.repository.query(sql);
        if (!result || result instanceof Array === false) return consequencer.error('sql incorrect query');
        if (result.length === 0) return consequencer.error('数据为空');
        return consequencer.success();
    }

    async statisticsList({ tag, type, minTimestamp, maxTimestamp }): Promise<Consequencer> {
        let condition = ''

        /** 标签 */
        if (!!tag) condition = this.conditionHandle({ initial: condition, sql: `tag="${tag}"` });
        /** 标签 */
        if (!!type) condition = this.conditionHandle({ initial: condition, sql: `type="${type}"` });
        /** 日期 */
        if (!!minTimestamp && !!maxTimestamp) condition = this.conditionHandle({ initial: condition, sql: `timestamp>="${minTimestamp}" AND timestamp<="${maxTimestamp}"` });

        const sql = `select count(*) from record_entity ${condition ? `where ${condition}` : ''};`
        const result = await this.repository.query(sql);
        if (!result || result instanceof Array === false || result.length < 1) return consequencer.error('sql incorrect query');

        const count = result[0]['count(*)']
        const expiredTimestamp = new Date().getTime() + (1000 * 60 * 5) /** 5分钟过期 */
        return consequencer.success({ count, expiredTimestamp });
    }

    async getBySearch(keyword: string, { tag, type }): Promise<Consequencer> {
        return consequencer.success();
    }

    async getRandom({ tag, type }): Promise<Consequencer> {
        return consequencer.success();
    }
}
