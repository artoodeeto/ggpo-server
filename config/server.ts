require('dotenv').config(); // this should be the very top, should be called before the controllers

import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import * as controllers from '../src/controllers/controller_imports';

export class AppServer extends Server {
  constructor() {
    super(process.env.NODE_ENV === 'development');
    this.setupControllers();
  }

  private setupControllers(): void {
    Logger.Info('Setting up controllers...');
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

  public startServer(portNum?: number): void {
    const port = portNum || 8000;
    this.app.listen(port, () => {
      Logger.Info(`Server Running on port: ${port}`);
    });
  }
}
