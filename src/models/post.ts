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
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', width: 65000 })
  body!: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt!: Date;

  @ManyToOne(
    (type) => User,
    (user) => user.posts,
    { onDelete: 'CASCADE' }
  )
  user!: User;
}
