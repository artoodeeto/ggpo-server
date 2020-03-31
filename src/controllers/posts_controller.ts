import { BaseController } from './base_controller';
import { Controller, Post, Middleware, Get, Put, Delete } from '@overnightjs/core';
import { Response } from 'express';
import { Post as PostModel } from '../models/post';
import { ISecureRequest, JwtManager } from '@overnightjs/jwt';
import { User } from '../models/user';
import { logger } from '../../config/logger';

@Controller('posts')
export class PostsController extends BaseController {
  @Post('')
  @Middleware(JwtManager.middleware)
  private async createPost(req: ISecureRequest, res: Response): Promise<void> {
    logger.info('createPost params USER_PAYLOAD:', { ...req.payload });
    logger.info('ceratePost params POST_BODY:', { ...req.body });
    const { id } = req.payload;
    /**
     * {@link https://github.com/typeorm/typeorm/issues/5699}
     */
    const post: PostModel = PostModel.create(req.body as PostModel);
    try {
      const user: User = await User.findOneOrFail(id);
      post.user = user;
      const { id: postID, title, body } = await post.save();
      res.status(200).json({
        meta: {},
        payload: {
          post: {
            id: postID,
            title,
            body
          }
        }
      });
    } catch (error) {
      logger.error(error);
      res.status(400).json({ error });
    }
  }

  @Get(':id')
  @Middleware(JwtManager.middleware)
  private async readPost(req: ISecureRequest, res: Response): Promise<void> {
    logger.info('readPost params POST_ID:', { ...req.params });
    const { id } = req.params;
    try {
      res.status(200).json({
        meta: {},
        payload: {
          post: await PostModel.findOneOrFail(id)
        }
      });
    } catch (error) {
      logger.error(error);
      res.status(404).json({ error });
    }
  }

  @Put(':id')
  @Middleware(JwtManager.middleware)
  private async updatePost(req: ISecureRequest, res: Response): Promise<void> {
    logger.info('updatePost params POST_ID:', { ...req.params });
    logger.info('updatePost params POST_BODY:', { ...req.body });
    const { id } = req.params;
    const { title, body } = req.body;

    try {
      const post = await PostModel.findOneOrFail(id);
      Object.assign(post, { ...req.body });
      await post.save();

      res.status(200).json({
        meta: {},
        payload: {
          post: {
            id,
            title,
            body
          }
        }
      });
    } catch (error) {
      logger.error(error);
      res.status(404).json({ error });
    }
  }

  @Delete(':id')
  @Middleware(JwtManager.middleware)
  private async deletePost(req: ISecureRequest, res: Response): Promise<void> {
    logger.info('deletePost params POST_ID:', { ...req.params });
    const { id } = req.params;
    try {
      const post = await PostModel.findOneOrFail(id);
      await post.remove();
      res.status(200).json({
        meta: {},
        payload: {
          message: 'success'
        }
      });
    } catch (error) {
      logger.error(error);
      res.status(404).json({ error });
    }
  }

  @Get('query/some/posts')
  @Middleware(JwtManager.middleware)
  private async getSomePost(req: ISecureRequest, res: Response): Promise<void> {
    logger.info('getSomePost params POST_QUERY:', { ...req.query });
    const offset = req.query?.offset ?? 0;
    const limit = req.query?.limit ?? 10;
    try {
      const posts: PostModel[] = await PostModel.find({
        select: ['id', 'title', 'body', 'createdAt'],
        skip: offset,
        take: limit,
        order: { createdAt: 'DESC' }
      });
      res.status(200).json({
        meta: {},
        payload: {
          posts
        }
      });
    } catch (error) {
      logger.error(error);
      res.status(404).json({ error });
    }
  }
}
