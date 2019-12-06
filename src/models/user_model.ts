import { BaseModel } from "./base_model";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

/**
 * users table name
 */
@Entity('users')
export class User extends BaseModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string

  @Column()
  email!: string

  @Column()
  password!: string
}