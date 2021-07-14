export interface ErrorResponseType {
  errorType: string;
  statusCode: number;
  error: object;
}

export interface ErrorType {
  errorType: string;
  errMsg: object;
}

export enum ErrorTypeEnums {
  QueryFailedError = 'QueryFailedError',
  ValidationError = 'ValidationError',
  EntityNotFoundError = 'EntityNotFoundError',
  EntityNotFound = 'EntityNotFound',
  IncorrectCredentials = 'IncorrectCredentials',
  JWTokenError = 'JWTokenError',
  EntityValidationError = 'EntityValidationError',
  DuplicateEntryError = 'DuplicateEntryError',
  UnauthorizedError = 'UnauthorizedError',
  Unauthorized = 'Unauthorized'
}
