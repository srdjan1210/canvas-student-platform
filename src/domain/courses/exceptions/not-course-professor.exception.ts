import { BaseException } from '../../../application/shared/base.exception';

export class NotCourseProfessorException extends BaseException {
  constructor() {
    super('Not course professor!');
  }
}
