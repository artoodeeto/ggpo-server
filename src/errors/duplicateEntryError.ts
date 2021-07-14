import { User } from '../models/user';

export class DuplicateEntryError extends Error {
  name = 'DuplicateEntryError';

  constructor(entity: any, msg?: string) {
    super();
    this.setErrorMessage(entity, msg);
  }

  private setErrorMessage(entity: any, _message?: string): void {
    if (entity.name === 'User') {
      this.message = _message || 'user already taken ';
    }
  }
}
