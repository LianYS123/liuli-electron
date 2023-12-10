// src/entity/favorite-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, Tree, TreeChildren, TreeParent, BaseEntity } from 'typeorm';
import { FavoriteItem } from '@src/common/interfaces/favorite-item.interface';
import { ItemType } from '@src/common/constants';

@Entity('favorite_items')
@Tree("closure-table")
export class FavoriteItemEntity extends BaseEntity implements FavoriteItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ItemType,
  })
  type!: ItemType;

  @TreeChildren()
  children?: FavoriteItemEntity[];

  @TreeParent()
  parent?: FavoriteItemEntity;

  // We're not including the parentId field in the entity
  // since we're using the parent relation, but it's in the interface
  // for ease of use in API-related operations.
}