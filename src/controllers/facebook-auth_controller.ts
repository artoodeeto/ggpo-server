import { Controller, Post, Middleware, Get } from '@overnightjs/core';
import { BaseController } from './base_controller';
import { SessionsMiddleware } from '../middlewares/sessions_middlewares';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../config/logger';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { facebookPassportOptions } from '../../config/facebook';
import { User } from '../models/user';
import { AuthProvider } from '../models/auth_provider';
import { QueryFailedError } from 'typeorm/error/QueryFailedError';

// ? Where to put these serialize and deserialize user
passport.serializeUser(function (req: any, user: any, done: any) {
  console.log('serializeUser1', user);
  done(null, user);
});

passport.deserializeUser(function (req: any, user: any, done: any) {
  console.log('deserializeUser', user);
  done(null, user);
});

@Controller('')
export class FacebookAuthController extends BaseController {
  constructor() {
    super();
    this.initFacebook();
  }

  @Get('facebook-auth')
  @Middleware([passport.authenticate('facebook', { scope: ['email', 'public_profile'] })])
  public async facebookLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    // res.redirect(
    //   'https://www.facebook.com/v11.0/dialog/oauth?client_id=364559735015902&redirect_uri=http://localhost:8000/api/v1/facebook-redirect/&state={st=state123abc,ds=123456789}&response_type=code&scope=email,public_profile'
    // );
  }

  @Get('facebook-redirect')
  @Middleware([passport.authenticate('facebook', { failureRedirect: '/api/v1/facebook-failed-redirect' })])
  public async facebookRedirect(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = req?.user;

    if (!user) {
      res.status(500);
      return;
    }

    const { id, username, email, token } = user as User;
    res.status(201).json({
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

  @Get('facebook-failed-redirect')
  public async facebookFailedRedirect(req: Request, res: Response): Promise<void> {
    res.json({ message: 'FAILED' });
  }

  private initFacebook(): void {
    passport.use(
      new FacebookStrategy(facebookPassportOptions, async (accessToken, refreshToken, profile, done) => {
        try {
          const user: User = await this.createFBUser(accessToken, profile);
          done(null, user);
        } catch (error) {
          // https://stackoverflow.com/questions/15711127/express-passport-node-js-error-handling
          if (error instanceof QueryFailedError) {
            done(null, false); // this will trigger failureRedirect
          } else {
            // create facebook error
            done(error);
          }
        }
      })
    );
  }

  private async createFBUser(accessToken: string, profile: any): Promise<User> {
    const { id, displayName, provider: prov, _json } = profile;
    const { email } = _json;

    const userLookup: User | undefined = await User.findOne({ where: { email } });
    if (userLookup) {
      userLookup.generateJWToken();
      return userLookup;
    }

    const user: User = await User.create({
      username: displayName,
      email,
      password: 'IDontKnow1!WhatToD0',
      accessToken
    } as User).save();
    user.generateJWToken();

    await AuthProvider.create({ provider_id: id, platform: prov, user } as AuthProvider).save();
    return user;
  }
}
