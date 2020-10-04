import { BaseController } from './base_controller';
import { Controller, Post, Middleware, Get, Put, Delete } from '@overnightjs/core';
import { Response } from 'express';
import { Post as PostModel } from '../models/post';
import { ISecureRequest, JwtManager } from '@overnightjs/jwt';
import { User } from '../models/user';
import { logger } from '../../config/logger';
import { ResourceValidation } from '../middlewares/resource_validation_middleware';

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
      const { id: postID, title, body, updatedAt, createdAt } = await post.save();

      res.status(201).json({
        meta: {},
        payload: {
          post: {
            id: postID,
            title,
            body,
            createdAt,
            updatedAt
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

  @Get(':id')
  @Middleware(JwtManager.middleware)
  private async readPost(req: ISecureRequest, res: Response): Promise<void> {
    logger.info('readPost params POST_ID:', { ...req.params });
    const { id } = req.params;
    try {
      const { title, body, createdAt, updatedAt } = await PostModel.findOneOrFail(id);

      res.status(200).json({
        meta: {},
        payload: {
          post: {
            id,
            title,
            body,
            createdAt,
            updatedAt
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
  @Middleware([JwtManager.middleware, ResourceValidation.checkIfCurrentUserIsOwnerOfResource(new PostModel())])
  private async updatePost(req: ISecureRequest, res: Response): Promise<void> {
    logger.info('updatePost params POST_ID:', { ...req.params });
    logger.info('updatePost params POST_BODY:', { ...req.body });
    const { id } = req.params;
    const { title, body } = req.body;

    try {
      const post: PostModel = await PostModel.findOneOrFail(id);
      Object.assign(post, { ...req.body });
      await post.save();
      const { createdAt, updatedAt } = post;
      res.status(201).json({
        meta: {},
        payload: {
          post: {
            id,
            title,
            body,
            createdAt,
            updatedAt
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

  @Delete(':id')
  @Middleware([JwtManager.middleware, ResourceValidation.checkIfCurrentUserIsOwnerOfResource(new PostModel())])
  private async deletePost(req: ISecureRequest, res: Response): Promise<void> {
    logger.info('deletePost params POST_ID:', { ...req.params });
    const { id } = req.params;
    try {
      const post = await PostModel.findOneOrFail(id);
      await post.remove();
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

  @Get('query/some/posts')
  @Middleware(JwtManager.middleware)
  private async getSomePost(req: ISecureRequest, res: Response): Promise<void> {
    logger.info('getSomePost params POST_QUERY:', { ...req.query });
    const offset = req.query?.offset ?? 0;
    const limit = req.query?.limit ?? 10;
    try {
      // comments are my attempts not to use query builder! ggrr!

      // const p = PostModel.find({
      //   select: ['id', 'title', 'body', 'createdAt'],
      //   skip: offset,
      //   take: limit,
      //   order: { createdAt: 'DESC' }
      // });

      // const p = PostModel.find({
      //   join: {
      //     alias: 'post',
      //     innerJoinAndSelect: {
      //       user: 'post.user'
      //     }
      //   },
      //   select: ['id', 'title', 'body', 'createdAt'],
      //   skip: offset,
      //   take: limit
      // });

      const p = PostModel.createQueryBuilder()
        .select(['post.id', 'post.title', 'post.body', 'post.createdAt'])
        .from(PostModel, 'post')
        .innerJoin('post.user', 'user')
        .addSelect(['user.id', 'user.username', 'user.email'])
        .skip(offset)
        .take(limit)
        .orderBy('post.createdAt', 'DESC')
        .getMany();

      /** explanation on why theres a separate query for count is on getSomeGameGroup */
      const c = PostModel.count();

      const [count, posts] = await Promise.all([c, p]);

      res.status(200).json({
        meta: {
          count
        },
        payload: {
          posts
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
}
