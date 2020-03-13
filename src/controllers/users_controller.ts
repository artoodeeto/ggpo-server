import { Controller, Get, Middleware, Delete, Put } from '@overnightjs/core';
import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import { Response } from 'express';
import { BaseController } from './base_controller';
import { User } from '../models/user';
import { getManager, getRepository } from 'typeorm';

@Controller('users')
export class UsersController extends BaseController {
  @Get(':id')
  @Middleware(JwtManager.middleware)
  private async readUser(req: ISecureRequest, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const { username, email } = await User.findOneOrFail(id);
      res.json({
        meta: {},
        payload: {
          id,
          username,
          email
        }
      });
    } catch (error) {
      res.status(404).json({
        error
      });
    }
  }

  // FIXME: fix this bullshit
  @Put(':id')
  @Middleware(JwtManager.middleware)
  private async updateUser(req: ISecureRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const userBody = req.body;
    const entityManager = getManager();
    try {
      const user: User = await User.findOneOrFail(id);
      const updatedUser = User.create({ id, ...userBody });
      console.log(updatedUser);
      res.json({
        meta: {},
        payload: {
          user: await entityManager.save(updatedUser)
        }
      });
    } catch (error) {
      res.status(404).json({
        error
      });
    }
  }

  @Delete(':id')
  @Middleware(JwtManager.middleware)
  private async deleteUser(req: ISecureRequest, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      /**
       * @description softRemove is not yet implemented in BaseEntity
       * for now use Repository
       */
      // const user = await User.findOneOrFail(id);
      // const repo = getRepository(User);
      // const toDeleteUser = await repo.findOneOrFail(id);
      // await repo.softRemove(toDeleteUser);
      // const man = await getManager();
      // const findUser = await man.findOneOrFail(User, id);
      // const delUser = await man.softRemove(findUser);

      res.status(200).json({
        meta: {
          deleteAt: 'some date'
        },
        payload: {}
      });
    } catch (error) {
      res.status(404).json({
        error
      });
    }
  }

  @Get('query/some/users')
  @Middleware(JwtManager.middleware)
  private async getSomeUsers(req: ISecureRequest, res: Response): Promise<void> {
    const offset = req.query?.offset ?? 0;
    try {
      res.json({
        meta: {},
        payload: {
          users: await User.find({
            select: ['id', 'email', 'username'],
            skip: offset,
            take: 10,
            order: { id: 'ASC' }
          })
        }
      });
    } catch (error) {
      res.status(400).json({
        error
      });
    }
  }

  @Get('protected/route')
  @Middleware(JwtManager.middleware)
  private async protected(req: ISecureRequest, res: Response): Promise<void> {
    res.json({
      message: 'protected',
      payload: req.payload
    });
  }
}
