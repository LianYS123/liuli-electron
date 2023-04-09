import { File } from "@src/common/interfaces/file.interface";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity({ name: "file" })
export class FileEntity extends BaseEntity implements File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  url: string;
}
