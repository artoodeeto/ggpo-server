import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne
} from 'typeorm';
import { BaseModel } from './base_model';
import { IsNotEmpty } from 'class-validator';
import { User } from './user';

@Entity({ name: 'auth_providers' })
export class AuthProvider extends BaseModel {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  // ? could not unique because a user might have the same facebook and twitter user id. Who knows?
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  provider_id!: string;

  @Column({ type: 'varchar', length: 500 })
  @IsNotEmpty()
  platform!: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt!: Date;

  @ManyToOne((type) => User, (user) => user.authProvider, { onDelete: 'CASCADE' })
  user!: User;

  isOwnerOfResource(currentUserId: number, requestParamsId: number): boolean | Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
