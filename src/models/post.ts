import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
  CreateDateColumn
} from 'typeorm';
import { User } from './user';
import { BaseModel } from './base_model';

@Entity({ name: 'posts' })
export class Post extends BaseModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', width: 65000 })
  body!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt!: Date;

  @ManyToOne(
    (type) => User,
    (user) => user.posts,
    { onDelete: 'CASCADE' }
  )
  user!: User;
}
