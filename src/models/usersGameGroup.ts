import {
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './user';
import { GameGroup } from './gameGroup';
import { BaseModel } from './base_model';

@Entity({ name: 'users_game_groups' })
export class UsersGameGroup extends BaseModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt!: Date;

  @ManyToOne(
    (type) => User,
    (user) => user.gameGroups,
    { onDelete: 'CASCADE' }
  )
  user!: User;

  @ManyToOne(
    (type) => GameGroup,
    (gameGroup) => gameGroup.users,
    { onDelete: 'CASCADE' }
  )
  gameGroup!: GameGroup;
}
