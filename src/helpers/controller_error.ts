import { QueryFailedError } from 'typeorm/error/QueryFailedError';
import { ValidationError } from 'class-validator';
import { ErrorResponseType, ErrorType, ErrorTypeEnums } from '../interfaces/error_response';
import { logger } from '../../config/logger';
import { EntityValidationError } from '../errors/entityValidationError';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { IncorrectCredentials } from '../errors/incorrectCredentials';
import { DuplicateEntryError } from '../errors/duplicateEntryError';
import { Unauthorized } from '../errors/unauthorized';
import { User } from '../models/user';

const reduceValidationError = (acc: any, nxt: any): any => {
  const newErr = { ...acc, ...nxt['constraints'] };
  return newErr;
};

// TODO: FIX THIS ERROR BS!
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
export function errorControllerHandler(error: Error): ErrorResponseType {
  logger.error({ error }, 'ERROR-------');

  // if(error instanceof DuplicateEntryError(User);) {
  // }
  if (error instanceof QueryFailedError) {
    return {
      errorType: ErrorTypeEnums.QueryFailedError,
      statusCode: 400,
      error: {
        msg: error.message
      }
    };
  }
  if (error instanceof ValidationError) {
    return {
      errorType: ErrorTypeEnums.ValidationError,
      statusCode: 400,
      error: {
        msg: error.message
      }
    };
  }
  if (error instanceof EntityNotFoundError) {
    // const err = new IncorrectCredentials()
    return {
      errorType: ErrorTypeEnums.EntityNotFoundError,
      statusCode: 404,
      error: {
        messageErr: error.message, // FIXME: Remove this error
        msg: 'Resource Not Found'
      }
    };
  }
  if (error instanceof IncorrectCredentials) {
    return {
      errorType: ErrorTypeEnums.IncorrectCredentials,
      statusCode: 404,
      error: {
        msg: error.message
      }
    };
  }
  if (error instanceof EntityValidationError) {
    return {
      errorType: ErrorTypeEnums.EntityValidationError,
      statusCode: 400,
      error: {
        msg: error.message,
        errors: error.constraints
      }
    };
  }
  if (error.constructor.name === 'UnauthorizedError') {
    return {
      errorType: ErrorTypeEnums.UnauthorizedError,
      statusCode: 401,
      error: {
        msg: error.message
      }
    };
  }
  if (error instanceof Unauthorized) {
    return {
      errorType: ErrorTypeEnums.Unauthorized,
      statusCode: 401,
      error: {
        msg: error.message
      }
    };
  }
  return {
    errorType: error.name,
    statusCode: 500,
    error: {
      msg: `server Error: ${error.message}`
    }
  };
}
