import { User } from '../models/user';
import { ISecureRequest } from '@overnightjs/jwt';
import { Response, NextFunction } from 'express';
import { Post } from '../models/post';

export class ResourceValidation {
  static checkIfCurrentUserIsOwnerOfResource(model: User | Post): any {
    const currentModel = model;
    return async function callBackResourceValidator(
      req: ISecureRequest,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      const requestId = req.params.id;
      const { id } = req.payload;
      const isOwner = await currentModel.isOwnerOfResource(id, Number(requestId));
      if (isOwner) {
        next();
      } else {
        res.status(401).json({ msg: 'Unauthorized user' });
      }
    };
  }
}
