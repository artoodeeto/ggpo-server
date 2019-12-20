import { Request, Response, NextFunction } from 'express';
import { JwtManager } from '@overnightjs/jwt';
import bcrypt from 'bcrypt';
import { User } from '../models/user_model';

export class UserMiddleware {
  static async validateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // if validation fail lets hope it throws.
      const user: User = await User.create({
        ...req.body
      }).validateModel();
      res.locals = {
        user: await user.save()
      };
      next();
    } catch (error) {
      res.json({
        error
      });
    }
  }

  static async checkUserBeforeLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;

    try {
      const user = await User.findOneOrFail({ select: ['id', 'email', 'password'], where: { email } });
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (isPasswordCorrect) {
        res.locals = {
          user
        };
        next();
      } else {
        res.json({
          error: 'incorrect password'
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
    const { id, email } = user;

    const jwt = JwtManager.jwt({
      id,
      email
    });
    if (jwt) {
      res.locals = {
        jwt,
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
