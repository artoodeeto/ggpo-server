import { Request, Response, NextFunction } from 'express';
import { JwtManager } from '@overnightjs/jwt';
import bcrypt from 'bcrypt';
import { User } from '../models/user';
import { logger } from '../../config/logger';

export class ValidateUserMiddleware {
  static async validateUserOnSignup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      /**
       * {@link https://github.com/typeorm/typeorm/issues/5699}
       */
      logger.info('Creating User');
      const user: User = User.create(req.body as User);
      logger.info('User created');
      await user.validateModel();
      logger.info('User validated');
      res.locals = {
        user: await user.save()
      };
      next();
    } catch (error) {
      logger.error(error);
      res.status(400).json({
        error
      });
    }
  }

  static async checkUserBeforeLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;

    try {
      logger.info('Testing user if already signed up...');
      const user: User = await User.findOneOrFail({
        select: ['id', 'email', 'password', 'username'],
        where: { email }
      });
      logger.info('Email unique, Testing for password...');
      const isPasswordCorrect: boolean = await bcrypt.compare(password, user.password);
      logger.info('User has correct password');
      if (isPasswordCorrect) {
        res.locals = {
          user
        };
        next();
      } else {
        logger.info('Incorrect Password!');
        res.status(400).json({
          error: 'incorrect credentials'
        });
      }
    } catch (error) {
      logger.error(error);
      res.status(404).json({
        error: `no user with ${email}`
      });
    }
  }

  static generateTokenUsingJWT(req: Request, res: Response, next: NextFunction): void {
    const { user } = res.locals;
    const { id, email, username } = user;
    logger.info('Generating Token');
    const token = JwtManager.jwt({
      id,
      email,
      username
    });
    if (token) {
      logger.info('Token Generated');
      res.locals = {
        token,
        user
      };
      next();
    } else {
      logger.error('Token Generation Failed');
      res.status(500).json({
        error: 'Can not generate token'
      });
    }
  }
}
