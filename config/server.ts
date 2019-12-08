// this should be the very top, should be called before the controllers
require('dotenv').config();

import 'reflect-metadata';

import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { createConnection } from 'typeorm';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as controllers from '../src/controllers/controller_imports';
import ormConfig from '../ormconfig';

export class AppServer extends Server {
  constructor() {
    super(process.env.NODE_ENV === 'development');
    this.app.use(helmet());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.setupControllers();
  }

  /**
   * this is being export into the test file so request package can use this instance
   */
  get appInstance(): any {
    return this.app;
  }

  private setupControllers(): void {
    const controllerInstances = [];

    // eslint-disable-next-line
    for (const name of Object.keys(controllers)) {
      const Controller = (controllers as any)[name];
      if (typeof Controller === 'function') {
        controllerInstances.push(new Controller());
      }
    }

    /* You can add option router as second argument */
    super.addControllers(controllerInstances);
  }

  private startServer(portNum?: number): void {
    const port = portNum || 8000;
    this.app.listen(port, () => {
      Logger.Info(`Server Running on port: ${port}`);
    });
  }

  /**
   * start Database first then the server
   */
  public async startDB(): Promise<any> {
    Logger.Info('Setting up database ...');
    try {
      await createConnection(ormConfig);
      this.startServer();
      Logger.Info('Database connected');
    } catch (error) {
      Logger.Warn(error);
      return Promise.reject('Server Failed, Restart again...');
    }
  }
}
