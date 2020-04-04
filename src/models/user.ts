import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  CreateDateColumn
} from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import bcrypt from 'bcrypt';
import { BaseModel } from './base_model';
import { Post } from './post';
import { GameGroup } from './gameGroup';
import { UsersGameGroup } from './usersGameGroup';

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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt!: Date;

  @OneToMany(
    (type) => Post,
    (post) => post.user,
    { cascade: true }
  )
  posts!: Post[];

  @OneToMany(
    (type) => UsersGameGroup,
    (userGameGroup) => userGameGroup.gameGroup
  )
  gameGroups!: GameGroup[];

  @BeforeInsert()
  private async beforeInsertHashPassword(): Promise<void> {
    await this.hashPassword();
  }

  private async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, Number(process.env.SALT_ROUNDS));
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @description this if statement is a workaround
   * for @BeforeUpdate decorator in typeorm.
   * Because if a user updates without a property password
   * the encrypted password will be encrypted again.
   * So here we check if the property password is present
   * in request body so we can update the password
   *
   * @param requestBody this params comes from req.body,
   * when a user wants to update its account
   */
  public async hashPasswordOnUpdate(requestBody: { password?: string }): Promise<void> {
    if ('password' in requestBody) await this.hashPassword();
  }
}
