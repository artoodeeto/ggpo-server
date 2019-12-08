import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { BaseModel } from './base_model';
import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from "class-validator";
/**
 * users table name
 */
@Entity('users')
export class User extends BaseModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Column()
  password!: string;
}
