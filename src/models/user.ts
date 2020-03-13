import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
  AfterUpdate
} from 'typeorm';
import { IsEmail, IsEmpty, IsNotEmpty, MinLength, Validator, validateOrReject } from 'class-validator';
import bcrypt from 'bcrypt';
import { BaseModel } from './base_model';
import { Post } from './post';

@Entity({ name: 'users' })
export class User extends BaseModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  username!: string;

  @Column({ unique: true, type: 'varchar', length: 50 })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  // @CreateDateColumn()
  @Column({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @OneToMany(
    (type) => Post,
    (post) => post.user,
    { cascade: true }
  )
  posts!: Post[];

  @BeforeInsert()
  private async beforeInsertHashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, Number(process.env.SALT_ROUNDS));
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * a work around to @CreateDateColumn()
   */
  @BeforeInsert()
  private setCreatedAtDate(): void {
    this.createdAt = new Date();
  }

  // @BeforeUpdate()
  // private async beforeUpdateHashPassword(): Promise<void> {
  //   await this.hashP();
  // }

  // TODO: fix this for update route controller
  private async hashP(): Promise<void> {
    const validator = new Validator();
    console.log(this.password, 'pas', !this.password, !validator.minLength(this.password, 6));
    console.log(this.password ?? undefined);
    if (this.password === undefined) return;
    try {
      if (!validator.minLength(this.password, 6)) throw new Error('Minimum password length is 6');
      this.password = await bcrypt.hash(this.password, Number(process.env.SALT_ROUNDS));
    } catch (error) {
      throw new Error(error);
    }
  }
}
