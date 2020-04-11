import { Controller, Get, Middleware, Delete, Put, Post } from '@overnightjs/core';
import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import { Response } from 'express';
import { BaseController } from './base_controller';
import { User } from '../models/user';
import { GameGroup } from '../models/gameGroup';
import { logger } from '../../config/logger';
import { UsersGameGroup } from '../models/usersGameGroup';

@Controller('game_groups')
export class GameGroupsController extends BaseController {
  @Post('')
  @Middleware(JwtManager.middleware)
  private async createGameGroup(req: ISecureRequest, res: Response): Promise<void> {
    logger.info('Creating GameGroup...');

    try {
      const gg = GameGroup.create(req.body as GameGroup);
      await gg.save();
      res.json({
        meta: {},
        payload: {
          gameGroup: {
            msg: 'success'
          }
        }
      });
    } catch (error) {
      logger.error(error);
      res.status(400).json({
        error
      });
    }
  }

  @Get(':id')
  @Middleware(JwtManager.middleware)
  private async readGameGroup(req: ISecureRequest, res: Response): Promise<void> {
    logger.info('readGameGroup params ID:', { ...req.params });
    const gameGroupID = req.params.id;
    try {
      /**
       * This game group findOneOrFail is just a checking if a gamegroup exists
       * because without this and you just use query builder and theres no
       * gamegroup it will return an nested empty object and does not throw,
       * so this find will be guard for this
       */
      await GameGroup.findOneOrFail(gameGroupID);
      const gameGroup = await GameGroup.createQueryBuilder()
        .select(['gg.title', 'gg.id', 'gg.createdAt', 'ugg.id', 'u.id', 'u.username', 'u.email'])
        .from(GameGroup, 'gg')
        .innerJoin('gg.usersGameGroups', 'ugg')
        .innerJoin('ugg.user', 'u')
        .where('gg.id = :id', { id: gameGroupID })
        .getOne();

      res.json({
        meta: {},
        payload: {
          gameGroup
        }
      });
    } catch (error) {
      logger.error(error);
      res.status(400).json({
        error
      });
    }
  }

  @Put(':id')
  @Middleware(JwtManager.middleware)
  private async updateGameGroup(req: ISecureRequest, res: Response): Promise<void> {
    logger.info('updateGameGroup params ID:', { ...req.params });
    logger.info('updateGameGroup body', { ...req.body });
    const { id } = req.params;
    try {
      const gg = await GameGroup.findOneOrFail(id);
      Object.assign(gg, { ...req.body });
      await gg.save();
      const { title, createdAt, updatedAt } = gg;
      res.json({
        meta: {
          createdAt,
          updatedAt
        },
        payload: {
          gameGroup: {
            title
          }
        }
      });
    } catch (error) {
      logger.error(error);
      res.status(400).json({
        error
      });
    }
  }

  @Delete(':id')
  @Middleware(JwtManager.middleware)
  private async deleteGameGroup(req: ISecureRequest, res: Response): Promise<void> {
    logger.info('readGameGroup params ID:', { ...req.params });
    const { id } = req.params;
    try {
      const gg = await GameGroup.findOneOrFail(id);
      await gg.remove();
      res.json({
        meta: {},
        payload: {
          gameGroup: {
            msg: 'success'
          }
        }
      });
    } catch (error) {
      logger.error(error);
      res.status(400).json({
        error
      });
    }
  }

  @Get('query/some/game_groups')
  @Middleware(JwtManager.middleware)
  private async getSomeGameGroup(req: ISecureRequest, res: Response): Promise<void> {}

  @Put('follow/:gameGroupId/')
  @Middleware(JwtManager.middleware)
  private async followGameGroup(req: ISecureRequest, res: Response): Promise<void> {
    logger.info('following a GameGroup ID:', { ...req.params });
    const { gameGroupId } = req.params;
    const userId = req.payload.id;
    try {
      const user = User.findOneOrFail(userId);
      const gameGroup = GameGroup.findOneOrFail(gameGroupId);
      const followedGameGroup = UsersGameGroup.findOne({
        where: [{ user: userId, gameGroup: gameGroupId }]
      });
      const [theUser, gg, fGG] = await Promise.all([user, gameGroup, followedGameGroup]);
      /**
       * @description This will check if the user is already following this gamegroup
       * if not allow to follow
       * Refactor this sloppy ass code,
       * Although when a user checks a gamegroup in the frontend it should show unfollow instead of follow, hmmm
       */
      if (!fGG) {
        const uGG = UsersGameGroup.create({ user: theUser, gameGroup: gg });
        await uGG.save();
      }

      res.json({
        meta: {},
        payload: {
          gameGroup: 'success'
        }
      });
    } catch (error) {
      logger.error(error);
      res.status(400).json({
        error
      });
    }
  }

  @Delete('unfollow/:gameGroupId/')
  @Middleware(JwtManager.middleware)
  private async unFollowGameGroup(req: ISecureRequest, res: Response): Promise<void> {
    logger.info('following a GameGroup ID:', { ...req.params });
    const { gameGroupId } = req.params;
    const userId = req.payload.id;
    try {
      const followedGameGroup = await UsersGameGroup.findOneOrFail({
        where: [{ user: userId, gameGroup: gameGroupId }]
      });
      await followedGameGroup.remove();

      res.json({
        meta: {},
        payload: {
          gameGroup: 'success'
        }
      });
    } catch (error) {
      logger.error(error);
      res.status(400).json({
        error
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
