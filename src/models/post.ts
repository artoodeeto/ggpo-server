import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, ManyToOne, BeforeInsert } from 'typeorm';
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

  @Column({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // @Column({ type: 'datetime' })
  // deletedAt!: Date;

  @ManyToOne(
    (type) => User,
    (user) => user.posts,
    { onDelete: 'CASCADE' }
  )
  user!: User;

  /**
   * a work around to @CreateDateColumn()
   * TODO: move this to base class
   */
  @BeforeInsert()
  private setCreatedAtDate(): void {
    this.createdAt = new Date();
  }
}
