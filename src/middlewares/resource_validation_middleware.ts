// implement state design pattern

import { User } from '../models/user';

export class ResourceValidation {
  modelContext: any;

  constructor(model: any) {
    console.log(model);
    this.modelContext = model;
  }

  checkIfCurrentUserIsOwnerOfResource(): void {
    console.log('adsfadsfasdfasdasdfasdfasdfasdfasdff');
    // this.modelContext.foo();
  }

  // setModelContext(model: any): void {
  //   this.modelContext = model;
  // }
}
