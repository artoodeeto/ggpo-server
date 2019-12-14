import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user_model';

export class UserMiddleware {
  static async checkUserPasswordBeforeLogin(req: Request, res: Response, next: NextFunction) {
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
}
