import { BaseEntity } from 'typeorm';
import { validateOrReject } from 'class-validator';

export class BaseModel extends BaseEntity {
  async validateModel() {
    // eslint-disable-next-line no-useless-catch
    try {
      await validateOrReject(this, { validationError: { target: false } });
      return this;
    } catch (error) {
      throw error;
    }
  }
}
