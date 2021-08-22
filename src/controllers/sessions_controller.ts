import { Controller, Post, Middleware, Get } from '@overnightjs/core';
import { BaseController } from './base_controller';
import { SessionsMiddleware } from '../middlewares/sessions_middlewares';
import { Request, Response } from 'express';
import { logger } from '../../config/logger';
import { JwtManager } from '@overnightjs/jwt';

/**
 * FIXME: token should be removed from the json response
 * FIXME: we will put the token in the cookie
 *
 * @deprecated This module is deprecated. Will be using OAuth (Passport) instead
 */
@Controller('')
export class SessionsController extends BaseController {
  /**
   * @deprecated We use Passport facebook strategy
   */
  @Post('signup')
  @Middleware([SessionsMiddleware.validateUserOnSignup])
  public async userSignUp(req: Request, res: Response): Promise<void> {
    const { user, token } = res.locals;
    const { id, username, email } = user;
    logger.info(`User: ${username} has signed up!`);

    res
      .cookie(`${process.env.GGPO_COOKIE}`, token, {
        maxAge: Number(process.env.TOKEN_EXP),
        path: '/',
        sameSite: 'lax'
      })
      .status(201)
      .json({
        meta: {
          issueDate: Date.now(),
          expToken: Number(process.env.TOKEN_EXP)
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

  /**
   * @deprecated We use Passport facebook strategy
   */
  @Post('login')
  @Middleware([SessionsMiddleware.checkUserBeforeLogin])
  public async userLogin(req: Request, res: Response): Promise<void> {
    const { user, token } = res.locals;
    const { id, email, username } = user;
    logger.info('User success login!');
    res
      .cookie(`${process.env.GGPO_COOKIE}`, token, {
        maxAge: Number(process.env.TOKEN_EXP),
        path: '/',
        sameSite: 'lax'
      })
      .status(201)
      .json({
        meta: {
          issueDate: Date.now(),
          expToken: Number(process.env.TOKEN_EXP)
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

  @Get('logout')
  @Middleware(JwtManager.middleware)
  public async logout(req: Request, res: Response): Promise<void> {
    logger.info(res.cookie, 'RESPONSE COOKIE:');
    logger.info(res.header, 'RESPONSE HEADER:');
    // res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Methods', 'GET');
    // res.header('Access-Control-Allow-Credentials', 'true');
    req.logOut();
    res.clearCookie(`${process.env.GGPO_COOKIE}`);
    res.status(204).json();
  }
}
