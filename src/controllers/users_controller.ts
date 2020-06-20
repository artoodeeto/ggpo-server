import { Controller, Get, Middleware, Delete, Put } from '@overnightjs/core';
import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import { Response } from 'express';
import { BaseController } from './base_controller';
import { User } from '../models/user';
import { logger } from '../../config/logger';
import { UsersGameGroup } from '../models/usersGameGroup';
import { ResourceValidation } from '../middlewares/resource_validation_middleware';

const resV = new ResourceValidation(new User());

// console.log(resV.checkIfCurrentUserIsOwnerOfResource(1, 2, 3), 'ffffffffffffffffffff');
@Controller('users')
export class UsersController extends BaseController {
  @Get(':id')
  @Middleware(JwtManager.middleware)
  private async readUser(req: ISecureRequest, res: Response): Promise<void> {
    logger.info('readUser params USER_ID:', { ...req.params });
    const { id } = req.params;
    try {
      const { username, email } = await User.findOneOrFail(id);

      // const u = await User.createQueryBuilder()
      //   .select(['user.id', 'user.username', 'user.email', 'p.title', 'gg.id', 'ugg.id'])
      //   .from(User, 'user')
      //   .leftJoin('user.posts', 'p')
      //   .leftJoin('user.usersGameGroups', 'ugg')
      //   .leftJoin('ugg.gameGroup', 'gg')
      //   .limit(10)
      //   .where('user.id = :id', { id })
      //   .getOne();

      res.status(200).json({
        meta: {},
        payload: {
          user: {
            id,
            username,
            email
          }
        }
      });
    } catch (error) {
      logger.error(error);
      const { statusCode, errorMessage, errorType } = super.controllerErrors(error);
      res.status(statusCode).json({
        errorType,
        errorMessage
      });
    }
  }

  @Put(':id')
  @Middleware([resV.checkIfCurrentUserIsOwnerOfResource(new User()), JwtManager.middleware])
  private async updateUser(req: ISecureRequest, res: Response): Promise<void> {
    logger.info('updateUser params USER_ID:', { ...req.params });
    logger.info('updateUser params USER_BODY:', { ...req.body });
    const { id } = req.params;

    try {
      const user: User = await User.findOneOrFail(id);
      Object.assign(user, { ...req.body });
      await user.hashPasswordOnUpdate(req.body);
      const { password, updatedAt, createdAt, deletedAt, ...restOfUserObject } = await user.save();
      res.status(201).json({
        meta: {
          updatedAt,
          createdAt,
          deletedAt
        },
        payload: {
          user: restOfUserObject
        }
      });
    } catch (error) {
      logger.error(error);
      const { statusCode, errorMessage, errorType } = super.controllerErrors(error);
      res.status(statusCode).json({
        errorType,
        errorMessage
      });
    }
  }

  @Delete(':id')
  @Middleware(JwtManager.middleware)
  private async deleteUser(req: ISecureRequest, res: Response): Promise<void> {
    logger.info('deleteUser params USER_ID:', { ...req.params });
    const { id } = req.params;
    try {
      /**
       * @description softRemove is not yet implemented in BaseEntity
       * softRemove doesn't work on 1:n relation.
       */
      const user: User = await User.findOneOrFail(id);
      await user.remove();

      res.status(204).json();
    } catch (error) {
      logger.error(error);
      const { statusCode, errorMessage, errorType } = super.controllerErrors(error);
      res.status(statusCode).json({
        errorType,
        errorMessage
      });
    }
  }

  @Get('query/some/users')
  @Middleware(JwtManager.middleware)
  private async getSomeUsers(req: ISecureRequest, res: Response): Promise<void> {
    logger.info('getSomeUsers params USER_ID:', { ...req.query });
    const offset = req.query?.offset ?? 0;

    const u = User.find({
      select: ['id', 'email', 'username'],
      skip: offset,
      take: 10,
      order: { id: 'ASC' }
    });
    /** explanation on why theres a separate query for count is on getSomeGameGroup */
    const c = User.count();

    const [count, users] = await Promise.all([c, u]);

    try {
      res.status(200).json({
        meta: {
          count
        },
        payload: {
          users
        }
      });
    } catch (error) {
      logger.error(error);
      const { statusCode, errorMessage, errorType } = super.controllerErrors(error);
      res.status(statusCode).json({
        errorType,
        errorMessage
      });
    }
  }

  @Get('protected/route')
  @Middleware(JwtManager.middleware)
  private async protected(req: ISecureRequest, res: Response): Promise<void> {
    res.json({
      message: 'protected',
      payload: req.payload
    });
  }
}
