import { Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { BaseController } from './base_controller';
import { UserModel } from '../models/user_model';

@Controller('users')
export class UsersController extends BaseController {
  @Get()
  private async getAllUsers(req: Request, res: Response) {
    res.json({
      message: 'hello from users'
    });
  }

  @Post('signup')
  private async userSignUp(req: Request, res: Response) {
    try {
      const user = await UserModel.create({
        ...req.body
      }).save();

      res.json({
        user
      });

    } catch (error) {
      res.json({
        errorMsg: error.message
      })
    }
  }
}
