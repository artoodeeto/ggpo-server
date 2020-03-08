/* eslint-disable no-useless-catch */
import { BaseEntity } from 'typeorm';
import { validateOrReject } from 'class-validator';

export class BaseModel extends BaseEntity {
  async validateModel() {
    try {
      await validateOrReject(this, { validationError: { target: false } });
      return this;
    } catch (error) {
      throw error;
    }
  }
}
