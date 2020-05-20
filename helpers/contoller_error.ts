import { QueryFailedError } from 'typeorm/error/QueryFailedError';
import { ValidationError } from 'class-validator/validation/ValidationError';
import { ErrorResponseType, ErrorType, ErrorTypeEnums } from '../interfaces/error_response';

const reduceValidationError = (acc: any, nxt: any): any => {
  const newErr = { ...acc, ...nxt['constraints'] };
  return newErr;
};

function getError(error: any | QueryFailedError | ValidationError[] | ValidationError): ErrorType {
  let type = '';
  let msg: object = {};
  if ((Array.isArray(error) && error.constructor.name === 'Array') || error.constructor.name === 'ValidationError') {
    type = error[0].constructor.name;
    msg = error.reduce(reduceValidationError, {});
  } else if (error.constructor.name === 'QueryFailedError') {
    type = error.constructor.name;
    msg = {
      queryFailedErr: error.message
    };
  } else if (error.constructor.name === 'EntityNotFound' || error.constructor.name === 'EntityNotFoundError') {
    type = error.constructor.name;
    msg = {
      noEntity: 'Could not found any Entity'
    };
  }

  return {
    errorType: type,
    errMsg: msg
  };
}

/**
 * @description
 * These are the error response
 * TODO: Try to implement state pattern to remove this nasty switch case
 * Problem though is how can you implement it when errors are thrown have different implementation
 *
 * QueryFailedError comes from typeorm
 * Ex: when a user tries to signup with same email
 *
 * @param {*} error
 * @param {string} [customErrMsg] used this for custom error like 500 errors, supply error message
 * @returns {ErrorResponseType}
 */
export function errorControllerHandler(error: any, customErrMsg?: object): ErrorResponseType {
  const { errorType, errMsg: errorMessage } = getError(error);
  switch (errorType) {
    case ErrorTypeEnums.QueryFailedError: {
      return {
        errorType: ErrorTypeEnums.QueryFailedError,
        statusCode: 400,
        errorMessage
      };
    }
    case ErrorTypeEnums.ValidationError: {
      return {
        errorType: ErrorTypeEnums.ValidationError,
        statusCode: 400,
        errorMessage
      };
    }
    case ErrorTypeEnums.EntityNotFoundError: {
      return {
        errorType: ErrorTypeEnums.EntityNotFoundError,
        statusCode: 404,
        errorMessage
      };
    }
    default: {
      return {
        errorType: error,
        statusCode: 500,
        errorMessage: customErrMsg
      };
    }
  }
}
