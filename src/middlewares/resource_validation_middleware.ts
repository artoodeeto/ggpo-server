// implement state design pattern

import { User } from '../models/user';

export class ResourceValidation {
  modelContext: any;

  constructor(model: any) {
    console.log(model);
    this.modelContext = model;
  }

  checkIfCurrentUserIsOwnerOfResource(model: any): any {
    console.log(model.foo());
    console.log(this, 'adsfadsfasdfasdasdfasdfasdfasdfasdff');
    // this.modelContext.foo();
    // next();
    return function(req: any, res: any, next: any): void {
      // console.log(res);
      // next();
    };
  }

  // setModelContext(model: any): void {
  //   this.modelContext = model;
  // }
}
