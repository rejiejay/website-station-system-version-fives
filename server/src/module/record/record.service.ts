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

    async getList({ pageNo, pageSize, tag, type, minTimestamp, maxTimestamp }): Promise<Consequencer> {
        const minLimit = (pageNo > 0) ? (pageNo - 1) : 0;
        let condition = ''

        /** 标签 */
        if (!!tag) condition += `tag="${tag}"`

        /** 标签 */
        if (!!type) {
            if (condition.length > 0) condition += ' AND '
            condition += `type="${type}"`
        }

        /** 日期 */
        if (!!minTimestamp && !!maxTimestamp) {
            if (condition.length > 0) condition += ' AND '
            condition += `timestamp>="${minTimestamp}" AND timestamp<="${maxTimestamp}"`
        }

        const sql = `select * from record_entity ${condition ? `where ${condition}` : ''} order by timestamp desc limit ${(minLimit * pageSize)}, ${pageSize};`

        const result = await this.repository.query(sql);
        if (!result || result instanceof Array === false) return consequencer.error('sql incorrect query');
        if (result.length === 0) return consequencer.error('数据为空');
        return consequencer.success();
    }

    async getBySearch(keyword: string, { tag, type }): Promise<Consequencer> {
        return consequencer.success();
    }

    async getRandom({ tag, type }): Promise<Consequencer> {
        return consequencer.success();
    }
}
