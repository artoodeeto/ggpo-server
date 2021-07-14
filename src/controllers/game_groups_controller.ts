import { Controller, Get, Middleware, Delete, Put, Post } from '@overnightjs/core';
import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import { Response, NextFunction } from 'express';
import { BaseController } from './base_controller';
import { User } from '../models/user';
import { GameGroup } from '../models/gameGroup';
import { logger } from '../../config/logger';
import { UsersGameGroup } from '../models/usersGameGroup';

@Controller('game-groups')
export class GameGroupsController extends BaseController {
  @Get('')
  @Middleware(JwtManager.middleware)
  private async getSomeGameGroup(req: ISecureRequest, res: Response, next: NextFunction): Promise<void> {
    logger.info('getSomeGameGroup params GAMEGROUP_QUERY:', { ...req.query });
    const offset = Number(req.query?.offset ?? 0);
    const limit = Number(req.query?.limit ?? 10);

    try {
      const [gameGroups, count] = await GameGroup.findAndCount({
        select: ['id', 'title', 'description', 'createdAt', 'updatedAt'],
        skip: offset,
        take: limit,
        order: { createdAt: 'DESC' }
      });

      res.status(200).json({
        meta: {
          count
        },
        payload: {
          gameGroups
        }
      });
    } catch (error) {
      next(error);
    }
  }

  @Post('')
  @Middleware(JwtManager.middleware)
  private async createGameGroup(req: ISecureRequest, res: Response, next: NextFunction): Promise<void> {
    logger.info('Creating GameGroup...');

    try {
      const { id, title, description, createdAt } = await GameGroup.create(req.body as GameGroup).save();
      res.status(201).json({
        meta: {
          createdAt
        },
        payload: {
          gameGroup: {
            id,
            title,
            description
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  @Get(':id')
  @Middleware(JwtManager.middleware)
  private async readGameGroup(req: ISecureRequest, res: Response, next: NextFunction): Promise<void> {
    logger.info({ ...req.params }, 'readGameGroup params ID:');
    logger.info({ ...req.query }, 'queries: ');
    const gameGroupId = req.params.id;
    const userId = req.payload.id;
    const offset = Number(req.query?.offset ?? 0);
    const limit = Number(req.query?.limit ?? 10);
    try {
      // const gg = GameGroup.findOneOrFail({
      //   select: ['id', 'title', 'description', 'createdAt'],
      //   join: {
      //     alias: 'gg',
      //     innerJoinAndSelect: {
      //       usersGameGroups: 'gg.usersGameGroups',
      //       users: 'usersGameGroups.user',
      //       userId: 'users.id' // <--- wont return anything. just an error of Error: Relation with property path id in entity was not found.
      //     }
      //   },
      //   where: { id: gameGroupId }
      // });

      // FIXME: men you gotta find away to add offset and limit to this shit bro
      // for ref: https://github.com/typeorm/typeorm/issues/3552
      const gg = await GameGroup.createQueryBuilder('gg')
        // .innerJoinAndSelect(UsersGameGroup, 'ugg', 'ugg.gameGroupId = gg.id')
        // .innerJoinAndSelect(User, 'u', 'u.id = ugg.userId')
        .leftJoinAndSelect('gg.usersGameGroups', 'ugg')
        .leftJoinAndSelect('ugg.user', 'u')
        .where({ id: gameGroupId })
        .select(['gg.id', 'gg.title', 'gg.description', 'gg.createdAt', 'ugg.userId', 'u.email', 'u.username'])
        .getOneOrFail();

      // // FIXME: fix this. find a way to join gamegroup
      // const gg = await UsersGameGroup.createQueryBuilder('ugg')
      //   // .innerJoinAndSelect('gg.usersGameGroups', 'ugg')
      //   .innerJoinAndSelect('ugg.user', 'u')
      //   .where({ gameGroupId: gameGroupId })
      //   .select(['ugg.userId', 'u.email', 'u.username'])
      //   .getOneOrFail();

      const follower = User.isUserFollowingGameGroup(userId, gameGroupId);
      const [gameGroup, isFollower] = await Promise.all([gg, follower]);

      res.status(200).json({
        meta: {},
        payload: {
          isFollower,
          gameGroup
        }
      });
    } catch (error) {
      next(error);
    }
  }

  @Put(':id')
  @Middleware(JwtManager.middleware)
  private async updateGameGroup(req: ISecureRequest, res: Response, next: NextFunction): Promise<void> {
    logger.info('updateGameGroup params ID:', { ...req.params });
    logger.info('updateGameGroup body', { ...req.body });
    const { id } = req.params;
    try {
      const gg = await GameGroup.findOneOrFail(id);
      Object.assign(gg, { ...req.body });
      await gg.save();
      const { title, description, createdAt, updatedAt } = gg;
      res.status(201).json({
        meta: {
          createdAt,
          updatedAt
        },
        payload: {
          gameGroup: {
            id,
            title,
            description
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  @Delete(':id')
  @Middleware(JwtManager.middleware)
  private async deleteGameGroup(req: ISecureRequest, res: Response, next: NextFunction): Promise<void> {
    logger.info('readGameGroup params ID:', { ...req.params });
    const { id } = req.params;
    try {
      const gg = await GameGroup.findOneOrFail(id);
      await gg.remove();
      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }

  @Put(':gameGroupId/follow')
  @Middleware(JwtManager.middleware)
  private async followGameGroup(req: ISecureRequest, res: Response, next: NextFunction): Promise<void> {
    logger.info('following a GameGroup ID:', { ...req.params });
    const { gameGroupId } = req.params;
    const userId = req.payload.id;
    try {
      const followedGameGroup = await User.isUserFollowingGameGroup(userId, gameGroupId);

      if (!followedGameGroup) {
        const gameGroup = await GameGroup.findOneOrFail(gameGroupId);
        await UsersGameGroup.create({ userId, gameGroup }).save();
      }

      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }

  @Delete(':gameGroupId/unfollow')
  @Middleware(JwtManager.middleware)
  private async unFollowGameGroup(req: ISecureRequest, res: Response, next: NextFunction): Promise<void> {
    logger.info('following a GameGroup ID:', { ...req.params });
    const { gameGroupId } = req.params;
    const userId = req.payload.id;
    try {
      const followedGameGroup = await UsersGameGroup.findOneOrFail({
        where: [{ userId, gameGroupId }]
      });
      await followedGameGroup.remove();

      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }

  @Get('isFollowing/route')
  @Middleware(JwtManager.middleware)
  private async protected(req: ISecureRequest, res: Response): Promise<void> {
    res.json({
      message: 'protected',
      payload: req.payload
    });
  }
}
