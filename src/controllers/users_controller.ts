import { Controller, Get, Post, Middleware } from '@overnightjs/core';
import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import { Request, Response } from 'express';
import { BaseController } from './base_controller';
import { User } from '../models/user_model';
import { UserMiddleware } from '../middlewares/user_middlewares';

@Controller('users')
export class UsersController extends BaseController {
  @Post('signup')
  @Middleware([UserMiddleware.validateUser, UserMiddleware.generateTokenUsingJWT])
  private async userSignUp(req: Request, res: Response) {
    const { user, jwt } = res.locals;
    try {
      res.json({
        meta: {},
        payload: {
          user: {
            username: user.username
          },
          jwt
        }
      });
    } catch (error) {
      res.json({
        error
      });
    }
  }

  @Post('login')
  @Middleware([UserMiddleware.checkUserBeforeLogin, UserMiddleware.generateTokenUsingJWT])
  private async userLogin(req: Request, res: Response) {
    const { user, jwt } = res.locals;
    res.status(200).json({
      meta: {},
      payload: {
        jwt
      }
    });
  }

  @Get()
  private async getAllUsers(req: Request, res: Response) {
    try {
      res.json({
        users: await User.find()
      });
    } catch (error) {
      res.status(200).json({
        error
      });
    }
  }

  @Get(':id')
  private async getSingleUser(req: Request, res: Response) {
    const { id } = req.params;
    const { username, email } = await User.findOneOrFail(id);
    try {
      res.json({
        meta: {},
        payload: {
          username,
          email
        }
      });
    } catch (error) {
      res.json({
        errorMsg: error
      });
    }
  }

  // uncomment and test this route, because for some magical reason its trying to
  // query a user model even though theres no code accessing the module. crazy
  // @Get('test')
  // private async test(req: Request, res: Response) {
  //   console.log('asdfadsf');
  //   res.json({
  //     samp: 'asdf'
  //   });
  // }

  @Get('protected/route')
  @Middleware(JwtManager.middleware)
  private async protected(req: ISecureRequest, res: Response) {
    res.json({
      message: 'protected',
      payload: req.payload
    });
  }
}
