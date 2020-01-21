import { Controller, Get, Post, Middleware } from '@overnightjs/core';
import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import { Request, Response } from 'express';
import { BaseController } from './base_controller';
import { User } from '../models/user_model';
import { UserMiddleware } from '../middlewares/user_middlewares';

@Controller('users')
export class UsersController extends BaseController {
  @Post('signup')
  @Middleware([UserMiddleware.validateUserOnSignup, UserMiddleware.generateTokenUsingJWT])
  private async userSignUp(req: Request, res: Response) {
    const { user, token } = res.locals;
    const { id, username, email } = user;
    res.status(200).json({
      meta: {},
      payload: {
        user: {
          id,
          username,
          email
        },
        token
      }
    });
  }

  @Post('login')
  @Middleware([UserMiddleware.checkUserBeforeLogin, UserMiddleware.generateTokenUsingJWT])
  private async userLogin(req: Request, res: Response) {
    const { user, token } = res.locals;
    const { id, email, username } = user;
    res.status(200).json({
      meta: {},
      payload: {
        user: {
          id,
          email,
          username
        },
        token
      }
    });
  }

  @Get('')
  @Middleware(JwtManager.middleware)
  private async getAllUsers(req: ISecureRequest, res: Response) {
    const offset = req.query?.offset ?? 0;
    try {
      res.json({
        meta: {},
        payload: {
          users: await User.find({
            select: ['id', 'email', 'username'],
            skip: offset,
            take: 10,
            order: { id: 'ASC' }
          })
        }
      });
    } catch (error) {
      res.status(400).json({
        error
      });
    }
  }

  @Get(':id')
  @Middleware(JwtManager.middleware)
  private async getSingleUser(req: ISecureRequest, res: Response) {
    const { id } = req.params;
    try {
      const { username, email } = await User.findOneOrFail(id);
      res.json({
        meta: {},
        payload: {
          username,
          email
        }
      });
    } catch (error) {
      res.status(404).json({
        error
      });
    }
  }

  @Get('protected/route')
  @Middleware(JwtManager.middleware)
  private async protected(req: ISecureRequest, res: Response) {
    res.json({
      message: 'protected',
      payload: req.payload
    });
  }
}
