import { BaseEntity } from "typeorm"
import { validate } from 'class-validator';

export class BaseModel extends BaseEntity {
  async validateModel() {
    // this error returns an array
    const errors = await validate(this);
    if (errors.length > 0) {
      // to catch the error from any instance of a model we have to throw a new error
      // but this error only accept a type string, so I have to make the errors as string
      throw new Error(errors.toString());
    } else {
      return this;
    }
  }
}