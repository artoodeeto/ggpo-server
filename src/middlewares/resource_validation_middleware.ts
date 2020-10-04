import { User } from '../models/user';
import { ISecureRequest } from '@overnightjs/jwt';
import { Response, NextFunction } from 'express';
import { Post } from '../models/post';

export class ResourceValidation {
  static checkIfCurrentUserIsOwnerOfResource(model: User | Post): any {
    const currentModel = model;
    return async (req: ISecureRequest, res: Response, next: NextFunction): Promise<void> => {
      const requestId = req.params.id;
      const { id } = req.payload;
      const isOwner = await currentModel.isOwnerOfResource(id, Number(requestId));
      // TODO:
      // instead of throwing unauthorized error every time a user access a resource that the current user doesnt owned
      // we'll check first if that resource is in db so we can throw entity not found if its not
      if (isOwner) {
        next();
      } else {
        res.status(401).json({ msg: 'Unauthorized user' });
      }
    };
  }
}
