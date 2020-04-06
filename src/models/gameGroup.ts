import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany
} from 'typeorm';
import { User } from './user';
import { BaseModel } from './base_model';
import { UsersGameGroup } from './usersGameGroup';

@Entity({ name: 'game_groups' })
export class GameGroup extends BaseModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt!: Date;

  @OneToMany(
    (type) => UsersGameGroup,
    (userGameGroup) => userGameGroup.user,
    { cascade: true }
  )
  users!: User[];
}
