import { User } from '../models/user';
import { ISecureRequest } from '@overnightjs/jwt';
import { Response, NextFunction } from 'express';
import { Post } from '../models/post';
import { BaseEntity } from 'typeorm';
import { BaseModel } from '../models/base_model';
import { Unauthorized } from '../errors/unauthorized';

export class ResourceValidation {
  static checkIfCurrentUserIsOwnerOfResource(model: BaseModel): any {
    const currentModel = model;
    return async (req: ISecureRequest, res: Response, next: NextFunction): Promise<void> => {
      const requestId = req.params.id;
      const { id } = req.payload;
      try {
        const isOwner = await currentModel.isOwnerOfResource(id, Number(requestId));
        if (isOwner) {
          next();
        } else {
          next(new Unauthorized());
        }
      } catch (error) {
        next(error);
      }
    };
  }
}
