import { Article } from '@src/common/interfaces/article.interface';
import { File } from '@src/common/interfaces/file.interface';
import { History } from '@src/common/interfaces/history.interface';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArticleEntity } from './article.entity';
import { FileEntity } from './file.entity';
import { ActionEnum, ActionStatus } from '@src/common/constants';

@Entity({ name: 'history' })
export class HistoryEntity extends BaseEntity implements History {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ArticleEntity)
  article?: Article;

  @ManyToOne(() => FileEntity)
  file?: File;

  @Column({ nullable: true })
  source?: string;

  @Column({ type: 'simple-enum', enum: ActionEnum })
  action!: ActionEnum;

  @Column({
    type: 'simple-enum',
    enum: ActionStatus,
    default: ActionStatus.Success,
  })
  status!: ActionStatus;

  @Column({ nullable: true })
  message?: string;

  @CreateDateColumn()
  createTime!: Date;

  @UpdateDateColumn()
  updateTime!: Date;
}
