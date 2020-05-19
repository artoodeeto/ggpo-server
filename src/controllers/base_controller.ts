import { errorControllerHandler } from '../../helpers/contoller_error';
import { ErrorResponseType } from '../../interfaces/error_response';

export class BaseController {
  controllerErrors(error: any): ErrorResponseType {
    return errorControllerHandler(error);
  }
}
