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

@Entity({ name: 'users_game_groups' })
export class UsersGameGroup {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    (type) => User,
    (user) => user.gameGroups
  )
  user!: User;

  @ManyToOne(
    (type) => GameGroup,
    (gameGroup) => gameGroup.users
  )
  gameGroup!: GameGroup;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt!: Date;
}
