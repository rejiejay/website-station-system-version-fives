import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { uploadByStr, getUploadInfor, pullCopyUpload, pullDeleteUpload, getCredential } from 'src/sdk/tencent-oss';
import { consequencer, Consequencer } from 'src/utils/consequencer';
import { getTimestampByyyyyMMdd } from 'src/utils/time-transformers';

import { RecordEntity } from './entity/record.entity';

import CONST from './const';

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
        return consequencer.success(result);
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

    async getBySearch(keyword: string, searchSize: number, { tag, type }): Promise<Consequencer> {
        let condition = ''

        /** 标签 */
        if (!!tag) condition += ` AND tag="${tag}"`
        /** 标签 */
        if (!!type) condition += ` AND type="${type}"`

        const titleSql = `select * from record_entity where title LIKE '%${keyword}%' ${condition} order by timestamp desc limit ${searchSize};`
        const titleResult = await this.repository.query(titleSql);
        if (!titleResult || titleResult instanceof Array === false) return consequencer.error('sql incorrect query');

        if (titleResult.length >= searchSize) return consequencer.success(titleResult);

        const laveCount = searchSize - titleResult.length
        const contentSql = `select * from record_entity where content LIKE '%${keyword}%' ${condition} order by timestamp desc limit ${laveCount};`
        const contenResult = await this.repository.query(contentSql);
        if (!titleResult || titleResult instanceof Array === false) return consequencer.error('sql incorrect query');
        return consequencer.success(titleResult.concat(contenResult));
    }

    async getRandom(size, { tag, type }): Promise<Consequencer> {
        let condition = ''

        /** 标签 */
        if (!!tag) condition = this.conditionHandle({ initial: condition, sql: `tag="${tag}"` });
        /** 标签 */
        if (!!type) condition = this.conditionHandle({ initial: condition, sql: `type="${type}"` });

        const sql = `select * from record_entity ${condition ? `where ${condition}` : ''} order by rand() limit ${size};`

        const result = await this.repository.query(sql);
        if (!result || result instanceof Array === false) return consequencer.error('sql incorrect query');
        if (result.length === 0) return consequencer.error('数据为空');
        return consequencer.success(result);
    }

    async getOne({ id }): Promise<Consequencer> {
        const result = await this.repository.findOne({ id });
        if (!result) return consequencer.error('This record does not exist');
        return consequencer.success(result);
    }

    async delById({ id }): Promise<Consequencer> {
        const record = await this.repository.findOne({ id });
        if (!record) return consequencer.error('This record does not exist');

        const result = await this.repository.delete(record);
        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success(record);
        return consequencer.error(`del [${id}] failure`);
    }

    async statisticsTag(): Promise<Consequencer> {
        const result = await this.repository.query('select distinct tag from record_entity;');
        if (!result || result instanceof Array === false) return consequencer.error('sql incorrect query');

        const tags = result.map(record => record.tag)
        const expiredTimestamp = new Date().getTime() + (1000 * 60 * 25) /** 25分钟过期 */
        return consequencer.success({ tags, expiredTimestamp });
    }

    async addById({ title, content, tag, type, images, timestamp }): Promise<Consequencer> {
        let record = new RecordEntity()
        record.title = title
        record.content = content
        if (tag) record.tag = tag
        record.type = type ? type : 0
        if (images) record.images = images

        const nowTime = timestamp ? new Date(+timestamp) : new Date()
        record.timestamp = nowTime.getTime()
        record.fullyear = nowTime.getFullYear()

        const result = await this.repository.save(record);
        return result ? consequencer.success(result) : consequencer.error('add record to repository failure');
    }

    async temporaryImagetoProduceImage({ temporaryImageListPath }): Promise<Consequencer> {
        const produceImages = []

        for (let index = 0; index < temporaryImageListPath.length; index++) {
            const temporaryImagePath = temporaryImageListPath[index]

            /** 含义: 找到临时路径的图片 */
            const uploadInfor = await getUploadInfor(temporaryImagePath).then(
                infor => consequencer.success(infor),
                error => consequencer.error(error)
            )
            if (uploadInfor.result !== 1) return uploadInfor

            /** 含义: 复制临时图片到生产目录 */
            const nowTimestamp = new Date().getTime()
            const producePath = `website-station-system/diary-record/${nowTimestamp}.png`;
            const copyUpload = await pullCopyUpload({ oldPath: temporaryImagePath, newPath: producePath }).then(
                infor => consequencer.success(infor),
                error => consequencer.error(error)
            )
            if (copyUpload.result !== 1) return copyUpload

            /** 含义: 删除复制临时图片 */
            const deleteUpload = await this.delImage({ path: temporaryImagePath })
            if (deleteUpload.result !== 1) return deleteUpload

            produceImages.push(producePath)
        }

        return consequencer.success(produceImages);
    }

    async delImage({ path }): Promise<Consequencer> {
        /** 含义: 找到路径的图片 */
        const delInfor = await getUploadInfor(path).then(
            infor => consequencer.success(infor),
            error => consequencer.error(error)
        )
        if (delInfor.result !== 1) return delInfor

        /** 含义: 删除路径图片 */
        const deleteUpload = await pullDeleteUpload(path).then(
            infor => consequencer.success(infor),
            error => consequencer.error(error)
        )
        if (deleteUpload.result !== 1) return deleteUpload

        return consequencer.success();
    }

    async uploadImageTemporary(imageBase64String): Promise<Consequencer> {
        const path = `${CONST.IMAGES.TEMPORARY_RESOURCE}/${new Date().getTime()}.png`;

        /** 注意: UI值是经过Base64加密过后的值 */
        const str = imageBase64String.replace(/^data:image\/\w+;base64,/, '')

        return await uploadByStr({ str, path, encoding: 'base64' }).then(() => consequencer.success(path), error => consequencer.error(error))
    }

    async getById(id): Promise<Consequencer> {
        const record = await this.repository.findOne({ id });
        if (record) return consequencer.success(record);
        return consequencer.error('This record does not exist');
    }

    async editById({ id, title, content, tag, type, images, timestamp }): Promise<Consequencer> {
        const record = await this.repository.findOne({ id });
        if (!record) return consequencer.error('This record does not exist');

        let update = JSON.parse(JSON.stringify(record))
        update.title = title
        update.content = content
        update.tag = tag
        update.type = type
        update.images = images
        if (timestamp) {
            update.timestamp = timestamp
            const newTime = new Date(+timestamp)
            update.fullyear = newTime.getFullYear()
        }

        const result = await this.repository.update(record, update);
        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success(update);

        return consequencer.error(`update record failure`);
    }

    /**
     * 含义: 更新图片
     * 注意: 表示一定有临时路径
     */
    async updateProduceImageList({ produceImagePathList }): Promise<Consequencer> {
        const produceImages = []

        for (let index = 0; index < produceImagePathList.length; index++) {
            const imagePath = produceImagePathList[index]
            if (imagePath.search('temporary') === -1) {
                produceImages.push(imagePath)
                continue
            }

            /** 含义: 找到临时路径的图片 */
            const uploadInfor = await getUploadInfor(imagePath).then(
                infor => consequencer.success(infor),
                error => consequencer.error(error)
            )
            if (uploadInfor.result !== 1) return uploadInfor

            /** 含义: 复制临时图片到生产目录 */
            const nowTimestamp = new Date().getTime()
            const producePath = `${CONST.IMAGES.RESOURCE}/${nowTimestamp}.png`;
            const copyUpload = await pullCopyUpload({ oldPath: imagePath, newPath: producePath }).then(
                infor => consequencer.success(infor),
                error => consequencer.error(error)
            )
            if (copyUpload.result !== 1) return copyUpload

            /** 含义: 删除复制临时图片 */
            const deleteUpload = await this.delImage({ path: imagePath })
            if (deleteUpload.result !== 1) return deleteUpload

            produceImages.push(producePath)
        }

        /** 含义: 所有图片都转化为生产目录 */
        return consequencer.success(produceImages);
    }

    async statisticsTime(): Promise<Consequencer> {
        interface Seasons { name: string, startMonth: number, minTimestamp: number, maxTimestamp: number }
        interface Weeks { name: string, minTimestamp: number, maxTimestamp: number }

        const queryCountByTimestamp = async ({ countName, minTimestamp, maxTimestamp }) => {
            const result = await this.repository.query(`select count(*) from record_entity where timestamp>="${minTimestamp}" AND timestamp<="${maxTimestamp}";`);
            if (!result || result instanceof Array === false || result.length < 1) return consequencer.error(`count ${countName} sql incorrect query`);
            const count = result[0]['count(*)']
            return consequencer.success(count)
        }

        /** 查询年份(多少年) */
        const fullyearResult = await this.repository.query('select distinct fullyear from record_entity;');
        if (!fullyearResult || fullyearResult instanceof Array === false) return consequencer.error('query fullyear sql incorrect query');
        const fullyears = fullyearResult.map(record => record.fullyear).sort((a, b) => (+b) - (+a));

        /** 统计星期 */
        const statisticsWeek = async (fullyear: number, month: number, week: Weeks): Promise<Consequencer> => {
            const minTimestamp = week.minTimestamp
            const maxTimestamp = week.maxTimestamp
            const queryCount = await queryCountByTimestamp({ countName: 'week', minTimestamp, maxTimestamp })
            if (queryCount.result !== 1) return queryCount
            const count = queryCount.data
            const statistics_week = {
                name: week.name,
                count,
                minTimestamp,
                maxTimestamp
            }

            return consequencer.success(statistics_week);
        }

        /** 统计月份 */
        const statisticsMonth = async ({ fullyear, month }): Promise<Consequencer> => {
            const minTimestamp = getTimestampByyyyyMMdd({ year: fullyear, month, day: 1 })
            const maxTimestamp = month === 12 ? getTimestampByyyyyMMdd({ year: fullyear + 1, month: 1, day: 1 }) : getTimestampByyyyyMMdd({ year: fullyear, month: month + 1, day: 1 })
            const queryCount = await queryCountByTimestamp({ countName: 'month', minTimestamp, maxTimestamp })
            if (queryCount.result !== 1) return queryCount
            const count = queryCount.data
            const statistic_month = {
                name: `${month}月`,
                count,
                minTimestamp,
                maxTimestamp,
                children: []
            }

            if (count <= 0) return consequencer.success(statistic_month);

            const week4MaxTimestamp = month === 12 ? getTimestampByyyyyMMdd({ year: fullyear + 1, month: 1, day: 1 }) : getTimestampByyyyyMMdd({ year: fullyear, month: month + 1, day: 1 })
            const weeks = [
                { name: '第一周', minTimestamp: getTimestampByyyyyMMdd({ year: fullyear, month, day: 1 }), maxTimestamp: getTimestampByyyyyMMdd({ year: fullyear, month, day: 7 }) },
                { name: '第二周', minTimestamp: getTimestampByyyyyMMdd({ year: fullyear, month, day: 7 }), maxTimestamp: getTimestampByyyyyMMdd({ year: fullyear, month, day: 14 }) },
                { name: '第三周', minTimestamp: getTimestampByyyyyMMdd({ year: fullyear, month, day: 14 }), maxTimestamp: getTimestampByyyyyMMdd({ year: fullyear, month, day: 21 }) },
                { name: '第四周', minTimestamp: getTimestampByyyyyMMdd({ year: fullyear, month, day: 21 }), maxTimestamp: week4MaxTimestamp }
            ]

            for (let index = 0; index < weeks.length; index++) {
                const week = weeks[index];
                const statisticResult = await statisticsWeek(fullyear, month, week)
                if (statisticResult.result !== 1) return statisticResult
                const statisticWeek = statisticResult.data
                if (statisticWeek.count > 0) statistic_month.children.push(statisticWeek)
            }

            return consequencer.success(statistic_month);
        }

        /** 统计季度 */
        const statisticsSeason = async (fullyear: number, season: Seasons): Promise<Consequencer> => {
            const minTimestamp = season.minTimestamp
            const maxTimestamp = season.maxTimestamp
            const queryCount = await queryCountByTimestamp({ countName: 'season', minTimestamp, maxTimestamp })
            if (queryCount.result !== 1) return queryCount
            const count = queryCount.data
            const statistics_season = {
                name: season.name,
                count,
                minTimestamp,
                maxTimestamp,
                children: []
            }

            if (count <= 0) return consequencer.success(statistics_season);

            for (let i = 0; i < 3; i++) {
                const thisMonth = season.startMonth + i
                const statisticResult = await statisticsMonth({ fullyear, month: thisMonth })
                if (statisticResult.result !== 1) return statisticResult
                const statisticMonth = statisticResult.data
                if (statisticMonth.count > 0) statistics_season.children.push(statisticMonth)
            }

            return consequencer.success(statistics_season);
        }
        /** 统计年份 */
        const statisticsFullyear = async (fullyear): Promise<Consequencer> => {
            const result = await this.repository.query(`select count(*) from record_entity where fullyear=${fullyear};`);
            if (!result || result instanceof Array === false || result.length < 1) return consequencer.error('count fullyear sql incorrect query');
            const count = result[0]['count(*)']

            const statistic_fullyear = {
                name: `${fullyear}年`,
                count,
                minTimestamp: getTimestampByyyyyMMdd({ year: fullyear, month: 1, day: 1 }),
                maxTimestamp: getTimestampByyyyyMMdd({ year: fullyear + 1, month: 1, day: 1 }),
                /** 注意: 年份必有数据(count > 0), 所以必定存在 children */
                children: []
            }

            const seasons = [
                { name: '春季', startMonth: 1, minTimestamp: getTimestampByyyyyMMdd({ year: fullyear, month: 1, day: 1 }), maxTimestamp: getTimestampByyyyyMMdd({ year: fullyear, month: 3, day: 1 }) },
                { name: '夏季', startMonth: 3, minTimestamp: getTimestampByyyyyMMdd({ year: fullyear, month: 3, day: 1 }), maxTimestamp: getTimestampByyyyyMMdd({ year: fullyear, month: 6, day: 1 }) },
                { name: '秋季', startMonth: 6, minTimestamp: getTimestampByyyyyMMdd({ year: fullyear, month: 6, day: 1 }), maxTimestamp: getTimestampByyyyyMMdd({ year: fullyear, month: 9, day: 1 }) },
                { name: '冬季', startMonth: 9, minTimestamp: getTimestampByyyyyMMdd({ year: fullyear, month: 9, day: 1 }), maxTimestamp: getTimestampByyyyyMMdd({ year: fullyear + 1, month: 1, day: 1 }) }
            ]

            for (let index = 0; index < seasons.length; index++) {
                const season = seasons[index];
                const statisticResult = await statisticsSeason(fullyear, season)
                if (statisticResult.result !== 1) return statisticResult
                const statisticSeasons = statisticResult.data
                if (statisticSeasons.count > 0) statistic_fullyear.children.push(statisticSeasons)
            }

            return consequencer.success(statistic_fullyear);
        }

        const statistics_all = []
        for (let index = 0; index < fullyears.length; index++) {
            const fullyear = fullyears[index];
            const statisticResult = await statisticsFullyear(fullyear)
            if (statisticResult.result !== 1) return statisticResult
            statistics_all.push(statisticResult.data)
        }

        const expiredTimestamp = new Date().getTime() + (1000 * 60 * 60 * 12) /** 半天过期 */
        return consequencer.success({ statistics: statistics_all, expiredTimestamp });
    }
}
