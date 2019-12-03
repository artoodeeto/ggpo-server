import { BaseController } from "./base_controller";
import { Controller, Get } from "@overnightjs/core";
import { Request, Response } from "express";

@Controller(`${process.env.PREFIX}/${process.env.API_VERSION}/users`)
export class UsersController extends BaseController {

  @Get()
  private async getAllUsers(req: Request, res: Response) {
    res.json({
      message: 'hello from users'
    })
  }
}