import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
  CreateDateColumn,
  BeforeUpdate,
  BeforeInsert
} from 'typeorm';
import { User } from './user';
import { BaseModel } from './base_model';
import { IsNotEmpty } from 'class-validator';
import { ResourceChecker } from '../interfaces/resource_owner_checker';

@Entity({ name: 'posts' })
export class Post extends BaseModel implements ResourceChecker {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  title!: string;

  @Column({ type: 'varchar', length: 10000 })
  @IsNotEmpty()
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

  @BeforeUpdate()
  @BeforeInsert()
  private async modelValidation(): Promise<void> {
    await this.validateModel();
  }

  // eslint-disable-next-line class-methods-use-this
  async isOwnerOfResource(currentUserId: number, requestParamsId: number): Promise<boolean> {
    try {
      await Post.findOneOrFail({
        where: [{ user: currentUserId, id: requestParamsId }]
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
