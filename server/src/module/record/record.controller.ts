import { Controller, Get, Query, Post, Body } from '@nestjs/common';

import { consequencer, Consequencer } from 'src/utils/consequencer';
import jsonHandle from 'src/utils/json-handle';

import { RecordService } from './record.service';

@Controller('record')
export class RecordController {
    constructor(private readonly service: RecordService) { }

    @Get()
    testrecord(): string {
        return 'This Action is Test record';
    }

    @Get('get/list')
    async getList(@Query() query: any): Promise<Consequencer> {
        const { pageNo, pageSize, tag, type, minTimestamp, maxTimestamp } = query

        if (!pageNo || !pageSize) return consequencer.error('参数有误');

        return await this.service.getList({ pageNo, pageSize, tag, type, minTimestamp, maxTimestamp })
    }

    @Get('statistics/list')
    async statisticsList(@Query() query: any): Promise<Consequencer> {
        const { tag, type, minTimestamp, maxTimestamp } = query

        return await this.service.statisticsList({ tag, type, minTimestamp, maxTimestamp })
    }

    @Get('search')
    async getBySearch(@Query() query: any): Promise<Consequencer> {
        const { keyword, searchSize, tag, type } = query

        if (!keyword || !searchSize) return consequencer.error('参数有误');

        return await this.service.getBySearch(keyword, searchSize, { tag, type })
    }

    @Get('get/random')
    async getRandom(@Query() query: any): Promise<Consequencer> {
        const { size, tag, type } = query

        if (!size) return consequencer.error('参数有误');

        return await this.service.getRandom(size, { tag, type })
    }

    @Get('get/one')
    async getOne(@Query() query: any): Promise<Consequencer> {
        const { id } = query

        if (!id) return consequencer.error('参数有误');

        return await this.service.getOne({ id })
    }

    @Post('del/id')
    async delById(@Body() body: any): Promise<Consequencer> {
        const { id } = body

        if (!id) return consequencer.error('参数有误');

        return await this.service.delById({ id })
    }

    @Get('statistics/tag')
    async statisticsTag(@Query() query: any): Promise<Consequencer> {
        return await this.service.statisticsTag()
    }

    @Post('add')
    async addById(@Body() body: any): Promise<Consequencer> {
        let { title, content, tag, type, images } = body

        if (!title || !content) return consequencer.error('参数有误');

        if (!images) return await this.service.addById({ title, content, tag, type, images })

        /** 含义: 开始处理图片 */
        const imagesVerify = jsonHandle.verifyJSONString({ jsonString: images, isArray: true })
        if (!imagesVerify) return await this.service.addById({ title, content, tag, type, images })
        const imageArray = imagesVerify.data

        /** 含义: 临时图片路径转为正式路径 */
        const transform = await this.service.temporaryImagetoProduceImage({ temporaryImageListPath: imageArray })
        if (transform.result !== 1) return transform

        /** 含义: 转换成功 */
        images = JSON.stringify(transform.data)
        return await this.service.addById({ title, content, tag, type, images })
    }

    @Post('image/temporary/upload')
    async uploadImage(@Body() body: any): Promise<object> {
        const { imageBase64String } = body

        if (!imageBase64String) return consequencer.error('参数有误');

        return this.service.uploadImageTemporary(imageBase64String);
    }
}
