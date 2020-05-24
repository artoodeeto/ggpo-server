import { Request, Response, NextFunction } from 'express';
import { JwtManager } from '@overnightjs/jwt';
import bcrypt from 'bcrypt';
import { User } from '../models/user';
import { logger } from '../../config/logger';
import { errorControllerHandler } from '../../helpers/contoller_error';

export class SessionsMiddleware {
  static async validateUserOnSignup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      /**
       * {@link https://github.com/typeorm/typeorm/issues/5699}
       */
      logger.info('Creating User');
      const user: User = User.create(req.body as User);
      res.locals = {
        user: await user.save()
      };
      logger.info('User created');
      logger.info('User validated');
      next();
    } catch (error) {
      logger.error(error);
      const { statusCode, errorMessage, errorType } = errorControllerHandler(error);
      res.status(statusCode).json({
        errorType,
        errorMessage
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
      if (isPasswordCorrect) {
        logger.info('User has correct password');
        res.locals = {
          user
        };
        next();
      } else {
        logger.info('Incorrect Password!');
        const { errorMessage, errorType } = errorControllerHandler('CLIENT', {
          misMatchPassword: 'Password does not match the email'
        });
        res.status(400).json({
          errorType,
          errorMessage
        });
      }
    } catch (error) {
      logger.error(error);
      const { errorMessage, errorType } = errorControllerHandler('CLIENT', {
        noEmail: 'Incorrect Email'
      });
      res.status(404).json({
        errorType,
        errorMessage
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
      const { errorMessage, errorType } = errorControllerHandler('SERVER', { serverErr: 'Can not Generate Token' });
      res.status(500).json({
        errorType,
        errorMessage
      });
    }
  }
}
