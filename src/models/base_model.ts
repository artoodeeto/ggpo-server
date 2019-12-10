import { BaseEntity } from 'typeorm';
import { validate } from 'class-validator';

export class BaseModel extends BaseEntity {
  async validateModel() {
    // this error returns an array
    const errors = await validate(this);
    if (errors.length > 0) {
      throw errors;
    } else {
      return this;
    }
  }
}
