import { Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { BaseController } from './base_controller';
import { User } from '../models/user_model';

@Controller('users')
export class UsersController extends BaseController {
  @Get()
  private async getAllUsers(req: Request, res: Response) {
    try {
      res.json({
        users: await User.find()
      });
    } catch (error) {
      res.status(200).json({
        error
      });
    }
  }

  @Post('signup')
  private async userSignUp(req: Request, res: Response) {
    try {
      // if validation fail lets hope it throws.
      const user: User = await User.create({
        ...req.body
      }).validateModel();

      res.json({
        user: await user.save()
      });
    } catch (error) {
      res.json({
        error
      });
    }
  }

  @Get(':id')
  private async singleUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      res.json({
        user: await User.findOneOrFail(id)
      });
    } catch (error) {
      res.json({
        errorMsg: error
      });
    }
  }
}
