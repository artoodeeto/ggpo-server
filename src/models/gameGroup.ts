import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import { BaseModel } from './base_model';
import { UsersGameGroup } from './usersGameGroup';
import { IsNotEmpty } from 'class-validator';

@Entity({ name: 'game_groups' })
export class GameGroup extends BaseModel {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  title!: string;

  @Column({ type: 'varchar', length: 500 })
  @IsNotEmpty()
  description!: string;

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

  @BeforeInsert()
  @BeforeUpdate()
  private async modelValidation(): Promise<void> {
    await this.validateModel();
  }
}
