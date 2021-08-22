import { User } from '../models/user';

export class FacebookAuthError extends Error {
  name = 'FacebookAuthError';

  constructor(err: Error) {
    super();
    this.message = err.message;
  }
}
