export class IncorrectCredentials extends Error {
  name = 'IncorrectCredentials';

  constructor() {
    super();
    this.message = 'Incorrect credentials';
  }
}
