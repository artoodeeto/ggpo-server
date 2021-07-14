import { Controller, Get, Middleware, Delete, Put } from '@overnightjs/core';
import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import { Response, NextFunction } from 'express';
import { BaseController } from './base_controller';
import { User } from '../models/user';
import { logger } from '../../config/logger';
import { ResourceValidation } from '../middlewares/resource_validation_middleware';
import { Post as PostModel } from '../models/post';
import { nextTick } from 'node:process';

@Controller('users')
export class UsersController extends BaseController {
  @Get('')
  @Middleware(JwtManager.middleware)
  private async getSomeUsers(req: ISecureRequest, res: Response, next: NextFunction): Promise<void> {
    logger.info('getSomeUsers params USER_ID:', { ...req.query });
    const offset = Number(req.query?.offset ?? 0);
    const limit = Number(req.query?.limit ?? 10);

    try {
      const [users, count] = await User.findAndCount({
        select: ['id', 'email', 'username'],
        skip: offset,
        take: limit,
        order: { createdAt: 'DESC' }
      });

      res.status(200).json({
        meta: {
          count
        },
        payload: {
          users
        }
      });
    } catch (error) {
      next(error);
    }
  }

  @Get(':id')
  @Middleware(JwtManager.middleware)
  private async readUser(req: ISecureRequest, res: Response, next: NextFunction): Promise<void> {
    logger.info('readUser params USER_ID:', { ...req.params });
    const { id } = req.params;
    try {
      const { username, email } = await User.findOneOrFail(id);

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
      next(error);
    }
  }

  @Put(':id')
  @Middleware([JwtManager.middleware, ResourceValidation.checkIfCurrentUserIsOwnerOfResource(new User())])
  private async updateUser(req: ISecureRequest, res: Response, next: NextFunction): Promise<void> {
    logger.info('updateUser params USER_ID:', { ...req.params });
    logger.info('updateUser params USER_BODY:', { ...req.body });
    const { id } = req.params;

    try {
      const user: User = await User.findOneOrFail(id);
      Object.assign(user, { ...req.body });
      await user.hashPasswordOnUpdate(req.body);
      const { password, updatedAt, createdAt, deletedAt, ...restOfUserObject } = await user.save({
        data: req.body.password
      });
      res.status(201).json({
        meta: {
          updatedAt,
          createdAt
        },
        payload: {
          user: restOfUserObject
        }
      });
    } catch (error) {
      next(error);
    }
  }

  @Delete(':id')
  @Middleware([JwtManager.middleware, ResourceValidation.checkIfCurrentUserIsOwnerOfResource(new User())])
  private async deleteUser(req: ISecureRequest, res: Response, next: NextFunction): Promise<void> {
    logger.info('deleteUser params USER_ID:', { ...req.params });
    const { id } = req.params;
    try {
      /**
       * @description softRemove is not yet implemented in BaseEntity
       * softRemove doesn't work on 1:n relation.
       */
      const user: User = await User.findOneOrFail(id);
      await user.softRemove();

      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }

  // FIXME: I think this should be move in the POST controller
  @Get(':id/posts')
  @Middleware([JwtManager.middleware, ResourceValidation.checkIfCurrentUserIsOwnerOfResource(new User())])
  private async getCurrentUserPosts(req: ISecureRequest, res: Response, next: NextFunction): Promise<void> {
    logger.info('getSomeUsers params USER_ID:', { ...req.query });
    const { id } = req.params;
    const offset = Number(req.query?.offset ?? 0);
    const limit = Number(req.query?.limit ?? 10);

    const [posts, count] = await PostModel.findAndCount({
      select: ['id', 'title', 'body', 'updatedAt', 'createdAt'],
      where: { user: id },
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC'
      }
    });

    try {
      res.status(200).json({
        meta: {
          count
        },
        payload: {
          posts
        }
      });
    } catch (error) {
      next(error);
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
