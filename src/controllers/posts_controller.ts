import { BaseController } from './base_controller';
import { Controller, Post, Middleware, Get, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Post as PostModel } from '../models/post';
import { ISecureRequest, JwtManager } from '@overnightjs/jwt';
import { User } from '../models/user';

@Controller('posts')
export class PostsController extends BaseController {
  @Post('')
  @Middleware(JwtManager.middleware)
  private async createPost(req: ISecureRequest, res: Response): Promise<void> {
    const { id } = req.payload;
    const post: PostModel = PostModel.create(req.body);
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
      res.status(400).json({ error });
    }
  }

  @Get(':id')
  @Middleware(JwtManager.middleware)
  private async readPost(req: ISecureRequest, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      res.status(200).json({
        meta: {},
        payload: {
          post: await PostModel.findOneOrFail(id)
        }
      });
    } catch (error) {
      res.status(404).json({ error });
    }
  }

  @Put(':id')
  @Middleware(JwtManager.middleware)
  private async updatePost(req: ISecureRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { title, body } = req.body;
    try {
      await PostModel.findOneOrFail(id);
      await PostModel.update(id, { title, body });
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
      res.status(404).json({ error });
    }
  }

  @Delete(':id')
  @Middleware(JwtManager.middleware)
  private async deletePost(req: ISecureRequest, res: Response): Promise<void> {
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
      res.status(404).json({ error });
    }
  }

  @Get('query/some/posts')
  @Middleware(JwtManager.middleware)
  private async getSomePost(req: ISecureRequest, res: Response): Promise<void> {
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
      res.status(404).json({ error });
    }
  }
}
