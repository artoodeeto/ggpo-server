export class Unauthorized extends Error {
  name = 'Unauthorized';

  constructor() {
    super();
    this.message = 'Unauthorized user';
  }
}
