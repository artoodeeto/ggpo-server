import { errorControllerHandler } from '../../helpers/contoller_error';
import { QueryFailedError } from 'typeorm/error/QueryFailedError';

const queryFailedError: unknown = {
  error: {
    message: "Duplicate entry 'new1@gmail.com' for key 'email'",
    code: 'ER_DUP_ENTRY',
    errno: 1062,
    sqlState: '23000',
    sqlMessage: "Duplicate entry 'new1@gmail.com' for key 'email'",
    name: 'QueryFailedError',
    query:
      'INSERT INTO `users`(`id`, `username`, `email`, `password`, `createdAt`, `updatedAt`, `deletedAt`) VALUES (DEFAULT, ?, ?, ?, DEFAULT, DEFAULT, DEFAULT)',
    parameters: ['new1', 'new1@gmail.com', '$2b$11$a71VewhNF3hT7VFSKKzhjeZ5wgbdymh.CG4DV1ITytBY2Btid90Y2']
  }
};

const validatationError = [
  {
    value: 'ne',
    property: 'email',
    children: [],
    constraints: { isEmail: 'email must be an email' }
  },
  {
    value: 'asd!',
    property: 'password',
    children: [],
    constraints: {
      matches: 'password must match /[0-9]/ regular expression',
      minLength: 'password must be longer than or equal to 8 characters'
    }
  }
];

/**
 * FIXME: Unable to create a test because I thought I can just typecast the error
 * that was produced by the controllers.
 * If I typecast the literal objects the constructor name would be Object
 */

describe.skip('Controller Error Handler', () => {
  it('QueryFailedError', () => {
    const { statusCode, errorMessage, errorType } = errorControllerHandler(queryFailedError as QueryFailedError);

    expect(statusCode).toBe(200);
  });
});
