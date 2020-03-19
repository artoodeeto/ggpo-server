import { Request, Response, NextFunction } from 'express';
import { JwtManager } from '@overnightjs/jwt';
import bcrypt from 'bcrypt';
import { User } from '../models/user';

export class ValidateUserMiddleware {
  static async validateUserOnSignup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      /**
       * {@link https://github.com/typeorm/typeorm/issues/5699}
       */
      const user: User = User.create(req.body as User);

      await user.validateModel();

      res.locals = {
        user: await user.save()
      };
      next();
    } catch (error) {
      res.status(400).json({
        error
      });
    }
  }

  static async checkUserBeforeLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;

    try {
      const user: User = await User.findOneOrFail({
        select: ['id', 'email', 'password', 'username'],
        where: { email }
      });
      const isPasswordCorrect: boolean = await bcrypt.compare(password, user.password);

      if (isPasswordCorrect) {
        res.locals = {
          user
        };
        next();
      } else {
        res.status(400).json({
          error: 'incorrect credentials'
        });
      }
    } catch (error) {
      res.status(404).json({
        error: `no user with ${email}`
      });
    }
  }

  static generateTokenUsingJWT(req: Request, res: Response, next: NextFunction): void {
    const { user } = res.locals;
    const { id, email, username } = user;

    const token = JwtManager.jwt({
      id,
      email,
      username
    });
    if (token) {
      res.locals = {
        token,
        user
      };
      next();
    } else {
      res.status(500).json({
        error: 'Can not generate token'
      });
    }
  }
}
