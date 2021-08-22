import { Controller, Post, Middleware, Get } from '@overnightjs/core';
import { BaseController } from './base_controller';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { facebookPassportOptions } from '../../config/passportAuthOptions';
import { User } from '../models/user';
import { AuthProvider } from '../models/auth_provider';
import { QueryFailedError } from 'typeorm/error/QueryFailedError';
import { FacebookAuthError } from '../errors/facebookAuthError';
import { logger } from '../../config/logger';
import { ISecureRequest, JwtManager } from '@overnightjs/jwt';

@Controller('auth')
export class PassportAuthController extends BaseController {
  /**
   * This is the entry point for the facebook authentication.
   * it will redirect to facebookRedirect() method. (see passportAuthOptions for callbackURL)
   * After redirecting I thought it can pass a json data to the frontend, but instead it was
   * throwing CORS error on the frontend so I created a InterceptAuth on the frontend to request
   * for USER info. It'll send a cookie with the token and redirect to the frontend (intercept-auth route)
   *
   */
  @Get('facebook')
  @Middleware([passport.authenticate('facebook', { scope: ['email', 'public_profile'] })])
  public facebookLogin(req: Request, res: Response, next: NextFunction): void {
    // res.redirect(
    //   'https://www.facebook.com/v11.0/dialog/oauth?client_id=364559735015902&redirect_uri=http://localhost:8000/api/v1/facebook-redirect/&state={st=state123abc,ds=123456789}&response_type=code&scope=email,public_profile'
    // );
  }

  @Get('redirect')
  @Middleware([
    passport.authenticate('facebook', {
      failureRedirect: '/api/v1/auth/failed-redirect'
    })
  ])
  public facebookRedirect(req: Request, res: Response, next: NextFunction): void {
    const user = req?.user;
    if (!user) {
      next(new FacebookAuthError(new Error('facebook redirect error')));
      return;
    }
    const { token } = user as User;

    res.cookie(`${process.env.GGPO_COOKIE}`, token, {
      maxAge: Number(process.env.TOKEN_EXP),
      path: '/',
      sameSite: 'lax',
      secure: true
    });
    res.redirect(`${process.env.FRONTEND_BASE_URL}/intercept`);
  }

  /**
   * This route is used to get user info from JWT on Authorization header.
   * All data are coming from JWT itself, no querying since thats the only data that I want to get.
   *
   */
  @Get('user')
  @Middleware(JwtManager.middleware)
  public user(req: ISecureRequest, res: Response): void {
    const { id, email, username } = req.payload;
    res.status(200).json({
      meta: {
        issueDate: Date.now(),
        expToken: Number(process.env.TOKEN_EXP)
      },
      payload: {
        user: {
          id,
          username,
          email
        }
      }
    });
  }

  @Get('failed-redirect')
  public facebookFailedRedirect(req: Request, res: Response): void {
    res.redirect(`${process.env.FRONTEND_BASE_URL}`);
  }
}
