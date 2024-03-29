import { BaseException } from '../../../application/shared/base.exception';
import { COURSE_NOT_FOUND_EXCEPTION_MESSAGE } from '../course.constants';

export class CourseNotFoundException extends BaseException {
  constructor() {
    super(COURSE_NOT_FOUND_EXCEPTION_MESSAGE);
  }
}
