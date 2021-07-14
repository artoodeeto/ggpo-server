import {
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';
import { User } from './user';
import { GameGroup } from './gameGroup';
import { BaseModel } from './base_model';

@Entity({ name: 'users_game_groups' })
export class UsersGameGroup extends BaseModel {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'int' })
  userId!: number;

  @Column({ type: 'int' })
  gameGroupId!: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt!: Date;

  @ManyToOne((type) => User, (user) => user.usersGameGroups, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne((type) => GameGroup, (gameGroup) => gameGroup.usersGameGroups, { onDelete: 'CASCADE' })
  gameGroup!: GameGroup;

  isOwnerOfResource(currentUserId: number, requestParamsId: number): boolean | Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
