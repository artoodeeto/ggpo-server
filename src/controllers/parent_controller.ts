import { Controller, Children } from '@overnightjs/core';
import { UsersController } from './users_controller';
import { BaseController } from './base_controller';


/**
 * Use this for client API
 */
@Controller('api/v1')
@Children([
  new UsersController()
])
export class ParentController extends BaseController {

}