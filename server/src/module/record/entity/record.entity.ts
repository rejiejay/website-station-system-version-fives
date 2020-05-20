import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WebsiteStationRecord {
    @PrimaryGeneratedColumn()
    id: number;
}
