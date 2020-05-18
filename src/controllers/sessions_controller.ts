import { Controller, Post, Middleware } from '@overnightjs/core';
import { BaseController } from './base_controller';
import { SessionsMiddleware } from '../middlewares/sessions_middlewares';
import { Request, Response } from 'express';
import { logger } from '../../config/logger';

@Controller('')
export class SessionsController extends BaseController {
  @Post('signup')
  @Middleware([SessionsMiddleware.validateUserOnSignup, SessionsMiddleware.generateTokenUsingJWT])
  private async userSignUp(req: Request, res: Response): Promise<void> {
    const { user, token } = res.locals;
    const { id, username, email } = user;
    logger.info(`User: ${username} has signed up!`);
    res.status(201).json({
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
  @Middleware([SessionsMiddleware.checkUserBeforeLogin, SessionsMiddleware.generateTokenUsingJWT])
  private async userLogin(req: Request, res: Response): Promise<void> {
    const { user, token } = res.locals;
    const { id, email, username } = user;
    logger.info('User success login!');
    res.status(201).json({
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
