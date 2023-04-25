import { BaseException } from '../../../application/shared/base.exception';

export class EmailAlreadyTakenException extends BaseException {
  constructor() {
    super('Email already taken!');
  }
}
