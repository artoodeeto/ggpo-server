import { Controller, Children, ChildControllers } from '@overnightjs/core';
import { UsersController } from './users_controller';
import { BaseController } from './base_controller';
import { PostsController } from './posts_controller';
import { SessionController } from './sessions_controller';

/**
 * Use this for client API
 */
@Controller(`${process.env.PREFIX}/${process.env.API_VERSION}`)
@ChildControllers([new UsersController(), new PostsController(), new SessionController()])
export class VersionOne extends BaseController {}
