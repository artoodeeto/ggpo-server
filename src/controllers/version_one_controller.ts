import { Controller, ChildControllers, ClassMiddleware } from '@overnightjs/core';
import { UsersController } from './users_controller';
import { BaseController } from './base_controller';
import { PostsController } from './posts_controller';
import { SessionsController } from './sessions_controller';
import { GameGroupsController } from './game_groups_controller';
import { reqResLogger } from '../middlewares/controller_logs';

/**
 * Use this for client API
 */
@Controller(`${process.env.PREFIX}/${process.env.API_VERSION}`)
@ChildControllers([new UsersController(), new PostsController(), new SessionsController(), new GameGroupsController()])
@ClassMiddleware([reqResLogger])
export class VersionOne extends BaseController {}
