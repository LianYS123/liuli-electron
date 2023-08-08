import { Article } from "@src/common/interfaces/article.interface";
import { File } from "@src/common/interfaces/file.interface";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Unique,
  ManyToMany,
  JoinTable,
  Generated
} from "typeorm";
import { FileEntity } from "./file.entity";

@Entity({
  name: "article",
})
@Unique(["raw_id"])
export class ArticleEntity extends BaseEntity implements Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  raw_id: string;

  @Column()
  title: string;

  @Column({
    type: "datetime"
  })
  time: Date;

  @Column()
  href: string;

  @Column({
    nullable: true
  })
  img_src?: string;

  @Column()
  tags: string;

  @Column({
    type: "text"
  })
  content: string;

  @Column()
  cat: string;

  @Column()
  entry_content: string;

  @Column({
    type: "int"
  })
  rating_count: number;

  @Column({
    type: "float"
  })
  rating_score: number;

  @Column({
    nullable: true
  })
  uid: string;

  @Column({
    nullable: true
  })
  imgs?: string;

  @ManyToMany(() => FileEntity)
  @JoinTable()
  files: File[];
}
