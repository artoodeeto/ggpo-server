import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { IsEmail, IsEmpty, IsNotEmpty } from 'class-validator';
import bcrypt from 'bcrypt';
import { BaseModel } from './base_model';
/**
 * users table name
 */
@Entity('users')
export class User extends BaseModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsNotEmpty()
  username!: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Column()
  @IsNotEmpty()
  password!: string;

  @BeforeInsert()
  public async hashPassword() {
    try {
      this.password = await bcrypt.hash(this.password, Number(process.env.SALT_ROUNDS));
    } catch (error) {
      throw new Error(error);
    }
  }
}
