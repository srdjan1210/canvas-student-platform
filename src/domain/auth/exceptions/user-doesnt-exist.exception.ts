import { BaseException } from '../../../application/shared/base.exception';

export class UserDoesntExistException extends BaseException {
  constructor() {
    super("User doesn't exist!");
  }
}
