import { BaseEntity } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { EntityValidationError } from '../errors/entityValidationError';

export abstract class BaseModel extends BaseEntity {
  async validateModel(): Promise<BaseModel> {
    try {
      await validateOrReject(this, { validationError: { target: false }, forbidUnknownValues: true });
      return this;
    } catch (error) {
      throw new EntityValidationError(error);
    }
  }

  abstract isOwnerOfResource(currentUserId: number, requestParamsId: number): boolean | Promise<boolean>;
}
