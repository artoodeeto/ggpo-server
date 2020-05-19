export interface ErrorResponseType {
  errorType: string;
  statusCode: number;
  errorMessage: string | undefined;
}

export interface ErrorType {
  errorType: string;
  errMsg: string | any;
}

export enum ErrorTypeEnums {
  QueryFailedError = 'QueryFailedError',
  ValidationError = 'ValidationError',
  EntityNotFoundError = 'EntityNotFoundError',
  EntityNotFound = 'EntityNotFound'
}
