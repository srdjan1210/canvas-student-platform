import { BaseException } from '../../../application/shared/base.exception';
import { PROFESSOR_NOT_IN_COURSE_EXCEPTION_MESSAGE } from '../course.constants';

export class ProfessorNotInCourseException extends BaseException {
  constructor() {
    super(PROFESSOR_NOT_IN_COURSE_EXCEPTION_MESSAGE);
  }
}
