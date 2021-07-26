import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
import { logger } from '../../config/logger';

export class SessionsMiddleware {
  static async validateUserOnSignup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      /**
       * {@link https://github.com/typeorm/typeorm/issues/5699}
       */
      logger.info('Creating User');
      const user: User = await User.create(req.body as User).save();
      user.generateJWToken();
      res.locals = {
        user: user,
        token: user.token
      };
      logger.info('User created');
      logger.info('User validated');
      next();
    } catch (error) {
      next(error);
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
      await user.hasCorrectPassword(password);
      user.generateJWToken();
      logger.info('User has correct password');
      res.locals = {
        user,
        token: user.token
      };
      next();
    } catch (error) {
      next(error);
    }
  }
}
