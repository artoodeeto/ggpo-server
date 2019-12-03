import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
require('dotenv').config()

import * as controllers from '../src/controllers/controller_imports';


export class AppServer extends Server {

  constructor() {
    super(process.env.NODE_ENV === 'development')
    this.setupControllers();
  }

  private setupControllers(): void {
    Logger.Info('Setting up controllers...');
    const controllerInstances = [];
    for (const name of Object.keys(controllers)) {
      const controller = (controllers as any)[name];
      if (typeof controller === 'function') {
        controllerInstances.push(new controller())
      }
    }
    /* You can add option router as second argument */
    super.addControllers(controllerInstances)
  }

  public startServer(port?: number): void {
    port = port || 8000;
    this.app.listen(port, () => {
      Logger.Info(`Server Running on port: ${port}`)
    })
  }


}