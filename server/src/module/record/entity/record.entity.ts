import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RecordEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * 定义: 标签分类
     * 作用: 用于区分以及关联数据
     */
    @Column({ type: 'tinytext', nullable: true })
    tag: string;

    /**
     * 定义: 数据类型
     * 作用: 用于UI判断内容显示何种格式
     * 类型枚举：0: 表示正常类型 1 表示日记类型
     */
    @Column({ type: 'tinyint', default: 0  })
    type: string;

    // 标题
    @Column({ type: 'tinytext' })
    title: string;

    /**
     * 定义: 内容
     * 作用: 可以使用 JSON.stringify 存储数据
     * 包含: Cause\Process\Situation\Target\Action\Result\Clusion
     */
    @Column({ type: 'text' })
    content: string;

    // 记录时间
    @Column({ type: 'bigint' })
    timestamp: number;

    /**
     * 定义: 图片列表
     * 定义: 使用 JSON.stringify 存储数据
     * 定义: 图片为腾讯云对象存储的基本单元。 <ObjectKey>
     * 文档: https://cloud.tencent.com/document/product/436/13324
     */
    @Column({ type: 'text', nullable: true })
    images: string;
}
