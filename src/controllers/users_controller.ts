import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { BaseController } from './base_controller';

@Controller('users/lol/foo/:id')
export class UsersController extends BaseController {
  @Get()
  private async getAllUsers(req: Request, res: Response) {
    console.log(req.query, req.params)
    res.json({
      message: 'hello from users'
    });
  }
}
