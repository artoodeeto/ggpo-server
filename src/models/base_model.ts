import { BaseEntity } from 'typeorm';
import { validateOrReject } from 'class-validator';

export class BaseModel extends BaseEntity {
  async validateModel(): Promise<BaseModel> {
    await validateOrReject(this, { validationError: { target: false } });
    return this;
  }
}
