import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  CreateDateColumn,
  BeforeUpdate
} from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';
import bcrypt from 'bcrypt';
import { BaseModel } from './base_model';
import { Post } from './post';
import { UsersGameGroup } from './usersGameGroup';
import { ResourceChecker } from '../interfaces/resource_owner_checker';

@Entity({ name: 'users' })
export class User extends BaseModel implements ResourceChecker {
  @PrimaryGeneratedColumn({ type: 'int' })
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
  @MinLength(8)
  @Matches(/[0-9]/)
  @Matches(/[!@#$%^&]/)
  @Matches(/[A-Z]/)
  password!: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt!: Date;

  @OneToMany((type) => Post, (post) => post.user, { cascade: true })
  posts!: Post[];

  @OneToMany((type) => UsersGameGroup, (userGameGroup) => userGameGroup.user, { cascade: true })
  usersGameGroups!: UsersGameGroup[];

  @BeforeInsert()
  private async beforeInsertAsyncMethods(): Promise<void> {
    await Promise.all([this.hashPassword(), this.validateModel()]);
  }

  @BeforeUpdate()
  private async modelValidation(): Promise<void> {
    await this.validateModel();
  }

  // eslint-disable-next-line class-methods-use-this
  isOwnerOfResource(currentUserId: number, requestParamsId: number): boolean {
    return currentUserId === requestParamsId;
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

  static async isUserFollowingGameGroup(userId: number | string, gameGroupId: number | string): Promise<boolean> {
    const isFollower = await UsersGameGroup.findOne({
      where: [{ userId, gameGroupId }]
    });

    return !!isFollower;
  }
}
