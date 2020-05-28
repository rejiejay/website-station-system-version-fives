import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    /**
     * 含义: 父节点唯一标识
     * 注意: parentid = root 表示 isroot
     */
    @Column({ type: 'tinytext' })
    parentid: string;

    /**
     * 含义: 根标识
     * 目的: 方便SQL查询
     */
    @Column({ type: 'bigint' })
    rootid: number;

    // 标题
    @Column({ type: 'tinytext' })
    title: string;

    // 任务内容
    @Column({ type: 'text' })
    content: string;

    /** 含义: S=Specific、M=Measurable、A=Attainable、R=Relevant、T=Time-bound */
    @Column({ type: 'text', nullable: true })
    SMART: string;

    /** 作用: 绑定结论 */
    @Column({ type: 'text', nullable: true })
    link: string;

    @Column({ type: 'bigint' })
    timestamp: number;

    @Column({ type: 'bigint', nullable: true })
    putoff: number;

    @Column({ type: 'bigint', nullable: true })
    complete: number;
}
