/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Controller, Post, Middleware, Get, Delete } from '@overnightjs/core';
import { BaseController } from './base_controller';
import { ValidateUserMiddleware } from '../middlewares/user_middlewares';
import { Request, Response } from 'express';
import { logger } from '../../config/logger';

@Controller('')
export class SessionController extends BaseController {
  @Post('signup')
  @Middleware([ValidateUserMiddleware.validateUserOnSignup, ValidateUserMiddleware.generateTokenUsingJWT])
  private async userSignUp(req: Request, res: Response) {
    const { user, token } = res.locals;
    const { id, username, email } = user;
    logger.info(`User: ${username} has signed up!`);
    res.status(200).json({
      meta: {
        issueDate: Date.now(),
        expToken: process.env.TOKEN_EXP
      },
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
  @Middleware([ValidateUserMiddleware.checkUserBeforeLogin, ValidateUserMiddleware.generateTokenUsingJWT])
  private async userLogin(req: Request, res: Response) {
    const { user, token } = res.locals;
    const { id, email, username } = user;
    logger.info('User success login!');
    res.status(200).json({
      meta: {
        issueDate: Date.now(),
        expToken: process.env.TOKEN_EXP
      },
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
}
