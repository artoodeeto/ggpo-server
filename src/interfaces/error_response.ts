export interface ErrorResponseType {
  errorType: string;
  statusCode: number;
  errorMessage: object | undefined;
}

export interface ErrorType {
  errorType: string;
  errMsg: object;
}

export enum ErrorTypeEnums {
  QueryFailedError = 'QueryFailedError',
  ValidationError = 'ValidationError',
  EntityNotFoundError = 'EntityNotFoundError',
  EntityNotFound = 'EntityNotFound'
}
