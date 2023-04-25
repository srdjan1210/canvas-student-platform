import { BaseException } from '../../../application/shared/base.exception';

export class StudentNotEnrolledInCourseException extends BaseException {
  constructor() {
    super('Student not enrolled in course!');
  }
}
