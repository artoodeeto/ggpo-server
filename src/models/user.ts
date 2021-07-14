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
import { IncorrectCredentials } from '../errors/incorrectCredentials';
import { JwtManager } from '@overnightjs/jwt';
import { JWTokenError } from '../errors/JWTokenError';

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

  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  posts!: Post[];

  @OneToMany(() => UsersGameGroup, (userGameGroup) => userGameGroup.user, { cascade: true })
  usersGameGroups!: UsersGameGroup[];

  private _token!: string;

  // @BeforeInsert()
  // private async beforeInsertAsyncMethods(): Promise<void> {
  //   await Promise.all([this.hashPassword(), this.validateModel()]);
  // }

  @BeforeUpdate()
  @BeforeInsert()
  private async modelValidation(): Promise<void> {
    await this.validateModel();
  }

  isOwnerOfResource(currentUserId: number, requestParamsId: number): boolean {
    return currentUserId === requestParamsId;
  }

  // ! Don't add a BeforeUpdate decorator here
  // * if a before update decorator is added it will hash a hashed password
  @BeforeInsert()
  private async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, Number(process.env.SALT_ROUNDS));
    } catch (error) {
      throw new Error(error);
    }
  }

  public async hasCorrectPassword(password: string): Promise<void> {
    const result: boolean = await bcrypt.compare(password, this.password);
    if (!result) throw new IncorrectCredentials();
  }

  public generateJWToken(): void {
    const aHhToken: string = JwtManager.jwt({
      id: this.id,
      email: this.email,
      username: this.username
    });

    if (!aHhToken) throw new JWTokenError();

    this._token = aHhToken;
  }

  public get token(): string {
    return this._token;
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
    try {
      if ('password' in requestBody) {
        await this.validateModel();
        await this.hashPassword();
      }
    } catch (error) {
      throw error;
    }
  }

  static async isUserFollowingGameGroup(userId: number | string, gameGroupId: number | string): Promise<boolean> {
    try {
      const isFollower = await UsersGameGroup.findOneOrFail({
        where: [{ userId, gameGroupId }]
      });
      return !!isFollower;
    } catch (error) {
      return false;
    }
  }
}
