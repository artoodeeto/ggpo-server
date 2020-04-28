// ! this should be the very top, should be called before the controllers
require('dotenv').config();

import 'reflect-metadata';

import { Server } from '@overnightjs/core';
import pinoExpress from 'express-pino-logger';
import { logger } from './logger';
import { createConnection } from 'typeorm';
import * as controllers from '../src/controllers/controller_imports';

import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import cors from 'cors';

import * as swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger';

export class AppServer extends Server {
  constructor() {
    super(process.env.NODE_ENV === 'development');
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(pinoExpress({ logger }));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
      logger.info(`Server Running on port: ${port}`);
    });
  }

  /**
   * start Database first then the server
   */
  public async startDB(): Promise<void> {
    logger.info('Setting up database ...');
    try {
      await createConnection();
      this.startServer();
      logger.info('Database connected');
    } catch (error) {
      logger.warn(error);
      throw new Error(`Server failed to start. ERROR: ${error}`);
    }
  }
}
