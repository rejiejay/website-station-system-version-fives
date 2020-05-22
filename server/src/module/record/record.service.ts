import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { uploadByStr, getUploadInfor, pullCopyUpload, pullDeleteUpload, getCredential } from 'src/sdk/tencent-oss';
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

    async addById({ title, content, tag, type, images }): Promise<Consequencer> {
        let record = new RecordEntity()
        record.title = title
        record.content = content
        if (tag) record.tag = tag
        record.type = type ? type : 0
        if (images) record.images = images
        record.timestamp = new Date().getTime()

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
        const path = `website-station-system/diary-record/temporary/${new Date().getTime()}.png`;

        /** 注意: UI值是经过Base64加密过后的值 */
        const str = imageBase64String.replace(/^data:image\/\w+;base64,/, '')

        return await uploadByStr({ str, path, encoding: 'base64' }).then(() => consequencer.success(path), error => consequencer.error(error))
    }

    async getById(id): Promise<Consequencer> {
        const record = await this.repository.findOne({ id });
        if (record) return consequencer.success(record);
        return consequencer.error('This record does not exist');
    }

    async editById({ id, title, content, tag, type, images }): Promise<Consequencer> {
        const record = await this.repository.findOne({ id });
        if (!record) return consequencer.error('This record does not exist');

        const result = await this.repository.update(record, { title, content, tag, type, images });
        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success({ title, content, tag, type, images });

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
            const producePath = `website-station-system/diary-record/${nowTimestamp}.png`;
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
}
