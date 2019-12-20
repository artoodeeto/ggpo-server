import { Controller, Children, ChildControllers } from '@overnightjs/core';
import { UsersController } from './users_controller';
import { BaseController } from './base_controller';

/**
 * Use this for client API
 */
@Controller(`${process.env.PREFIX}/${process.env.API_VERSION}`)
@ChildControllers([new UsersController()])
export class ParentController extends BaseController { }
