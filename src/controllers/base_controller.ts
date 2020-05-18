import { errorControllerHandler } from '../../helpers/contoller_error';
import { ErrorResponse } from '../../interfaces/error_response';

export class BaseController {
  controllerErrors(error: any): ErrorResponse {
    return errorControllerHandler(error);
  }
}
