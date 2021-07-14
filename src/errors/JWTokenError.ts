export class JWTokenError extends Error {
  name = 'JWTokenError';

  constructor() {
    super();
    this.message = 'Error generating token';
  }
}
