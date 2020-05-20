import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { consequencer, Consequencer } from 'src/utils/consequencer';

import { MapEntity } from './entity/map.entity';

@Injectable()
export class MapService {
    constructor(
        @InjectRepository(MapEntity)
        private readonly repository: Repository<MapEntity>,
    ) { }

    async getValue(key: string): Promise<Consequencer> {
        const myMap = await this.repository.findOne({ key });

        if (!myMap) return consequencer.error(`key[${key}] is error`);

        return consequencer.success(myMap);
    }

    async createValue(key: string, value: string): Promise<Consequencer> {
        let map = new MapEntity()
        map.key = key
        map.value = value
        const result = await this.repository.save(map);
        return result ? consequencer.success(result) : consequencer.error('add map to repository failure');
    }

    async setValue(key: string, value: string): Promise<Consequencer> {

        const myValue = await this.getValue(key);
        if (myValue.result !== 1) return this.createValue(key, value)

        const myMap = myValue.data

        const result = await this.repository.update(myMap, { value });
        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success(result);
        return consequencer.error(`update key[${key}] failure`);
    }

    async clearValue(key: string): Promise<Consequencer> {
        const myValue = await this.getValue(key);
        if (myValue.result !== 1) return consequencer.success();

        const result = await this.repository.delete(myValue.data)
        if (result && result.raw && result.raw.warningCount === 0) return consequencer.success();
        return consequencer.error(`delete map failure`);
    }
}
