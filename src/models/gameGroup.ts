import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany
} from 'typeorm';
import { BaseModel } from './base_model';
import { UsersGameGroup } from './usersGameGroup';

@Entity({ name: 'game_groups' })
export class GameGroup extends BaseModel {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt!: Date;

  @OneToMany(
    (type) => UsersGameGroup,
    (userGameGroup) => userGameGroup.gameGroup,
    { cascade: true }
  )
  usersGameGroups!: UsersGameGroup[];
}
